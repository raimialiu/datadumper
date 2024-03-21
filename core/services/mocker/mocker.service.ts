import { FastifyInstance } from "fastify";
import { GeneratorService } from "../../lib/generator/generator.service";
import { appendFile, createReadStream, createWriteStream, unlinkSync, writeFile, writeFileSync } from "fs";
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');


export class MockerService {

    constructor(private app: FastifyInstance) {
        this.genSvc = new GeneratorService((this.app as any)['providerConfig'])
    }

    private genSvc: GeneratorService

    public async getMockData(payload: {
        n: number,
        schemas: any,
        pagination?: any
    }) {

        const { n, schemas } = payload

        const mockData = await this.genSvc.topN(n, schemas)
        //console.log({ mockData })

        return mockData
    }

    public async downloadMockData(payload: {
        mockedData?: any,
        format: 'json' | 'csv' | 'text' | 'sql',
        sqlTableName?: string, fileName?: string
    }) {

        const { mockedData, format, sqlTableName, fileName } = payload
        const downloadResult = await this.downloadData({
            payload: mockedData, fileName,
            format
        })

        return downloadResult

    }


    private async downloadData(data: {
        payload: any,
        fileName?: string,
        format: string
    }) {

        let { payload, fileName, format } = data

        fileName = (fileName || Date.now()) + `.${format}`

        console.log({ fileName })

        writeFileSync(fileName, JSON.stringify(payload), {
            flush: true, flag: 'w+'
        })


        const fileFd = await readFile(resolve(fileName)) //createReadStream(resolve(fileName))
        // await readFile(resolve(fileName))
        console.log({ fileFd })
        unlinkSync(resolve(fileName))

        return { fileFd, fileName }
    }

}