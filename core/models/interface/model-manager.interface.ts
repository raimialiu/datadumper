import { FindOptionsWhere } from "typeorm"

export interface ModelManager {
    GetOne<T>(condition: FindOptionsWhere<T>): Promise<T>
    GetMany<T>(condition: FindOptionsWhere<T>, options: {
        limit: number,
        page_index: number,
        orderBy?: any
        sortOrder: 'DESC' | 'ASC',
        relations?: any
    }): Promise<T[]>

    Create<T>(payload: Partial<T>, save?: boolean): Promise<T>

}