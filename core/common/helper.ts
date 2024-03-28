import { IRouteBuilder, RouteBuilder } from "../RouteBuilder";
import { FastifyInstance } from "fastify";
import { SchemaController } from "../controller/schema/schema.controller";
import { MockerService } from "../services/mocker/mocker.service";
import { randomUUID } from "crypto";
import { SchemaService } from "../services/schema/schema.service";
import { MongoDbService } from "../services/database/mongo.service";
import { ProgramConfig } from "./interface/program.config.interface";
import { SchemaRepository } from "../services/database/repository/schema.repository.service";
import { DatabaseService } from "../services/database/database.service";
import { UserController } from "../controller/user.controller";
import { UserService } from "../services/user/user.service";
import { UserRepositoryService } from "../services/database/repository/user.repository.service";

export function BuildeRoutes(builder: FastifyInstance): IRouteBuilder {
    const {MONGO_CONFIG, DB_CONFIG} = (builder as any)['programConfig'] as ProgramConfig
    const routeBuilder = new RouteBuilder(builder)
    const mongoService = new MongoDbService(MONGO_CONFIG)
    const db = new DatabaseService(DB_CONFIG)
    const schemaRepo = new SchemaRepository(db, mongoService)
    const userRepo = new UserRepositoryService(db)
    const userService = new UserService(userRepo)
    const schemaController = new SchemaController(new SchemaService(new MockerService(builder), mongoService, schemaRepo))
    const userController = new UserController(userService)
    //console.log({routeBuilder})

    routeBuilder.Add('/ping', 'get', async (request, reply) => {
        return { pong: 'it worked!' }
    })

    routeBuilder.Add('/', 'get', (req, reply) => {
        reply.send(`Welcome to ${this.fastApp['programConfig']?.APP_NAME}`)
    })


    // routeBuilder.Add('/data/get', 'post', async (req, reply) => {
    //     return await schemaController.getData(req, reply)
    // })

    routeBuilder.Add('/user', 'post', async (req, reply) => {
        return await userController.createUser(req, reply)
    })

    routeBuilder.Add('/schema', 'post', async (req, reply) => {
        return await schemaController.createSchema(req, reply)
    })

    routeBuilder.Add('/schema/', 'post', async (req, reply) => {
        return await schemaController.getSchemaData(req, reply)
    })

    routeBuilder.Add('/schema/quick', 'post', async (req, reply) => {
        return await schemaController.getData(req, reply)
    })

    return routeBuilder
}

export function decorate<T>(builder: FastifyInstance, key: string, value: T, options?: any) {
    const fp = require('fastify-plugin')

    //builder.register(fp(()))

    builder.register(fp((fst: FastifyInstance, opts: any, done: () => void) => {
        fst.decorate(key, value as any)

        done()
    })).then(res => {
        console.log(`${key} registration completed`)
    })

}

export function getNewSchemaId(userId: string) {
    const timestamp = Date.now()

    return `${userId.slice(5).replace(/-/g, '')}-${timestamp}-${randomUUID()}`
}

export function deleteFromObj(object: any, mutatotrs: any) {

    if (object && mutatotrs && Object.keys(mutatotrs).length > 0) {
        Object.keys(object).forEach((o) => {
            if (mutatotrs[o]) {
                delete object[o]
            }
        })

        return object
    }

    return object
}

export function toCamelCase(word: string): string {
    return word.replace(
        /(?:^\w|[A-Z]|\b\w|\s+)/g,
        (match, index) =>
            index === 0 ? match.toLowerCase() : match.toUpperCase()
    );
}


