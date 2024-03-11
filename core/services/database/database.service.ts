import { DataSource, DbOptions } from "typeorm";
import { DBConfigOptions } from "../../common/interface/program.config.interface";

export class DatabaseService {
    /**
     *
     */
    constructor(private dbConfig: DBConfigOptions) {

        console.log({dbConfig})

        const { DB_HOST, DB_PASS,
            DB_SYNC,
            DB_NAME,
            DB_PORT, DB_USER } = this.dbConfig

        this.db = new DataSource({
            type: "mysql",
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USER,
            password: DB_PASS,
            database: DB_NAME,
            synchronize: DB_SYNC,
            logging: true,
            entities: [],
            subscribers: [],
            migrations: [],
        })

        this.db.initialize()

        process.env.DB_STARTED  = this.db.isInitialized ? '1':' 0'
    }

    private db: DataSource
}