import { Redis } from "ioredis";
import { RedisConfig } from "../../common/interface/program.config.interface";

export class RedisService {
    /**
     *
     */
    constructor(private config: RedisConfig, private redis?: Redis) {
        const {RD_HOST: host, 
            RD_PASS, RD_USER,
                RD_POR: port, RD_DB} = this.config


       redis = redis || new Redis(port as number, host, {
            db: RD_DB || 2,
            username: RD_USER,
            password: process.env.NODE_ENV != 'development' ? RD_PASS+'': undefined
        })

    }

    async get<T>(key: string): Promise<T | undefined> {
        const valueGotten = await this.redis?.get(key)

        if(valueGotten) {
            return JSON.parse(valueGotten) as T
        }

        return;
    }
}