import { deleteFromObj } from "../../common/helper"

export class BaseGeneratorService {

    protected __fake_data__(data: { lib: any, payload: any, key: string, valueIsFunc: boolean }) {

        const { lib, payload, key, valueIsFunc: isFunc } = data

        const {
            category, properties, isCamelCase, keyName,
            seedValue,
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


    protected __getData__(payload: any, getDatafunc: Function, objResult?: any, objToDelete?: any) {
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
                const populateResult = getDatafunc({
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