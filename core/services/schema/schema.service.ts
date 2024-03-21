import { FastifyInstance } from "fastify";
import { MockerService } from "../mocker/mocker.service";
import { MongoDbService } from "../database/mongo.service";
import { DatabaseService } from "../database/database.service";
import { SchemaValueModel } from "../../models/mongo/schema-value.mongo.model";
import { getNewSchemaId } from "../../common/helper";
import { SchemaRepository } from "../database/repository/schema.repository.service";
import { UsersModel } from "../../models/users.model";
import { SchemaModel } from "../../models/schema.model";
import { Schema } from "mongoose";

export class SchemaService {

    constructor(private svc: MockerService,
        private mongoDb: MongoDbService,
        private schemaRepo: SchemaRepository) {
    }

    async listAllSchema(payload: {
        user_id: string,
        page_index: number
        limit: number
    }) {

    }

    async createSchema(payload: {
        mockPayload: {
            n: number,
            data: any
        },
        schemaPaylaod: {
            name: string
            description: any
        }
        user_id: string
    }) {

        const { mockPayload: {
            n, data: schemas
        }, user_id, schemaPaylaod: {
            name, description
        } } = payload

        const schemaValue = await this.svc.getMockData({
            n, schemas
        })
        const schemaId = getNewSchemaId(user_id || 'noid')
        console.log({ schemaId })

        const saveSchemaResult = await this.schemaRepo.SaveOne<SchemaModel>(SchemaModel.Create({
            name, description,
            user_id, id: schemaId
        }))

        console.log({ saveSchemaResult })

        const saveResult = await this.mongoDb.createSchema<SchemaValueModel<any>>({
            tableName: 'schema_values',
            schemaDefinition: {
                schema_id: { type: String, required: true },
                schema_values: { type: Object, required: true }
            },
            data: {
                schema_values: schemaValue,
                schema_id: saveSchemaResult.id
            },
            save: true
        })

        console.log({ saveResult })

        return {
            success: true,
            data: saveSchemaResult.id,
            saveResult
        }

    }
}