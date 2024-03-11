import { FastifyInstance } from "fastify";
import { HostBuilder } from "./HostBuilder";
import { IHost, IHostBuildResult } from "./IHost";
import { IHostBuilder } from "./IHostBuilder";
import { ProgramConfig } from "./common/interface/program.config.interface";

export class Host implements IHost {
    /**
     *
     */
    constructor(private hostBuilder: IHostBuilder) {
    }

    RunAsync(): Promise<IHostBuildResult> {

        return new Promise(async (resolve, reject) => {
            try {
                const startResponse = await this.StartAsync()

                console.log({ startResponse })

                return resolve(startResponse)
            }
            catch (er) {
                return reject({
                    PORT: 0,
                    HOST: null,
                    Message: `an error occured: ${er}`,
                    Success: false,
                    Error: er
                })
            }
        })

    }

    private async StartAsync(): Promise<IHostBuildResult> {
        console.log(`starting application....`, {builder: this.hostBuilder})
        const config = (this.hostBuilder.currentApp as any)['programConfig'] as ProgramConfig

        const { PORT, HOST_ADDRESS } = config

        const hostObject = this.hostBuilder as any
        const app = hostObject?.fast as FastifyInstance
        console.log({configurator: config})

        await app?.listen({
            port: parseInt(PORT.toString())
        }).then(appStartResponse=>{
            console.log({appStartResponse})
        }).catch(console.log)

        return {
            APP_NAME: config.APP_NAME,
            PORT,
            HOST: HOST_ADDRESS,
            Message: `app listening on ${PORT}`,
            Success: true
        }
    }

    StopAsync(): IHost {
       this.WaitForShutDown(5)
       return this;
    }

    WaitForShutDown(timeout?: number | undefined): void {
        //throw new Error("Method not implemented.");
        setTimeout(()=>{
            process.exit(545783487)
        }, (timeout || 1)* 1000)
    }

    static CreateDefaultBuilder(config?: ProgramConfig, envPath?: string): IHostBuilder {
        return HostBuilder
            .Instance()
            .CreateHostBuilder(config, envPath)
    }

}