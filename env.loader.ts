import { FastifyInstance } from "fastify"
import { DefaultConfig } from "./core/common/interface/program.config.interface"
import { envSchema } from 'env-schema'
import { decorate } from "./core/common/helper"
import { AUTHENTICATION_PROVIDER, AUTHENTICATION_SCHEMES, FAKER_PROVIDER, LOG_PROVIDER } from "./core/common/enum"

const fastifyEnv = require('@fastify/env')
export class EnvLoader {

  static Load(fastInstance: any, filePath?: string) {

    const schema  = {
      type: 'object',
      required: ['PORT'],
      properties: {
        PORT: {
          type: 'string',
          default: 3000
        },
        APP_NAME: {
          type: 'string',
        },
        HOST_ADDRESS: {
          type: 'string',
          default: '0.0.0.0'
        },
        DIALECT: {
          type: 'string',
          default: 'mysql'
        },
        DB_HOST: {
          type: 'string',
          default: '127.0.0.1'
        },
        DB_PASS: {
          type: 'string',
        },
        DB_URL: {
          type: 'string',
        },
        DB_USER: {
          type: 'string',
          default: 'root'
        },
        DB_PORT: {
          type: 'integer',
          default: 3306
        },
        PROVIDER: {
          type: 'string',
          default: LOG_PROVIDER.WINSTON
        },
        FILEPATH: {
          type: 'string',
          default: `${__dirname}/.env`
        },
        LOG_CHANNELS: {
          type: 'string',
          default: LOG_PROVIDER.WINSTON
        },
        CLOUDWATCH_CONFIG: {
          type: 'object',
        },
        RD_HOST: {
          type: 'string',
          default: '127.0.0.1'
        },
        RD_PASS: {
          type: 'string',
        },
        RD_USER: {
          type: 'string',
          default: 'default'
        },
        RD_PORT: {
          type: 'integer',
          default: 6379
        },
        AVAILABLE_PROVIDER: {
          type: 'string',
          default: 'faker,falso,casual,chance,ddumper',
          //seperator: ','
        },
        CURRENT: {
          type: 'string',
          default: FAKER_PROVIDER.FAKER
        },
        Swagger: {
          type: 'string',
        },
        CQRS: {
          type: 'string',
          
        },
        DB_NAME: {
          type: 'string',
        
        },
        DB_SYNC: {
          type: 'boolean',
          default: false
        },
        JWT: {
          type: 'string',
        },
        AUTHENTICATION_SCHEMS:{
          type: 'string',
          default: AUTHENTICATION_SCHEMES.BEARER_TOKEN
        },
        AUTHENTICATION_PROVIDER: {
          type: 'string',
          default: AUTHENTICATION_PROVIDER.JWT_TOKEN
        },
        CONNECTION_TIMEOUT: {
          type: 'integer',
          default: 5000
        }

      }
    }

    const options = {
      confKey: 'envConfig', // optional, default: 'config'
      schema: schema,
      dotenv:  {
        path: filePath,
        debug: true
      }
    }

    const config = envSchema(options)

    fastInstance.decorate(options.confKey, config)

   //console.log({envConfigOutside: fastInstance[options.confKey]})
    return fastInstance[options.confKey]
    
  }

}