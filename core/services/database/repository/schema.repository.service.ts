import { DeepPartial, FindOptionsOrder, FindOptionsOrderValue, FindOptionsWhere } from "typeorm";
import { Repository, keytype } from "./interface/repository.interface";
import { DatabaseService } from "../database.service";
import { SchemaModel } from "../../../models/schema.model";
import { MongoDbService } from "../mongo.service";
import { KeysOf } from "fastify/types/type-provider";

export class SchemaRepository implements Repository {
    constructor(private db: DatabaseService, private mongo: MongoDbService) {

    }

    async SaveOne<SchemaModel>(Payload: any): Promise<SchemaModel> {
        const value = await this.db.create(SchemaModel, Payload)

        return value as SchemaModel
    }

    SaveMany<T>(Payload: DeepPartial<T>[]): Promise<T[]> {
        throw new Error("Method not implemented.");
    }

    async GetOne<SchemaModel>(condition: FindOptionsWhere<SchemaModel>): Promise<SchemaModel> {
        const findOne = await this.db.findOne(SchemaModel, {
            where: condition
        })

        return findOne as SchemaModel
    }

    async GetMany<SchemaModel>(condition: FindOptionsWhere<SchemaModel>,
        options: {
            limit: number; page_index:
            number; orderBy?: FindOptionsOrder<SchemaModel>; sortOrder: FindOptionsOrderValue;
            relations?: any;
        }): Promise<SchemaModel[]> {
        let {
            limit, page_index, orderBy, sortOrder, relations
        } = options

        page_index = page_index || 1
        limit = limit || 10
        const skip = (page_index - 1) * limit
        const findMany = await this.db.findMany(SchemaModel, {
            where: condition,
            skip,
            take: limit,
            order: orderBy || {
                created_at: sortOrder || 'DESC'
            },
            relations
        })

        return findMany as SchemaModel[]
    }

}