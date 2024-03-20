import { FileFormat } from "../../common/enums/file-format.enum"

export interface FileFormatter {
    Transform(payload:{
        data: any,
        destFormat: FileFormat,
        options?: any
    }): any


    __JSON__(data:any, options?: any): any // internal method for each formatter, so I want each formmater to have it and the same time provide common interface for all of them
    __SQL__(data:any, options?: any): any

}