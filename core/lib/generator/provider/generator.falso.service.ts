import { BaseGeneratorService } from "../generator.base.service"
import { SchemaFuncImpl } from "../generator.service"
import { IGenerator } from "./interface/generator.interface"

export class FalsoGeneratorService implements IGenerator {
    constructor(private schema: SchemaFuncImpl) {
       
    }

    topN(n: number, schemaPayload: any): Promise<any> {
        throw new Error("Method not implemented.")
    }

    getData(payload: any) {

    }
}