import { IRouteBuilder, RouteBuilder } from "../RouteBuilder";
import { FastifyInstance } from "fastify";
import { SchemaController } from "../controller/schema/schema.controller";
import { MockerService } from "../services/mocker/mocker.service";

export function BuildeRoutes(builder: FastifyInstance): IRouteBuilder {
    const routeBuilder = new RouteBuilder(builder)
    const shemaController = new SchemaController(new MockerService(builder))
    //console.log({routeBuilder})

    routeBuilder.Add('/ping', 'get', async (request, reply) => {
        return { pong: 'it worked!' }
    })

    routeBuilder.Add('/', 'get', (req, reply) => {
        reply.send(`Welcome to ${this.fastApp['programConfig']?.APP_NAME}`)
    })


    routeBuilder.Add('/data/get', 'post', async (req, reply) => {
        return await shemaController.getData(req, reply)
    })

    return routeBuilder
}

export function decorate<T>(builder: FastifyInstance, key: string, value: T, options?: any) {
    const fp = require('fastify-plugin')

    //builder.register(fp(()))

    builder.register(fp((fst: FastifyInstance, opts: any, done: () => void) => {
        fst.decorate(key, value as any)

        done()
    })).then(res => {
        console.log(`${key} registration completed`)
    })

}


