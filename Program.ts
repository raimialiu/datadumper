import { Startup } from "./Startup";
import { Host } from "./core/Host";
import { IHostBuilder } from "./core/IHostBuilder";
import { ProgramConfig } from "./core/common/interface/program.config.interface";

export class Program {

    static Main(args?: ProgramConfig, envFilePath?: string) {
        const host = this.CreateDefaultHostBuilder(args, envFilePath).Build()

        host.RunAsync()
            .then((res)=>{
                console.log(`${args?.APP_NAME} started on PORT ${args?.PORT}`)   

        }).catch(er=>{
            console.log({RunProgramError: er})
            host.WaitForShutDown(5)
            console.log(`application shutdown....`)
        })
    }

    private static CreateDefaultHostBuilder(config?: ProgramConfig, envPath?: string): IHostBuilder {
        return Host
                .CreateDefaultBuilder(config, envPath)
                .ConfigureWebHostDefaults<Startup>(new Startup())
    }
}


Program.Main(undefined, '.env') // start application