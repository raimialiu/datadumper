import { DeepPartial, EntityTarget, FindOptionsOrder, FindOptionsOrderValue, FindOptionsWhere } from "typeorm"

export type keytype<T> = keyof T

export interface Repository {
    SaveOne<T>(Payload: DeepPartial<T>): Promise<T>
    SaveMany<T>(Payload: DeepPartial<T>[]): Promise<T[]>
    GetOne<T>(condition: FindOptionsWhere<T>): Promise<T>
    GetMany<T>(condition: FindOptionsWhere<T>, options: {
        limit: number,
        page_index: number,
        orderBy?: FindOptionsOrder<T>
        sortOrder: FindOptionsOrderValue,
        relations?: any
    }): Promise<T[]>

}