import { Hash } from "crypto";
import { Panic } from "../../common/constant";
import { UsersModel } from "../../models/users.model";
import { UserRepositoryService } from "../database/repository/user.repository.service";

export class UserService {
    constructor(private userRepo: UserRepositoryService) { }


    async Create(payload: {
        password_hint?: string,
        password: string,
        email: string
    }) {

        const {
            password, email: email_address, password_hint
        } = payload

        const findUser = await this.userRepo.GetOne<UsersModel>({
            email_address
        })

        if (findUser) {
            Panic('user already exist...' + email_address)
        }

        const savedResponse = await this.userRepo.SaveOne(
            UsersModel.Create({
                email_address, password,
                password_hint
            })
        )

        console.log({ savedResponse })

        return savedResponse
    }
}