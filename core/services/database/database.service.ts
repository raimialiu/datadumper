import { DataSource, DbOptions, DeepPartial, EntityTarget, FindManyOptions, FindOneOptions, QueryRunner } from "typeorm";
import { DBConfigOptions } from "../../common/interface/program.config.interface";
import { ReadStream } from "typeorm/platform/PlatformTools";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { join } from "path";

export class DatabaseService {
    /**
     *
     */
    constructor(private dbConfig: DBConfigOptions) {

        console.log({ dbConfig })
        const entitiyDir = join(__dirname, "/../../models")

        const { DB_HOST, DB_PASS,
            DB_SYNC,
            DB_NAME,
            DB_PORT, DB_USER } = this.dbConfig

        this.__db = new DataSource({
            type: "mysql",
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USER,
            password: DB_PASS,
            database: DB_NAME,
            synchronize: DB_SYNC,
            logging: true,
            entities: [entitiyDir + "/*.model.js", entitiyDir + "/*.model.ts"],
            subscribers: [
              __dirname + "/./../../subscriber/*.ts",
              __dirname + "/./../../subscriber/*.js",
            ],
            migrations: [
              __dirname + "/./../../migration/*.ts",
              __dirname + "/./../../migration/*.js",
            ]
        })

        this.__db.initialize().then((res)=>{
            console.log({dbInitiazed: res.isInitialized})
            if(res.isInitialized) {
                process.env.DB_STARTED = this.__db.isInitialized ? '1' : ' 0'
                res.runMigrations({transaction: "all"})
            }
        }).catch(console.log)

        
    }

    private __db: DataSource

    private queryRunner: QueryRunner

    get db() {
        return this.__db
    }


    async findOne<T>(model: EntityTarget<T>, options: FindOneOptions<T>): Promise<T>
    async findOne<T>(model: EntityTarget<T>, options: FindOneOptions<T>, dataSource: DataSource): Promise<T>
    async findOne<T>(model: EntityTarget<T>, options: FindOneOptions<T>, dataSource?: DataSource): Promise<T> {
        dataSource = dataSource || this.__db

        return await dataSource.manager.findOne(model, options);
    }

    async findMany<T>(model: EntityTarget<T>, options: FindManyOptions<T>): Promise<T[]>
    async findMany<T>(model: EntityTarget<T>, options: FindManyOptions<T>, dataSource: DataSource): Promise<T[]>
    async findMany<T>(model: EntityTarget<T>, options: FindManyOptions<T>, dataSource?: DataSource): Promise<T[]> {
        dataSource = dataSource || this.__db

        return await dataSource.manager.find(model, options);
    }

    getEntityRepo<T>(targetEntity: EntityTarget<T>,
        dataSource?: DataSource) {
        dataSource = dataSource || this.__db
        return dataSource.getRepository(targetEntity)

    }

    async bulkInsert<T>(model: EntityTarget<T>, data: QueryDeepPartialEntity<T>[]): Promise<void>;
    async bulkInsert<T>(model: EntityTarget<T>, data: QueryDeepPartialEntity<T>[], dataSource: DataSource): Promise<void>;
    async bulkInsert<T>(model: EntityTarget<T>, data: QueryDeepPartialEntity<T>[], dataSource: DataSource, t: boolean): Promise<void>;
    async bulkInsert<T>(model: EntityTarget<T>, data: QueryDeepPartialEntity<T>[], dataSource: DataSource, t?: boolean): Promise<void>;
    async bulkInsert<T>(model: EntityTarget<T>, data: QueryDeepPartialEntity<T>[], dataSource?: DataSource, t?: unknown): Promise<void> {
        dataSource = dataSource || this.__db

        if (!t) {
            await dataSource.manager
                .createQueryBuilder()
                .insert()
                .into(model)
                .values(data)
                .execute();

            return;
        }

        // Use DB Transactions...
        await this.queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(model)
            .values(data)
            .execute();
        return;
    }

