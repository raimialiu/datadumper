import { IRouteBuilder, RouteBuilder } from "../RouteBuilder";
import { IHostBuilder } from '../IHostBuilder';
import { FastifyInstance } from "fastify";

export function BuildeRoutes(builder: FastifyInstance): IRouteBuilder {
    const routeBuilder = new RouteBuilder(builder)

    routeBuilder.Add('/', 'get', (req, reply)=>{
        reply.send(`Welcome to ${this.fastApp['programConfig']?.APP_NAME}`)
    })

    return routeBuilder
}


