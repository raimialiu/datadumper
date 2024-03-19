import { FastifyReply, FastifyRequest } from "fastify";
import { BaseController } from "../base.controller";
import { MockerService } from "../../services/mocker/mocker.service";

export class SchemaController extends BaseController {

    constructor(private svc: MockerService) {
        super()
    }


    async getData(req: FastifyRequest, resp: FastifyReply) {
        try {
            const payload: any = req.body

            console.log(`getData of SchemaController called with`, { payload })

            const serviceResponse = await this.svc.getMockData(payload)

            return this.success(resp, serviceResponse)

        } catch (error) {
            console.log({getDataEr: error})

            return this.handleError(resp, error)

        }
    }


}