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
    constructor(private hostBuilder: FastifyInstance) { }

    private routeConfigs: any = {}

    public Build() {
        // if(!this.routeConfigs || Object.keys(this.routeConfigs).length > 0) {
        //     Panic(ErrorMessages.ROUTE_CONFIG_NOT_DEFINED)
        // }

        console.log({ routeConfigs: this.routeConfigs })

        Object.keys(this.routeConfigs).forEach((v: any) => {

            console.log(`constructing url route for ${v}: ${this.routeConfigs[v]}`)
            const { method, handler, options } = (this.routeConfigs as any)[v] as any;

            //this.fastApp.get()
            console.log({ method, v });

            this.hostBuilder.route({
                method,
                url: v,
                handler,
                schema: options?.schema
            })
        })
    }

    public Add(path: string, method: string, handler: RouteHandlerMethod, options?: RouteShorthandOptions): RouteBuilder {
        if ((this.routeConfigs as any)[path]) {
            Panic(`${path} already defined`)
        }




        this.routeConfigs[path] = {
            path,
            method,
            handler,
            options
        }

        console.log({currentConfig: this.routeConfigs})

        return this;
    }
}