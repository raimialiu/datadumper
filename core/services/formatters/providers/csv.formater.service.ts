import { FileFormat } from "../../../common/enums/file-format.enum";
import { FileFormatter } from "../fileformatter.interface";

export class CsvFileFormatterService implements FileFormatter {

    /**
     *
     */
    constructor() {
        //super();

    }

    __SQL__(data: any, options?: any) {
        throw new Error("Method not implemented.");
    }

    Transform(payload: { data: any; destFormat: FileFormat; }) {
        const { data, destFormat } = payload
        const funcToCall = `__${destFormat.toString().toUpperCase()}__`
        console.log({ funcToCall })
        const self: any = this
        const convertResult = self[funcToCall](data)//Function.call(funcToCall, data)
        console.log({ convertResult })

        return convertResult
    }

    public __JSON__(jsonData: any, options?: any) {
        if (!Array.isArray(jsonData)) {
            const keys = Object.keys(jsonData);
            let csvContent = keys.join(',') + '\n'

            const mappedString = keys.map((kv: string, i) => {
                let cell = jsonData[kv] === null ? '' : jsonData[kv].toString();
                cell = cell.replace(/,/g, '');
                const nextItem = jsonData[i]
                if (nextItem) {
                    return cell + `,` + nextItem
                }
                else {
                    return cell
                }
            })
            console.log({ mappedString })

            csvContent = csvContent + mappedString[0]

            return csvContent
        }
        else {
            const keys = Object.keys(jsonData[0]);
            const csvContent =
                keys.join(',') +
                '\n' +
                jsonData
                    .map((item: any) => {
                        return keys
                            .map((key) => {
                                let cell = item[key] === null ? '' : item[key].toString();
                                cell = cell.replace(/,\"/g, '');
                                return `"${cell}"`;
                            })
                            .join(',');
                    })
                    .join('\n');

            return csvContent;
        }
    }

}