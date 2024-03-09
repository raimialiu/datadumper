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
        throw new Error("Method not implemented.");
    }
    
    StartAsync(): Promise<IHostBuildResult> {
        this.hostBuilder
    }

    StopAsync(): IHost {
        throw new Error("Method not implemented.");
    }
    WaitForShutDown(timeout?: number | undefined): void {
        throw new Error("Method not implemented.");
    }

    static CreateDefaultBuilder(config?: ProgramConfig, envPath?: string): IHostBuilder {
        return HostBuilder
                .Instance()
                .CreateHostBuilder(config, envPath)
    }

}