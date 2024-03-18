export interface IHost {
    
    Start(): void
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