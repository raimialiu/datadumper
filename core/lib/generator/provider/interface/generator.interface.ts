export interface IGenerator {
    topN(n: number, schemaPayload: any):Promise<any>
}