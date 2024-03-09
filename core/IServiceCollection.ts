import { FastifyInstance } from "fastify"
import { IRouteBuilder } from "./RouteBuilder"
import { DBConfigOptions, RedisConfig } from "./common/interface/program.config.interface"


export interface IServiceCollection {
    AddTransient<TI, TFunc>(): IServiceCollection
    AddDatabase(config?: DBConfigOptions): IServiceCollection
    AddRedis(config?: RedisConfig): IServiceCollection
    AddSwaggerGen(): IServiceCollection
    AddCqrs(): IServiceCollection
    AddJwtAuthentication(): IServiceCollection
    AddServiceConfigration<T>(config?:T): IServiceCollection
    AddRoutes(routeBuilder: IRouteBuilder): IServiceCollection

    get currentApp(): FastifyInstance

}


export interface IApplicationBuilder {

}