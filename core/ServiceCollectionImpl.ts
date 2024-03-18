import { IServiceCollection } from "./IServiceCollection";
import { ErrorMessages, Panic } from "./common/constant";
import { IRouteBuilder } from "./RouteBuilder";
import { IHostBuilder } from "./IHostBuilder";
import { DBConfigOptions, ProgramConfig, RedisConfig } from "./common/interface/program.config.interface";
import { RedisService } from "./services/redis/redis.service";
import { DatabaseService } from "./services/database/database.service";
import { decorate } from "./common/helper";
import { join } from "path";
import { readFileSync } from "fs";

export class ServiceCollectionImplementation implements IServiceCollection {

    /**
     *
     */
    constructor(private hostBuilder: IHostBuilder) {
        if (!this.hostBuilder.currentApp) {
            Panic(ErrorMessages.APP_NOT_INITIALIZED)
        }
    }

    AddFakerServiceProvider(configFilePath: string, currentProvider?: string): IServiceCollection {
        const configPath = join(__dirname, configFilePath)
        console.log({configFilePath, configPath})

        const fileContent = Buffer.from(readFileSync(configPath)).toString()
        const fileJsonParse = JSON.parse(fileContent)

        console.log({ fileJsonParse })

        const providerConfig = fileJsonParse[currentProvider]
        console.log({ providerConfig })

        if (providerConfig) {
            this.hostBuilder.currentApp.decorate('providerConfig', providerConfig)
        }

        return this
    }

    // private fastApp: FastifyInstance

    AddTransient<TI, TFunc>(): IServiceCollection {
        throw new Error("Method not implemented.");
    }

    AddDatabase(config?: DBConfigOptions): IServiceCollection {

        config = config || ((this.hostBuilder.currentApp as any)['programConfig'] as ProgramConfig)?.DB_CONFIG
        //this.hostBuilder.currentApp.decorate('db', new DatabaseService(config))
        decorate<DatabaseService>(this.hostBuilder.currentApp, 'db', new DatabaseService(config))

        return this;
    }

    AddRedis(config?: RedisConfig): IServiceCollection {
        config = config || ((this.hostBuilder.currentApp as any)['programConfig'] as ProgramConfig)?.REDIS
        console.log({ redisConfig: config })

        decorate<RedisService>(this.hostBuilder.currentApp, 'redis', new RedisService(config))
        // this.hostBuilder.currentApp.decorate('redis', new RedisService(config))

        return this;
    }

    AddSwaggerGen(): IServiceCollection {
        throw new Error("Method not implemented.");
    }

    AddCqrs(): IServiceCollection {
        throw new Error("Method not implemented.");
    }

    AddJwtAuthentication(): IServiceCollection {
        // throw new Error("Method not implemented.");

        return this;
    }

    AddServiceConfigration<T>(config: T): IServiceCollection {
        throw new Error("Method not implemented.");
    }


    AddRoutes(routeBuilder: IRouteBuilder): IServiceCollection {
        console.log({ routeBuilder })
        routeBuilder.Build()
        return this
    }

    static CreateDefaultInstance(hostBuilder: IHostBuilder): IServiceCollection {
        return new ServiceCollectionImplementation(hostBuilder)
    }

    get currentApp() { return this.hostBuilder.currentApp; }

}