import { FastifyReply } from "fastify"

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

    protected handleError(resp: FastifyReply, error: Error) {
        const errorMessage = error?.message

        return this.failedResponse(resp, [errorMessage])

    }
}