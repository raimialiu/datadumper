import { DeepPartial, EntityTarget, FindOptionsWhere } from "typeorm"

export interface Repository {
    SaveOne<T>(Payload: DeepPartial<T>): Promise<T>
    SaveMany<T>(Payload: DeepPartial<T>[]): Promise<T[]>
    GetOne<T>(condition: FindOptionsWhere<T>): Promise<T>
    GetMany<T>(condition: FindOptionsWhere<T>, options: {
        limit: number,
        page_index: number,
        orderBy?: any
        sortOrder: 'DESC' | 'ASC',
        relations?: any
    }): Promise<T[]>

}