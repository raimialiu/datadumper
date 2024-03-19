import { Panic } from '../../common/constant'
import { IGenerator } from './provider/interface/generator.interface'


export class GeneratorService {
    constructor(private payload: {
        libName: string,
        namespace?: string,
        preceeded?: boolean,
        deepRootedMainObject?: boolean
        mainObj?: string,
        preceededKey?: string,
        valueIsFunc?: boolean
        hasConstructor?: boolean,
        constructorArgs?: any
    }) {

        const schema = new SchemaFuncImpl(this.payload)
        // console.log({ schema })
        this.schema = schema//.getLib()
    }

    private schema: SchemaFuncImpl


    private getClassFunc() {
        const libName = this.payload.libName[0].toUpperCase() + this.payload.libName.slice(1)

        const requireKey = libName + 'GeneratorService'
        const classRequire = require(`./provider/generator.${this.payload.libName}.service`)

        const className = classRequire[requireKey]
        const classInstance = new className(this.schema)

        console.log({ className, classInstance, requireKey })

        return classInstance as IGenerator
    }

    private async generateData(n: number, schemaPayload: any) {
        const classInstance = this.getClassFunc()
        const data = await classInstance.topN(n, schemaPayload)

        return data
    }

    public async topN(n: number, schemaPayload: any) {

        return await this.generateData(n, schemaPayload)
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
        valueIsFunc?: boolean,
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

    get properties() {
        return this.payload
    }

}

export interface SchemaFunc {
    getLib(): any
    runLibFunc(): any
}


// Takes a LIB and generate data