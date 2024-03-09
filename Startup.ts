import { IDataDumper } from "./IDataDumper";
import { DBConfigOptions } from "./core/config.interface";
import { IServiceCollection } from './core/IServiceCollection';
import { IStartup } from "./core/IStartup";
import { BuildeRoutes } from "./core/common/helper";


export class Startup implements IStartup  {
    
    /**
     *
     */
    constructor() {
    
        
    }

    private  _svc: IServiceCollection
    public ConfigureServices(services: IServiceCollection): void {
        services.AddRoutes(BuildeRoutes(services.currentApp))
                .AddRedis()
                .AddDatabase()
                .AddJwtAuthentication()

        this._svc = services
    }

    public get Services() { return this._svc}
}