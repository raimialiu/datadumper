import { FileFormat } from "../../common/enums/file-format.enum";
import { FileFormatter } from "./fileformatter.interface";

export class Formatters {

    private getFormatterClass(destFormat: FileFormat) {
        const keyName = destFormat.toString().toLowerCase()
        const fileName = keyName[0].toUpperCase()+keyName.slice(1)
        console.log({keyName, fileName})
        const req = require(`./providers/${keyName}.formater.service`)
        console.log({requireKey: req})
        const className = req[`${fileName}FileFormatterService`]
        const classInstance = new className()
        console.log({classInstance, className})


        return classInstance as FileFormatter

    }

    Transform(payload: { data: any; srcFormat: FileFormat;
        options?: any 
        destFormat: FileFormat; }) {
        const {data, srcFormat, destFormat, options} = payload

        const fileFormatterInstance = this.getFormatterClass(srcFormat)

        const transformResult = fileFormatterInstance.Transform({
            data, destFormat, options
        })

        return transformResult
    }

}