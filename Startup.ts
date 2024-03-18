import { IServiceCollection } from './core/IServiceCollection';
import { IStartup } from "./core/IStartup";
import { BuildeRoutes } from "./core/common/helper";
import { ProgramConfig } from './core/common/interface/program.config.interface';


export class Startup implements IStartup {

    /**
     *
     */
    constructor() {


    }

    private _svc: IServiceCollection
    public async ConfigureServices(services: IServiceCollection): Promise<void> {
        const config = (services.currentApp as any)['programConfig'] as ProgramConfig
        console.log({ elConfig: config })
        //AddRoutes(BuildeRoutes(services.currentApp))
        services
            .AddRedis(config?.REDIS)
            .AddDatabase()
            .AddJwtAuthentication()

        this._svc = services
    }

    public get Services() { return this._svc }
}