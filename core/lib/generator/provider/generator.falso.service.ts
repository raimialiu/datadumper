import { SchemaFuncImpl } from "../generator.service"

export class FalsoGeneratorService {
    constructor(private schema: SchemaFuncImpl) {

    }

    private __getData__(payload: any) {

        const lib: any = this.schema

        let objResult: any = {}

        Object.keys(payload).forEach((v: any) => {
            const {
                isFunc, category, properties, isCamelCase, keyName,
                returns
            } = payload[v]

            const randomResult = keyName ? lib[category][keyName] : lib[category][v]
            //  console.log({ randomResult})

            if (isFunc) {
                if (properties) {
                    objResult[v] = randomResult(properties)
                }
                else {
                    objResult[v] = randomResult()
                }
            }

            if (!isFunc) {
                if (properties) {
                    objResult[v] = randomResult[properties]
                }
                else {
                    objResult[v] = randomResult()
                }
            }

            if(returns) {
                if(objResult[v]) {
                    ob
                }
            }
        })


        return objResult

    }
}