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

    GetMany<T>(condition: FindOptionsWhere<T>, options: { limit: number; page_index: number; orderBy?: any; sortOrder: "DESC" | "ASC"; relations?: any; }): Promise<T[]> {
        throw new Error("Method not implemented.");
    }

}