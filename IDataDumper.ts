import { DBConfigOptions } from "./core/config.interface"

export interface IDataDumper {
    ConnectToDataSource(config: DBConfigOptions): void
    LoadEnv(filepath?: string): void
}