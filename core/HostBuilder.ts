import { EnvLoader } from "../env.loader";
import { IHost } from "./IHost";
import { IHostBuilder } from "./IHostBuilder";
import { AUTHENTICATION_PROVIDER, AUTHENTICATION_SCHEMES, DB_DIALECT, LOG_PROVIDER } from "./common/enum";
import { DefaultConfig, ProgramConfig } from "./common/interface/program.config.interface";
import { IStartup } from './IStartup';
import { IServiceCollection } from "./IServiceCollection";
import Fastify, { FastifyBaseLogger, FastifyInstance, FastifyTypeProviderDefault, RawServerDefault } from "fastify";
import { ErrorMessages, Panic } from "./common/constant";
import { ServiceCollectionImplementation } from "./ServiceCollectionImpl";
import { Host } from "./Host";
import { IncomingMessage, ServerResponse } from "http";

export class HostBuilder implements IHostBuilder {

    /**
     *
     */
    constructor() {
        //this.programConfig = config as ProgramConfig
    }
    get currentApp(): FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProviderDefault> {
        return this.fast
    }

    private services: IServiceCollection
    private fast: FastifyInstance
    private programConfig: ProgramConfig = {
        APP_NAME: "",
        PORT: 0,
        DB_CONFIG: {
            DIALECT: DB_DIALECT.MYSQL,
            DB_NAME: ""
        },
        REDIS: {
            RD_HOST: "",
            RD_USER: ""
        },
        PROVIDER: {
            AVAILABLE_PROVIDER: [],
            CURRENT: ""
        },
        AUTHENTICATION_SCHEMS: AUTHENTICATION_SCHEMES.BEARER_TOKEN,
        AUTHENTICATION_PROVIDER: AUTHENTICATION_PROVIDER.JWT_TOKEN
    }

    ConfigureWebHostDefaults<T>(startupClass: IStartup): IHostBuilder {
        if (!this.fast) {
            Panic(ErrorMessages.APP_NOT_INITIALIZED)
        }

        startupClass.ConfigureServices(ServiceCollectionImplementation.CreateDefaultInstance(this))
            .then(er => {
                this.services = startupClass.Services
                this.fast.decorate('services', startupClass.Services)
            }).catch(console.log)


        return this;
    }

    private contentRoot: string
    private currentConfig: ProgramConfig

    private HostConfigArgs: DefaultConfig = {
        APP_NAME: "",
        PORT: 0,
        HOST_ADDRESS: "",
        DIALECT: DB_DIALECT.MYSQL,
        DB_HOST: "",
        DB_PASS: "",
        DB_URL: "",
        DB_USER: "",
        DB_PORT: 0,
        PROVIDER: LOG_PROVIDER.WINSTON,
        FILEPATH: "",
        LOG_CHANNELS: [],
        CLOUDWATCH_CONFIG: "",
        RD_HOST: "",
        RD_PASS: "",
        RD_USER: "",
        RD_POR: 0,
        AVAILABLE_PROVIDER: [],
        DB_NAME: "",
        DB_SYNC: false,
        CURRENT: "",
        Swagger: "",
        CQRS: "",
        JWT: "",
        AUTHENTICATION_SCHEMS: AUTHENTICATION_SCHEMES.BEARER_TOKEN,
        AUTHENTICATION_PROVIDER: AUTHENTICATION_PROVIDER.JWT_TOKEN,
        CONNECTION_TIMEOUT: 5000
    }

    CreateHostBuilder(config?: ProgramConfig, envFilePath?: string): IHostBuilder {
        this.CreateFastApp(config, envFilePath)
            .HostConfiguration(envFilePath)


        return this;
    }

    static Instance(): IHostBuilder {
        return new HostBuilder()
    }


    Build(): IHost {
        return new Host(this)
    }

    private HostConfigFunc(configOptions: any, envFilePath?: string) {
        if (!configOptions || !this.fast) {
            Panic("configuration metadata missing or service not properly initialized....")
        }

        const { APP_NAME, HOST_ADDRESS,
            DB_URL, DB_USER, RD_USER, RD_HOST,
            RD_PASS, RD_POR, DIALECT, PORT,
            AVAILABLE_PROVIDER,
            CURRENT,
            CLOUDWATCH_CONFIG,
            AUTHENTICATION_PROVIDER,
            AUTHENTICATION_SCHEMS,
            LOG_CHANNELS, Swagger, CQRS, JWT, FILEPATH, PROVIDER,
            DB_HOST, DB_PASS, DB_PORT,
            CONNECTION_TIMEOUT, DB_NAME, MONGO_URL } = configOptions

        const config: ProgramConfig = {
            ENV_FILE_PATH: envFilePath,
            CONNECTION_TIMEOUT,
            APP_NAME,
            PORT,
            AUTHENTICATION_PROVIDER,
            AUTHENTICATION_SCHEMS,
            MONGO_CONFIG: {
                MONGO_URL
            },
            HOST_ADDRESS,
            PROVIDER: {
                CURRENT,
                AVAILABLE_PROVIDER
            },
            LOGGER: {
                LOG_CHANNELS,
                CLOUDWATCH_CONFIG,
                PROVIDER
            },
            DB_CONFIG: {
                DB_HOST, DB_PASS, DB_URL, DB_USER,
                DB_PORT,
                DIALECT,
                DB_NAME, DB_SYNC: process.env.NODE_ENV == 'development' ? true : false
            },
            REDIS: {
                RD_HOST, RD_USER, RD_PASS, RD_POR
            }

        }

        this.programConfig = config

        this.fast.decorate('programConfig', config)
    }

    public CreateFastApp(config?: ProgramConfig, envFilePath?: string): IHostBuilder {
        const fastApp = Fastify({
            "connectionTimeout": 5000,
            logger: true
        })

        if (config) {
            fastApp.decorate('programConfig', config)
        }
        else {
            this.HostConfigArgs = EnvLoader.Load(fastApp, envFilePath)
        }

        this.fast = fastApp

        return this
    }

    public HostConfiguration(envFilePath?: string): IHostBuilder {
        let envConfig = (this.fast as any)['envConfig']
        let programConfig = (this.fast as any)['programConfig']
        console.log({ envConfig, programConfig })

        if (programConfig) {
            return this
        }
        else {
            if (!envConfig) {
                envConfig = EnvLoader.Load(this.fast, envFilePath)

                this.HostConfigFunc(envConfig, envFilePath)
            }
            else {
                this.HostConfigFunc(envConfig, envFilePath)
            }
        }

        return this
    }

}