    getMongoEntityRepo<T>(targetEntity: EntityTarget<T>,) {
        return this.__db.getMongoRepository(targetEntity)
    }

    async upsert(entities: unknown[]): Promise<unknown[]> {
        let tasks: unknown[] = []
        entities.forEach((item) => {
            tasks.push(
                this.create(typeof item, item)
                    .catch(console.log)
            )
        })

        return await Promise.all(tasks)
    }

    async executeInTransaction<T>(save: any[], updates?: any[], deleteEntites?: any[], queries?: string[]): Promise<{ status: boolean, message?: string, data?: unknown }> {

        const queryRunner = this.__db.createQueryRunner();
        await queryRunner.connect()

        await queryRunner.startTransaction()

        try {

            let saveResult
            let updateResults: unknown[] = []
            let removeResults;
            let queryResults: unknown[] = []

            if (save.length > 0) {
                saveResult = await queryRunner.manager.save(save)
            }

            if (updates && updates.length > 0) {
                let updateTask: unknown[] = []

                updates.forEach((item) => {
                    const { target, where, data } = item;

                    updateTask.push(
                        queryRunner.manager.update(target, where, data)
                    );
                });

                updateResults = await Promise.all(updateTask)

            }

            if (queries && queries.length > 0) {
                let queryTasks: unknown[] = []
                queries.forEach((v: string) => {
                    queryTasks.push(queryRunner.manager.query(v))
                })
                queryResults = await Promise.all(queryTasks)
            }

            if (deleteEntites && deleteEntites.length > 0) {
                removeResults = await queryRunner.manager.remove(deleteEntites)
            }

            await queryRunner.commitTransaction()
            // handleFunc(true, {saveResult, updateResults, removeResults})

            return { status: true, data: { saveResult, updateResults, removeResults, queryResults } }

        } catch (error) {
            await queryRunner.rollbackTransaction()
            console.log(`rollback transaction....`)
            console.log({ queryRunnerError: error })
            return { status: false, message: error?.message }
            //  handleFunc(false, null)
        } finally {
            //
            await queryRunner.release()
        }

    }

    async countAsync<T>(model: EntityTarget<T>, options: FindManyOptions<T>): Promise<number>
    async countAsync<T>(model: EntityTarget<T>, options: FindManyOptions<T>, dataSource: DataSource): Promise<number>
    async countAsync<T>(model: EntityTarget<T>, options: FindManyOptions<T>, dataSource?: DataSource): Promise<number> {
        dataSource = dataSource || this.__db
        return await dataSource.manager.count(model, options);
    }

    async create<T>(model: EntityTarget<T>, data: DeepPartial<T>): Promise<T>
    async create<T>(model: EntityTarget<T>, data: DeepPartial<T>, dataSource: DataSource): Promise<T>
    async create<T>(model: EntityTarget<T>, data: DeepPartial<T>, dataSource: DataSource, t: boolean): Promise<T>
    async create<T>(model: EntityTarget<T>, data: DeepPartial<T>, dataSource?: DataSource, t?: boolean): Promise<T> {
        dataSource = dataSource || this.__db
        const newModel = dataSource.manager.create(model, data);

        if (!t) {
            return await dataSource.manager.save(newModel) as T;
        }

        return await this.queryRunner.manager.save(newModel) as T;
    }



    async Save<T>(data: DeepPartial<T>, dataSource?: DataSource, t?: boolean): Promise<T> {
        dataSource = dataSource || this.__db

        if (!t) {
            return await dataSource.manager.save(data) as T;
        }

        return await this.queryRunner.manager.save(data) as T;
    }


    queryBuilder<T>(model: EntityTarget<T>, alias?: string, dataSource?: DataSource) {
        dataSource = dataSource || this.__db

        return dataSource
            .createQueryBuilder(model, alias)
    }


