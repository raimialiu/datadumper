import { Panic } from '../../common/constant'


export class GeneratorService {
    constructor(payload: {
        libName: string,
        namespace?: string,
        preceeded?: boolean,
        deepRootedMainObject?: boolean
        mainObj?: string,
        preceededKey?: string,
        hasConstructor?: boolean,
        constructorArgs?: any
    }) {

        const schema = new SchemaFuncImpl(payload)
       // console.log({ schema })
        this.schema = schema.getLib()
    }

    private schema: SchemaFuncImpl


    public __generate(payload: {
        keyName: string,
        properties: any,
        category?: string,
        isFunc?: boolean
    }) {

        const { keyName, properties, category, isFunc } = payload
        const lib: any = this.schema

        const randomResult = properties ? lib[category][keyName](properties) : lib[category][keyName]


        return isFunc ? randomResult() : randomResult

    }



    private __getData__(payload: any) {

        const lib: any = this.schema

        let objResult: any = {}

        Object.keys(payload).forEach((v: any) => {
            // console.log({
            //     currentItem: v,
            //     itemValue: payload[v]
            // })
            const {
                isFunc, category, properties, isCamelCase, keyName
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
        })

        return objResult

    }

    // deprecated....
    public async getData(payload: ISchemaGenFactory[]) {

        let schemaTask: any[] = []

        payload.forEach((p) => {
            const { keyName, properties, category, isFunc } = p
            schemaTask.push(

                this.__generate({
                    keyName, properties, category, isFunc
                })
            )
        })

        const results = await Promise.all(schemaTask)

        return results

    }

    public async topN(n: number, schemaPayload: any) {
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


}

export interface GetDataBaseSchema {
    category: string,
    properties: ISchemaGenFactory
}

export interface ISchemaGenFactory {
    keyName: string,
    properties: any,
    category?: string,
    isFunc?: boolean
}

export class SchemaFuncImpl implements SchemaFunc {
    constructor(private payload: {
        libName: string,
        namespace?: string,
        preceeded?: boolean,
        deepRootedMainObject?: boolean
        mainObj?: string,
        preceededKey?: string,
        hasConstructor?: boolean,
        constructorArgs?: any
    }) {

        this.__init__()
    }

    public libSchema: any

    private __init__() {

        const wrapFunc = (keyName: string, preceeded?: boolean,
            preceededKey?: string,
            mainObjKey?: string,
            initFunc?: boolean, initArgs?: any) => {

            const _initFunc = preceeded ? require(`${preceededKey}${keyName}`)
                : require(`${keyName}`)

            if (initFunc) {
                const funcNew = new _initFunc(initArgs)
                console.log({ funcNew })

                return mainObjKey ? funcNew[mainObjKey] : funcNew
            }

            return mainObjKey ? _initFunc[mainObjKey]
                : _initFunc

        }

        const { libName, namespace,
            preceeded,
            preceededKey, mainObj, hasConstructor, constructorArgs } = this.payload

        const requireKey = namespace ? `${namespace}/${libName}` : `${libName}`

        const funcWrapResult = wrapFunc(requireKey, preceeded, preceededKey, mainObj,
            hasConstructor, constructorArgs)

        // console.log({ funcWrapResult })

        this.libSchema = funcWrapResult

    }

    getLib() {
        if (!this.libSchema) {
            Panic('Library is not initialized')
        }

        return this.libSchema
    }

    runLibFunc() {
        return this.libSchema()
    }

}

export interface SchemaFunc {
    getLib(): any
    runLibFunc(): any
}


// Takes a LIB and generate data