import { FastifyReply, FastifyRequest } from "fastify";
import { BaseController } from "../base.controller";
import { MockerService } from "../../services/mocker/mocker.service";
import { resolve } from "node:path";
import { unlinkSync } from "node:fs";
import { SchemaService } from "../../services/schema/schema.service";
import Joi from "joi";

export class SchemaController extends BaseController {

    constructor(private svc: SchemaService) {
        super()
    }


    async getData(req: FastifyRequest, resp: FastifyReply) {
        try {
            const payload: any = req.body

            console.log(`getData of SchemaController called with`, { payload })

            const serviceResponse = await this.svc.createSchemaQuickly(payload)

            return this.success(resp, serviceResponse)

        } catch (error) {
            console.log({ getDataEr: error })

            return this.handleError(resp, error)

        }
    }

    async createSchema(req: FastifyRequest, resp: FastifyReply) {
        try {
            const payload: any = req.body

            const validateSchemaObject = this.defineValidationSchema({
                mockPayload: Joi.object({
                    n: Joi.number().required(),
                    data: Joi.object().required()
                }).required(),
                schemaPayload: Joi.object({
                    name: Joi.string().required(),
                    description: Joi.string().optional()
                }).required()
            })

            const { value, error } = this.validateObject(validateSchemaObject, payload)

            if (error) {
                return this.failedResponse(resp, error?.message)
            }

            console.log(`createSchema of SchemaController called with`, { payload })

            const serviceResponse = await this.svc.createSchema(payload)

            return this.success(resp, serviceResponse)

        } catch (error) {
            console.log({ getDataEr: error })

            return this.handleError(resp, error)

        }
    }


    async getSchemaData(req: FastifyRequest, resp: FastifyReply) {
        try {
            const query = (req.body as any)
            const schemaId: string = query?.schema_id as string
            const download: boolean = query?.download
            const fileFormat: string = query?.file_format
            const tableName = query?.sqlTableName
            const fileNameToUse = query?.file_name

            console.log(`getSchemaData of SchemaController called with`, { schemaId, download })

            const serviceResponse = await this.svc.getSchemaData(schemaId)

            if (download && serviceResponse) {

                const { fileFd, fileName } = await this.svc.downloadSchema({
                    mockedData: serviceResponse,
                    format: fileFormat,
                    tableName, fileName: fileNameToUse
                })

                resp.header('Content-Type', 'application/octet-stream')
                resp.header('Content-Disposition', `attachment; filename=${fileName}`)

                return resp.send(fileFd)
            }

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

            const { fileFd, fileName } = await this.svc.downloadSchema(payload)

            resp.header('Content-Type', 'application/octet-stream')
            resp.header('Content-Disposition', `attachment; filename=${fileName}`)

            return resp.send(fileFd)

        } catch (error) {
            console.log({ getDataEr: error })

            return this.handleError(resp, error)

        }
    }


}