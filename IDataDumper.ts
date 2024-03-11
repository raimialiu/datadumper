import { DBConfigOptions } from "./core/common/interface/program.config.interface"

export interface IDataDumper {
    ConnectToDataSource(config: DBConfigOptions): void
    LoadEnv(filepath?: string): void
}