export class BaseController {

    public success<T>(data: T, message: string = "OK", statusCode: number = 200) {
        return {
            data,
            message,
            statusCode,
            status: /^2/.test(statusCode.toString())
        }
    }

    public failedResponse(errors: any, message: string = "REQUEST FAILED", 
        statusCode: number = 400) {
        return {
            errors,
            message,
            statusCode,
            status: false
        }
    }
}