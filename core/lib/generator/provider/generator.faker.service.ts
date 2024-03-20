import { deleteFromObj } from "../../../common/helper"
import { BaseGeneratorService } from "../generator.base.service"
import { SchemaFuncImpl } from "../generator.service"
import { IGenerator } from "./interface/generator.interface"

export class FakerGeneratorService implements IGenerator {
    constructor(private schema: SchemaFuncImpl) {
       // super()
    }


    getData(data: { payload: any; key: string }) {

        const { payload, key } = data
        const lib: any = this.getLib()
        const isFunc = this.schema.properties.valueIsFunc

        const {
            category, properties, isCamelCase, keyName,
            returns
        } = payload[key]

        const randomResult = keyName ? lib[category][keyName] : lib[category][key]
        //  console.log({ randomResult})

        if (isFunc) {
            if (properties) {
                return randomResult(properties)
            }
            else {
                return randomResult()
            }
        }

        if (!isFunc) {
            if (properties) {
                return randomResult[properties]
            }
            else {
                return randomResult
            }
        }

        return ''
    }

    async topN(n: number, schemaPayload: any): Promise<any> {
        let task: any[] = []

        while (n > 0) {

            task.push(
                this.__getData__(schemaPayload)
            )
            n--
        }

        const results = await Promise.all(task)

        return results
    }

    private getLib() {
        return this.schema.getLib()
    }


    private __getData__(payload: any, objResult?: any, objToDelete?: any) {
        console.log({ incomingPayload: payload })

        objResult = objResult || {}
        objToDelete = objToDelete || {}

        Object.keys(payload).forEach((v) => {
            console.log({ vvv: payload[v] })
            // const typeOf = typeof payload[v]
            objToDelete[v] = payload[v]

            if (payload[v]?.is_object) {
                console.log({ objValue: payload[v]['attributes'], beforeObjResult: objResult })
                const newObjectResult = this.__getData__(payload[v]['attributes'], { ...objResult })
                console.log({ newObjectResult })

                objResult[v] = newObjectResult

                objResult[v] = deleteFromObj(objResult[v], objToDelete)

            }
            else {
                const populateResult = this.getData({
                    payload,
                    key: v
                })
                console.log({ populateResult })
                objResult[v] = populateResult
            }
        })


        return objResult

    }
}