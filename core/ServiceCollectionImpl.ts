import { FastifyInstance } from "fastify";
import { IServiceCollection } from "./IServiceCollection";
import { ErrorMessages, Panic } from "./common/constant";
import { IRouteBuilder } from "./RouteBuilder";
import { IHostBuilder } from "./IHostBuilder";
import { DBConfigOptions, ProgramConfig, RedisConfig } from "./common/interface/program.config.interface";
import { RedisService } from "./services/redis/redis.service";

export class ServiceCollectionImplementation implements IServiceCollection {

    /**
     *
     */
    constructor(private hostBuilder: IHostBuilder) {
        if(!this.hostBuilder.currentApp) {
            Panic(ErrorMessages.APP_NOT_INITIALIZED)
        }
    }

   // private fastApp: FastifyInstance

    AddTransient<TI, TFunc>(): IServiceCollection {
        throw new Error("Method not implemented.");
    }

    AddDatabase(config?: DBConfigOptions): IServiceCollection {
        throw new Error("Method not implemented.");
    }

    AddRedis(config?: RedisConfig): IServiceCollection {
        config = config || (this.hostBuilder.currentApp['programConfig'] as ProgramConfig)?.REDIS
        this.hostBuilder.currentApp.decorate('redis', new RedisService(config))

        return this;
    }

    AddSwaggerGen(): IServiceCollection {
        throw new Error("Method not implemented.");
    }

    AddCqrs(): IServiceCollection {
        throw new Error("Method not implemented.");
    }

    AddJwtAuthentication(): IServiceCollection {
        throw new Error("Method not implemented.");
    }

    AddServiceConfigration<T>(config: T): IServiceCollection {
        throw new Error("Method not implemented.");
    }


    AddRoutes(routeBuilder: IRouteBuilder): IServiceCollection {
        routeBuilder.Build()
        return this
    }

    static CreateDefaultInstance(hostBuilder: IHostBuilder): IServiceCollection {
        return new ServiceCollectionImplementation(hostBuilder)
    }

    get currentApp() { return this.hostBuilder.currentApp;}

}