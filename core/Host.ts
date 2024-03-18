import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { HostBuilder } from "./HostBuilder";
import { IHost, IHostBuildResult } from "./IHost";
import { IHostBuilder } from "./IHostBuilder";
import { ProgramConfig } from "./common/interface/program.config.interface";
import { BuildeRoutes } from "./common/helper";

export class Host implements IHost {
    /**
     *
     */
    constructor(private hostBuilder: IHostBuilder) {
    }

    private wrapApp(newInstance: FastifyInstance, properties: any) {

        Object.keys(properties).forEach((item: string) => {
            const { key, options, value } = properties[item]
            newInstance.decorate(key, value)
        })
    }

    public Start(): void {
        console.log(`starting application....`,)
        const config = (this.hostBuilder.currentApp as any)['programConfig'] as ProgramConfig

        const { PORT } = config

        const hostObject = this.hostBuilder as any
        const appFast = Fastify({
            "connectionTimeout": 5000,
            logger: true
        })
        const app = hostObject?.fast as any

        this.wrapApp(appFast, {
            providerConfig: {
                key: 'providerConfig',
                value: app['providerConfig']
            },
            programConfig: {
                key: 'programConfig',
                value: app['programConfig']
            },
            redis: {
                key: 'redis',
                value: app['redis']
            },
            db: {
                key: 'db',
                value: app['db']
            }
        })

        BuildeRoutes(appFast).Build()

        const start = async (portNumber: number, hostAddress?: string) => {
            try {
                await appFast.listen({ port: portNumber, host: hostAddress || '0.0.0.0' })
                    .then(res => {
                        //const address = app.server.address()

                        console.log(`app start information....`, { res, portNumber })
                    })
                    .catch(console.log)

            } catch (err) {
                appFast.log.error(err)
                process.exit(1)
            }
        }

        start(parseInt(PORT.toString()))
    }

    StopAsync(): IHost {
        this.WaitForShutDown(5)
        return this;
    }

    WaitForShutDown(timeout?: number | undefined): void {
        //throw new Error("Method not implemented.");
        setTimeout(() => {
            process.exit(545783487)
        }, (timeout || 1) * 1000)
    }

    static CreateDefaultBuilder(config?: ProgramConfig, envPath?: string): IHostBuilder {
        return HostBuilder
            .Instance()
            .CreateHostBuilder(config, envPath)
    }

}