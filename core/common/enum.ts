export enum DB_DIALECT {
    MYSQL ="mysql",
    POSTGRESS = "postgress",
    SQL_SERVER="sql_server"
}


export enum FAKER_PROVIDER {
    FAKER = "faker",
    FALSO ="falso",
    CHANCE="chance",
    CASUAL="casual",
    DDumper="ddumper"
}

export enum LOG_PROVIDER {
    WINSTON="winston",
    NLOG="nlog"
}

export enum LOG_CHANNELS {
    CONSOLE="console",
    FILE="file",
    CLOUDWTACH="cloudwatch",
    SPLUNK="splunk"
}

export enum AUTHENTICATION_SCHEMES {
    BEARER_TOKEN=1,
    API_KEYS,
    BASIC
}

export enum AUTHENTICATION_PROVIDER {
    JWT_TOKEN,
    OKTA,
    PASSPORT,
    LOCAL
}