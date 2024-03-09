export interface IHost {
    RunAsync(): Promise<IHostBuildResult>
    StartAsync(): Promise<IHostBuildResult>
    StopAsync(): IHost
    WaitForShutDown(timeout?: number): void
}

export interface IHostBuildResult {

}