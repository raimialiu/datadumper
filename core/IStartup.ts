import { IServiceCollection } from "./IServiceCollection";

export interface IStartup {
    ConfigureServices(services: IServiceCollection): Promise<void>
    get Services(): IServiceCollection
}