import { FastifyInstance } from "fastify";
import { MockerService } from "../mocker/mocker.service";
import { MongoDbService } from "../database/mongo.service";
import { DatabaseService } from "../database/database.service";
import { MockDataSchemaValueModel, TableNames, mockDataSchemaDefinition } from "../../models/mongo/schema-value.mongo.model";
import { getNewSchemaId } from "../../common/helper";
import { SchemaRepository } from "../database/repository/schema.repository.service";
import { UsersModel } from "../../models/users.model";
import { SchemaModel } from "../../models/schema.model";
import { Schema } from "mongoose";
import { Panic } from "../../common/constant";

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

        const { user_id, limit, page_index } = payload

        const schema = await this.schemaRepo.GetMany<SchemaModel>({
            user_id
        }, {
            limit, page_index,
            sortOrder: "DESC",
            orderBy: {
                created_at: "DESC"
            }
        })

        return schema

    }

    async createSchemaQuickly(payload: {
        n: number,
        schemas: any,
        pagination?: any
    }) {

        const schemaResult = await this.svc.getMockData(payload)

        return schemaResult

    }

    async downloadSchema(payload: any) {
        const downloadResult = await this.svc.downloadMockData(payload)

        return downloadResult
    }

    async getSchemaData(schemaId: string) {
        const findSchema = await this.mongoDb.findOne<MockDataSchemaValueModel>(
            {
                schemaDefinition: mockDataSchemaDefinition,
                tableName: TableNames.MockDataTableName,
                findOptions: {
                    schema_id: schemaId
                }
            }
        )

        if (!findSchema) {
            Panic(`no match found for the specified schema.....`)
        }

        return findSchema.schema_values
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

        const saveResult = await this.mongoDb.createSchema<MockDataSchemaValueModel>({
            tableName: TableNames.MockDataTableName,
            schemaDefinition: mockDataSchemaDefinition,
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