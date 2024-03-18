import { ApplicationError } from '../errors/application.error';


export const Panic = (errorMessate: string) =>{
    throw new ApplicationError(errorMessate);
}



export const ErrorMessages = {
    CONFIGURATION_OPTION_MISSING: `program configuration options is missing`,
    APP_NOT_INITIALIZED: `fastify instance is yet to be initialized, are you channing the configurations the right way??`,
    ROUTE_CONFIG_NOT_DEFINED: `route configs not defined`
}