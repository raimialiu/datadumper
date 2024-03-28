import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/user/user.service";
import { BaseController } from "./base.controller";

export class UserController extends BaseController {
    constructor(private svc: UserService) {
        super()
    }


    async createUser(req: FastifyRequest, resp: FastifyReply) {
        try {
            const payload: any = req.body

            console.log(`createUser of UserController called with`, { payload })

            const serviceResponse = await this.svc.Create(payload)

            return this.success(resp, serviceResponse)

        } catch (error) {
            console.log({ getDataEr: error })

            return this.handleError(resp, error)

        }
    }

}