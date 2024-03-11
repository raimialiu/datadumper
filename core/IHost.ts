export interface IHost {
    RunAsync(): Promise<IHostBuildResult>
    //StartAsync(): Promise<IHostBuildResult>
    StopAsync(): IHost
    WaitForShutDown(timeout?: number): void
}

export interface IHostBuildResult {
    APP_NAME?: string
    PORT: number,
    HOST?: string
    Message?: string,
    Success: boolean,
    ErrorMessage?: Error
}