    async stream<T>(model: EntityTarget<T>, queryBuilderName: string, condition: string, data: Object): Promise<ReadStream>;
    async stream<T>(model: EntityTarget<T>, queryBuilderName: string, condition: string, data: Object, dataSource: DataSource): Promise<ReadStream>;
    async stream<T>(model: EntityTarget<T>, queryBuilderName: string, condition: string, data: Object, dataSource?: DataSource): Promise<ReadStream>;
    async stream<T>(model: EntityTarget<T>, queryBuilderName: string, condition: string, data: Object, dataSource?: DataSource): Promise<ReadStream> {
        dataSource = dataSource || this.__db

        return await dataSource.getRepository(model)
            .createQueryBuilder(queryBuilderName)
            .where(condition, data)
            .stream();
    }


    async createMany<T>(model: EntityTarget<T>, data: DeepPartial<T[]>): Promise<T[]>
    async createMany<T>(model: EntityTarget<T>, data: DeepPartial<T[]>, dataSource: DataSource): Promise<T[]>
    async createMany<T>(model: EntityTarget<T>, data: DeepPartial<T[]>, dataSource: DataSource, t: boolean): Promise<T[]>
    async createMany<T>(model: EntityTarget<T>, data: DeepPartial<T[]>, dataSource?: DataSource, t?: boolean): Promise<T[]> {
        dataSource = dataSource || this.__db
        let createTasks: unknown[] = []

        data.forEach((item) => {
            createTasks.push(
                this.create(model, item, dataSource, t)
                    .then(console.log).catch(console.log)
            )
        })

        return await Promise.all(createTasks) as T[]
    }

    async update<T>(modelName: EntityTarget<T>, condition: QueryDeepPartialEntity<T>, model: QueryDeepPartialEntity<T>): Promise<boolean>
    async update<T>(modelName: EntityTarget<T>, condition: QueryDeepPartialEntity<T>, model: QueryDeepPartialEntity<T>, dataSource: DataSource): Promise<boolean>
    async update<T>(modelName: EntityTarget<T>, condition: QueryDeepPartialEntity<T>, model: QueryDeepPartialEntity<T>, dataSource: DataSource, t: boolean): Promise<boolean>
    async update<T>(modelName: EntityTarget<T>, condition: QueryDeepPartialEntity<T>, model: QueryDeepPartialEntity<T>, dataSource?: DataSource, t?: boolean): Promise<boolean> {
        dataSource = dataSource || this.__db
        if (!t) {
            const result = await this.__db.manager.update(modelName, condition, model);
            console.log({ result })

            return result.affected > 0;
        }

        const dbUpdateResult = await this.queryRunner.manager.update(modelName, condition, model);
        console.log({ dbUpdateResult })

        return dbUpdateResult.affected > 0
        //return true;
    }

    async rawQuery(query: string, dataSource?: DataSource) {
        dataSource = dataSource || this.__db;
        const rawData = await dataSource.manager.query(query);

        return rawData;
    }

    async startTransaction(): Promise<void> {

        if (this.queryRunner != null) {

        }

        const queryRunner = this.__db.createQueryRunner();

        // establish real database connection using our new query runner
        await queryRunner.connect();

        // lets now open a new transaction:
        await queryRunner.startTransaction()

        this.queryRunner = queryRunner;
    }

    async commitTransaction(): Promise<void> {

        try {
            if (this.queryRunner != null) {
                await this.queryRunner.commitTransaction();
                await this.release();
            }

            return;
        } catch (err) {
            await this.rollbackTransaction();
            await this.release();

            throw err;
        }
    }

    async rollbackTransaction(): Promise<void> {
        if (this.queryRunner != null) {
            await this.queryRunner.rollbackTransaction();
        }

        return;
    }

    private async release(): Promise<void> {
        if (this.queryRunner != null) {
            await this.queryRunner.release();
        }

        return;
    }


}