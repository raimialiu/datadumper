import { FastifyReply } from "fastify"
import Joi, { PartialSchemaMap } from "joi"

export class BaseController {

    protected success<T>(resp: FastifyReply, data: T, message: string = "OK", statusCode: number = 200) {
        return resp.send({
            data,
            message,
            statusCode,
            status: /^2/.test(statusCode.toString())
        })
    }

    protected failedResponse(resp: FastifyReply, errors: any, message: string = "REQUEST FAILED",
        statusCode: number = 400) {
        return resp.send(
            {
                errors,
                message,
                statusCode,
                status: false
            }
        )

    }

    protected defineValidationSchema<T>(schemaPayload: PartialSchemaMap<T>): Joi.ObjectSchema<T> {
        return Joi.object(schemaPayload)
    }

    protected validateObject<T>(schema: Joi.ObjectSchema<T>, payload: unknown) {
        const { error, value } = schema.validate(payload, { "abortEarly": true })

        return {
            error,
            value
        }
    }

    protected handleError(resp: FastifyReply, error: Error) {
        const errorMessage = error?.message

        return this.failedResponse(resp, [errorMessage])

    }
}