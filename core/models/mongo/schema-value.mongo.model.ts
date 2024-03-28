export const mockDataSchemaDefinition = {
    schema_id: { type: String, required: true },
    schema_values: { type: Object, required: true }
}

export const TableNames = {
    MockDataTableName: 'schema_values'
}

export type MongoSchemaKeys<T> = keyof T

export interface MockDataSchemaValueModel {
    schema_id: string,
    schema_values:any
}

