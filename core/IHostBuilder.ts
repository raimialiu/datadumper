import { FastifyInstance } from "fastify"
import { IHost } from "./IHost"
import { IStartup } from "./IStartup"
import { ProgramConfig } from "./common/interface/program.config.interface"

export interface IHostBuilder {
    CreateHostBuilder(config?: ProgramConfig, envFilePath?: string): IHostBuilder
    Build(): IHost
    ConfigureWebHostDefaults<T>(startupClass:IStartup): IHostBuilder
    CreateFastApp(config?: ProgramConfig, envFilePath?: string): IHostBuilder
    HostConfiguration(envFilePath?: string): IHostBuilder

    get currentApp(): FastifyInstance
}