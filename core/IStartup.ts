import { IServiceCollection } from "./IServiceCollection";

export interface IStartup {
    ConfigureServices(services: IServiceCollection): void
    get Services(): IServiceCollection
}