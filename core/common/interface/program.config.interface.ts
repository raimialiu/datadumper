import { RouteHandlerMethod, RouteShorthandOptions } from "fastify"
import { AUTHENTICATION_PROVIDER, AUTHENTICATION_SCHEMES, DB_DIALECT, LOG_CHANNELS, LOG_PROVIDER } from "../enum"

export interface ProgramConfig {
    ENV_FILE_PATH?: string
    CONNECTION_TIMEOUT?: number
    APP_NAME: string
    PORT: number
    HOST_ADDRESS?: string
    DB_CONFIG: DBConfigOptions
    REDIS: RedisConfig
    PROVIDER: MockDataProviderConfig,
    AUTHENTICATION_SCHEMS: AUTHENTICATION_SCHEMES,
    AUTHENTICATION_PROVIDER: AUTHENTICATION_PROVIDER
    LOGGER?: LoggerConfig
    Component?: ComponentConfig
}

export interface DBConfigOptions {
    DIALECT: DB_DIALECT,
    DB_HOST?: string
    DB_PASS?: string
    DB_URL?: string
    DB_USER?: string
    DB_PORT?: number
    DB_NAME: string
    DB_SYNC?: boolean
}

export interface LoggerConfig {
    PROVIDER: LOG_PROVIDER,
    FILEPATH?: string
    LOG_CHANNELS: LOG_CHANNELS[],
    CLOUDWATCH_CONFIG?: any
}

export interface RedisConfig {
    RD_HOST: string
    RD_PASS?: string
    RD_USER: string
    RD_POR?: number
    RD_DB?: number
}

export interface MockDataProviderConfig {
    AVAILABLE_PROVIDER: string[]
    CURRENT: string
}

export interface ComponentConfig {
    Swagger: SwaggerConfig
    CQRS?: CqrsConfig
    JWT: Jwtconfig
}

export interface SwaggerConfig {

}

export interface CqrsConfig {

}

export interface Jwtconfig {

}

export interface DefaultConfig {
    APP_NAME: "",
    PORT: 0,
    HOST_ADDRESS: "",
    DIALECT: DB_DIALECT.MYSQL,
    DB_HOST: "",
    DB_PASS: "",
    DB_URL: "",
    DB_USER: "",
    DB_PORT: 0,
    PROVIDER: LOG_PROVIDER.WINSTON,
    FILEPATH: "",
    LOG_CHANNELS: [],
    CLOUDWATCH_CONFIG: "",
    RD_HOST: "",
    RD_PASS: "",
    RD_USER: "",
    RD_POR: 0,
    AVAILABLE_PROVIDER: [],
    CURRENT: "",
    Swagger: "",
    CQRS: "",
    DB_NAME:"",
    DB_SYNC: false,
    JWT: "",
    AUTHENTICATION_SCHEMS: AUTHENTICATION_SCHEMES,
    AUTHENTICATION_PROVIDER: AUTHENTICATION_PROVIDER,
    CONNECTION_TIMEOUT: 5000
}

export interface IRouteBuilderConfig {
    path: IRoutePathConfig
}
export interface IRoutePathConfig {
    method: string
    handler?: RouteHandlerMethod,
    options?: RouteShorthandOptions
}