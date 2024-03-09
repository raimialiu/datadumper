import { FastifyBaseLogger, FastifyInstance, FastifyReply, FastifyRequest, FastifySchema, FastifyTypeProviderDefault, RawServerDefault, RouteGenericInterface, RouteHandlerMethod, RouteShorthandOptions } from "fastify";
import { ErrorMessages, Panic } from "./common/constant";
import { IRouteBuilderConfig, IRoutePathConfig } from "./common/interface/program.config.interface";
import { ResolveFastifyRequestType } from "fastify/types/type-provider";
import { IncomingMessage, ServerResponse } from "http";
import { IHostBuilder } from "./IHostBuilder";

export interface IRouteBuilder {
    Add(path: string, method: string, handler: RouteHandlerMethod, options?: any): RouteBuilder
    Build(): void
}


export class RouteBuilder implements IRouteBuilder {
    constructor(private hostBuilder: FastifyInstance) {}

    private routeConfigs: IRouteBuilderConfig = {
        path: {
            method: "",
            handler: undefined
        }
    }

    public Build() {
        if(!this.routeConfigs || Object.keys(this.routeConfigs).length > 0) {
            Panic(ErrorMessages.ROUTE_CONFIG_NOT_DEFINED)
        }

        Object.keys(this.routeConfigs).forEach((v)=>{
            console.log(`constructing url route for ${v}: this.routeConfigs[v]`)
            const { method, handler, options} = this.routeConfigs[v]
            //this.fastApp.get()
            this.hostBuilder[(method+'').toLowerCase()](v, options, handler)
        })
    }

    public Add(path: string, method: string, handler: RouteHandlerMethod, options?: RouteShorthandOptions): RouteBuilder {
        if(this.routeConfigs[path]) {
            Panic(`${path} already defined`)
        }

        this.routeConfigs[path] = {
            method,
            options,
            handler
        }
       // this.fastApp.get('/')

        return this;
    }
}