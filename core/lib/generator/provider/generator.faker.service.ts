import { deleteFromObj } from "../../../common/helper"
import { SchemaFuncImpl } from "../generator.service"
import { IGenerator } from "./interface/generator.interface"

export class FakerGeneratorService implements IGenerator {
    constructor(private schema: SchemaFuncImpl) {

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

    private __fake_data__(payload: any, key: string) {
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

    private __populate__(payload: any, key?: string) {
        const lib: any = this.getLib()

        let objResult: any = {}
        const isFunc = this.schema.properties.valueIsFunc

        console.log({ payloadFunc: payload, currentKey: key, isFunc })

        Object.keys(payload).forEach((v: any) => {
            const {
                category, properties, isCamelCase, keyName,
                returns
            } = payload[key]

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
                    objResult[v] = randomResult
                }
            }

            if (returns) {
                if (objResult[v]) {
                    let abjR: any = {}
                    Object.keys(returns).forEach((fk: string) => {
                        const currentFk = returns[fk]
                        abjR[fk] = {}
                        Object.keys(currentFk).forEach((ij) => {
                            if (currentFk[ij] && objResult[v][ij]) {
                                abjR[fk][ij] = objResult[v][ij]
                            }
                        })

                    })
                }
            }
        })

        return objResult

    }

    private __getData__(payload: any, objResult?: any, objToDelete?: any) {
        console.log({ incomingPayload: payload })

        objResult = objResult || {}
        objToDelete = objToDelete || {}

        Object.keys(payload).forEach((v) => {
            console.log({ vvv: payload[v] })
            // const typeOf = typeof payload[v]
            objToDelete[v] =  payload[v]

            if (payload[v]?.is_object) {
                console.log({ objValue: payload[v]['attributes'], beforeObjResult: objResult })
                const newObjectResult = this.__getData__(payload[v]['attributes'], { ...objResult })
                console.log({ newObjectResult })

                objResult[v] = newObjectResult

                objResult[v] = deleteFromObj(objResult[v], objToDelete)

            }
            else {
                const populateResult = this.__fake_data__(payload, v)
                console.log({ populateResult })
                objResult[v] = populateResult
            }
        })


        return objResult

    }
}