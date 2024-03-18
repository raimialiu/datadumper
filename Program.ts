import { Startup } from "./Startup";
import { Host } from "./core/Host";
import { IHostBuilder } from "./core/IHostBuilder";
import { ProgramConfig } from "./core/common/interface/program.config.interface";
import Fastify, { FastifyBaseLogger, FastifyInstance, FastifyTypeProviderDefault, RawServerDefault } from "fastify";

export class Program {

    static Main(args?: ProgramConfig, envFilePath?: string) {
        const host = this.CreateDefaultHostBuilder(args, envFilePath).Build()
        console.log({hostBuildResult: host})

        
        host.Start() // start the application
    }

    private static CreateDefaultHostBuilder(config?: ProgramConfig, envPath?: string): IHostBuilder {
        return Host
                .CreateDefaultBuilder(config, envPath)
                .ConfigureWebHostDefaults<Startup>(new Startup())
    }
}


 Program.Main(undefined, `${__dirname}/.env`) // start application

// const app = Fastify({
//     "connectionTimeout": 5000,
//     logger: true
// })

//app.listen(3240).then(console.log).catch(console.log)

// {
//     APP_NAME: process.env.APP_NAME,
//     AUTHENTICATION_PROVIDER: AUTHENTICATION_PROVIDER.JWT_TOKEN,
//     AUTHENTICATION_SCHEMS: AUTHENTICATION_SCHEMES.BEARER_TOKEN,
//     PORT: 7560,
//     PROVIDER:{
//         CURRENT: FAKER_PROVIDER.FAKER,
//         AVAILABLE_PROVIDER: [FAKER_PROVIDER.FAKER, FAKER_PROVIDER.CASUAL, FAKER_PROVIDER.CHANCE, FAKER_PROVIDER.FALSO]
//     },
//     REDIS: {
//         RD_HOST: process.env.RD_HOST,
//         RD_USER: process.env.RD_USER,
//         RD_DB: +process.env.RD_DB || 2
//     },
//     DB_CONFIG : {
//         DIALECT: DB_DIALECT.MYSQL,
//         DB_PORT: +process.env.DB_PORT || 3306,
//         DB_HOST: process.env.DB_HOST,
//         DB_USER: process.env.DB_USER,
//         DB_NAME: process.env.DB_NAME,
//         DB_SYNC: process.env.NODE_ENV == 'development' ? true: false
//     }
// }