export interface IGenerator {
    topN(n: number, schemaPayload: any):Promise<any>
    getData(data: { payload: any, key: string }): any
}