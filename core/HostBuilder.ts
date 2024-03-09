import { EnvLoader } from "../env.loader";
import { IHost } from "./IHost";
import { IHostBuilder } from "./IHostBuilder";
import { AUTHENTICATION_PROVIDER, AUTHENTICATION_SCHEMES, DB_DIALECT, LOG_PROVIDER } from "./common/enum";
import { DefaultConfig, ProgramConfig } from "./common/interface/program.config.interface";
import { IStartup } from './IStartup';
import { IServiceCollection } from "./IServiceCollection";
import Fastify, { FastifyInstance } from "fastify";
import { ErrorMessages, Panic } from "./common/constant";
import { ServiceCollectionImplementation } from "./ServiceCollectionImpl";
import { Host } from "./Host";

export class HostBuilder implements IHostBuilder {

    /**
     *
     */
    constructor() {
        //this.programConfig = config as ProgramConfig
    }

    private services: IServiceCollection
    private fast: FastifyInstance
    private programConfig: ProgramConfig = {
        APP_NAME: "",
        PORT: 0,
        DB_CONFIG: {
            DIALECT: DB_DIALECT.MYSQL
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
        if(!this.fast) {
            Panic(ErrorMessages.APP_NOT_INITIALIZED)
        }

        startupClass.ConfigureServices(ServiceCollectionImplementation.CreateDefaultInstance(this.fast))
        this.services = startupClass.Services

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
        CURRENT: "",
        Swagger: "",
        CQRS: "",
        JWT: "",
        AUTHENTICATION_SCHEMS: AUTHENTICATION_SCHEMES.BEARER_TOKEN,
        AUTHENTICATION_PROVIDER: AUTHENTICATION_PROVIDER.JWT_TOKEN,
        CONNECTION_TIMEOUT: 5000
    }

    CreateHostBuilder(config?: ProgramConfig, envFilePath?: string): IHostBuilder {
       this
        .HostConfiguration(config, envFilePath)
        .CreateFastApp();

       return this;
    }

    static Instance(): IHostBuilder {
        return new HostBuilder()
    }


    Build(): IHost {
        return new Host(this)
    }

    private HostConfigFunc(configOptions?: ProgramConfig, envFilePath?: string) {
        if (!this.HostConfigArgs) {
            Panic("configuration metadata missing....")
        }

        if (configOptions) {
            this.programConfig = configOptions
        }
        else {
            const { APP_NAME, HOST_ADDRESS,
                DB_URL, DB_USER, RD_USER, RD_HOST,
                RD_PASS, RD_POR, DIALECT, PORT,
                AVAILABLE_PROVIDER,
                CURRENT,
                CLOUDWATCH_CONFIG,
                AUTHENTICATION_PROVIDER,
                AUTHENTICATION_SCHEMS,
                LOG_CHANNELS, Swagger, CQRS, JWT, FILEPATH, PROVIDER,
                DB_HOST, DB_PASS, DB_PORT,CONNECTION_TIMEOUT } = this.HostConfigArgs

            const config: ProgramConfig = {
                ENV_FILE_PATH: envFilePath,
                CONNECTION_TIMEOUT,
                APP_NAME,
                PORT,
                AUTHENTICATION_PROVIDER,
                AUTHENTICATION_SCHEMS,
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
                    DIALECT
                },
                REDIS: {
                    RD_HOST, RD_USER, RD_PASS, RD_POR
                }

            }

            this.programConfig = config
        }

    }

    public CreateFastApp(): IHostBuilder {
        if(!this.programConfig) {
            Panic(ErrorMessages.CONFIGURATION_OPTION_MISSING)
        }

        const {
            CONNECTION_TIMEOUT
        } = this.programConfig

        const fastApp = Fastify({
            "connectionTimeout": CONNECTION_TIMEOUT
        })

        fastApp.decorate('programConfig', this.programConfig)
        this.fast = fastApp

        return this
    }

    private HostConfiguration(config?: ProgramConfig, envFilePath?: string): IHostBuilder {
        if (!config) {
            this.HostConfigArgs = EnvLoader.Load(this.HostConfigArgs, envFilePath)
        }

        this.HostConfigFunc(config, envFilePath)

        return this
    }

}