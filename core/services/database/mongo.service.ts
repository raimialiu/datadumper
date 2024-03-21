import { Schema, model, connect, Model } from 'mongoose';
import { MongoConfig } from '../../common/interface/program.config.interface';

export class MongoDbService {
    /**
     *
     */
    constructor(private config: MongoConfig) {
        const { MONGO_URL } = this.config
        connect(MONGO_URL).then(res => {
            console.log({ connectionResult: res })
        }).catch(console.log)
    }


    async createSchema<T>(payload: {
        tableName: string,
        schemaDefinition: any,
        data: Partial<T>, options?: any,
        save?: boolean
    }) {

        const {
            tableName,
            schemaDefinition,
            data, options, save
        } = payload
        const modelSchema = new Schema(schemaDefinition)
        const dbModel = model<T>(tableName, modelSchema)
        const modelInstance = new dbModel(data, options)

        return save ? modelInstance.save() : modelInstance
    }

}