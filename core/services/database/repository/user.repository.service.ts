import { DeepPartial, EntityTarget, FindOptionsWhere } from "typeorm";
import { Repository } from "./interface/repository.interface";
import { DatabaseService } from "../database.service";
import { UsersModel } from "../../../models/users.model";

export class UserRepositoryService implements Repository {
    /**
     *
     */
    constructor(private db: DatabaseService) {


    }

    async SaveOne<UsersModel>(Payload: any): Promise<UsersModel> {
        const createResult = await this.db.create(UsersModel, Payload)

        return createResult
    }

    SaveMany<UsersModel>(Payload: DeepPartial<UsersModel>[]): Promise<UsersModel[]> {
        throw new Error("Method not implemented.");
    }

    async GetOne<UsersModel>(condition: FindOptionsWhere<UsersModel>): Promise<UsersModel> {
        const findOne = await this.db.findOne(UsersModel, {
            where: condition
        })

        return findOne as UsersModel
    }

    async GetMany<UsersModel>(condition: FindOptionsWhere<UsersModel>,
        options: { limit: number; page_index: number; orderBy?: any; sortOrder: "DESC" | "ASC"; relations?: any; }): Promise<UsersModel[]> {

        let {
            limit, page_index, orderBy, sortOrder, relations
        } = options

        page_index = page_index || 1
        limit = limit || 10
        const skip = (page_index - 1) * limit
        const findMany = await this.db.findMany(UsersModel, {
            where: condition,
            skip,
            take: limit,
            order: orderBy || {
                created_at: sortOrder || 'DESC'
            },
            relations
        })

        return findMany as UsersModel[]

    }

}