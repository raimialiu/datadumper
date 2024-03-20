import { FileFormat } from "../../../common/enums/file-format.enum";
import { FileFormatter } from "../fileformatter.interface";

export class SqlFileFormatterService implements FileFormatter {

    __SQL__(data: any, options?: any) {
          const { wrapIdentifier, wrapValues, tableName } = options;
        const jsonData = data

        if (!Array.isArray(jsonData)) {
            const keys = Object.keys(jsonData)
            const columnNames = wrapIdentifier
                ? keys.map((key) => `"${key}"`).join(',')
                : keys.join(',');

            let insertStatements = ``

            const mappedString = keys.map((key: string, i: number) => {
                const nextItem = jsonData[i]
                const current = jsonData[key]
                const toInsertQuote = typeof current == 'string' ? `'${current}'` : `${current}`
                let value = current === null ? 'NULL' : toInsertQuote

                nextItem ? insertStatements += value + ',' : insertStatements += value

                return insertStatements
            })

            console.log({ mappedString, insertStatements })

            return `INSERT INTO ${wrapIdentifier ? `"${tableName}"` : tableName} (${columnNames}) VALUES (${mappedString[0]});`;

        }
        else {
            const keys = Object.keys(jsonData[0]);
            const columnNames = wrapIdentifier
                ? keys.map((key) => `"${key}"`).join(',')
                : keys.join(',');

            const insertStatements = jsonData.map((item: any) => {
                const values = keys
                    .map((key) => {
                        const toInsertQuote = typeof (item[key]) == 'string' ? `'${item[key]}'` : `${item[key]}`
                        let value = item[key] === null ? 'NULL' : toInsertQuote // `'${item[key]}'`;
                        if (wrapValues) {
                            value = `'${value}'`;
                        }
                        return value;
                    })
                    .join(',');

                return `INSERT INTO ${wrapIdentifier ? `"${tableName}"` : tableName} (${columnNames}) VALUES (${values});`;
            });

            return insertStatements.join('\n');
        }
    }


    Transform(payload: { data: any; destFormat: FileFormat; options?: any }) {
        const { data, destFormat, options } = payload
        const funcToCall = `__${destFormat.toString().toUpperCase()}__`
        console.log({ funcToCall })
        const self: any = this
        const convertResult = self[funcToCall](data, options)//Function.call(funcToCall, data)
        console.log({ convertResult })

        return convertResult
    }


    __JSON__(data: any) {
        throw new Error("Method not implemented.");
    }


}