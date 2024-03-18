import { faker } from '@faker-js/faker'
import { Panic } from '../../common/constant'


export class Generator {
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
        console.log({ schema })
        this.schema = schema.getLib()
    }

    private schema: SchemaFuncImpl


    public generate(payload: {
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