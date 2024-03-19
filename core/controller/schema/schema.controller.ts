import { FastifyReply, FastifyRequest } from "fastify";
import { BaseController } from "../base.controller";
import { MockerService } from "../../services/mocker/mocker.service";
import { resolve } from "node:path";
import { unlinkSync } from "node:fs";

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
            console.log({ getDataEr: error })

            return this.handleError(resp, error)

        }
    }


    async downloadData(req: FastifyRequest, resp: any) {
        try {
            const payload: any = req.body

            console.log(`downloadData of SchemaController called with`, { payload })

            const { fileFd, fileName } = await this.svc.downloadMockData(payload)

            resp.header('Content-Type', 'application/octet-stream')
            resp.header('Content-Disposition', `attachment; filename=${fileName}`)

            return resp.send(fileFd)

        } catch (error) {
            console.log({ getDataEr: error })

            return this.handleError(resp, error)

        }
    }

    async downloadData2(req: FastifyRequest, resp: FastifyReply) {
        try {
            //const payload: any = req.body

            //console.log(`downloadData of SchemaController called with`, { payload })

            // const {fileFd, fileName} = await this.svc.downloadMockData(payload)

            resp.header('Content-Type', 'application/octet-stream')
            resp.header('Content-Disposition', `attachment; filename=hello.text`)
            return resp.send(`somedata`)

        } catch (error) {
            console.log({ getDataEr: error })

            return this.handleError(resp, error)

        }
    }


}