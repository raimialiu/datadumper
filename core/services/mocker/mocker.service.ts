import { FastifyInstance } from "fastify";
import { GeneratorService } from "../../lib/generator/generator.service";

export class MockerService {

    constructor(private app: FastifyInstance) {
        this.genSvc = new GeneratorService((app as any)['providerConfig'])
    }

    private genSvc: GeneratorService

    public async getMockData(payload: {
        n: number,
        schemas: any
    }) {

        const { n, schemas } = payload

        const mockData = await this.genSvc.topN(n, schemas)

        return mockData
    }

}