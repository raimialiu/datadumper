DEVELOPMENT_PLAN

-> DEFINE REQUIREMENT AND EXPLICITLY STATE WHAT NEED TO BE DONE
-> LIST ALL NEEDED LIBRARY, COMPONENTS
-> CREATE PROJECT AND INSTALL ANY NECCESSARY PROJECT
-> TAKE INSPIRATION FROM RANDOM_USER (API AND WEB PAGE)
-> MAKE SURE THE PROJECT RUNS
-> SET UP PROVIDER BASED LIBRARY
-> WRITE CORE FUNCTIONALITY
-> WRITE UNIT TEST FOR CORE FUNCTIONALITY (USE IT TO LEARN UNIT TEST AGAIN IN NODEJS)
-> MODIFY CORE FUNCTIONALITY AND COMPLETE IT
-> DEPLOY FOR BETA TESTIN (USING KUBERNETES)
-> LET ADA OR ANKOH BEGIN TEST
-> START UI IMPLEMENTATION (USE IT TO LEARN REACT)
-> START UI TESTING .....

MY SERIOUSNESS HERE BEGINS

A   REQUIREMENT 
    -> Build a web based service that can be used to generate and mock data in a massive way (greatly inspired by mackaroo)
    -> Can Generate MOCKED DATA UP TO
            -> 500 for Free User (three times per month)
            -> 10000 for Standard User (10 times per month)
            ->  Unlimited Data For Premium Users.
    -> Generated Data can be download in the following format
            -> CSV -> (CALL ENDPOINT, SAVE to S3, Azure, GCP BUCKET) -> PREMIMUM USER
            -> TSV -> (CALL ENDPOINT, SAVE to S3, Azure, GCP BUCKET) -> PREMIMUM USER
            -> JSON -> (CALL ENDPOINT, SAVE to S3, Azure, GCP BUCKET) -> PREMIMUM USER
            -> YAML -> (CALL ENDPOINT, SAVE to S3, Azure, GCP BUCKET) -> PREMIMUM USER
            -> XML
            -> ENV
            -> Sql Inserts (can automatically insert data if given db credentials (PREMIUM USER))
        -> KEEP history of record generated and be reused -> (PREMIUM USER), Data Retention 30 days
        -> Can be Used to Generate Table Structures (Indexes, Relationships, Primary Key)-> (MYSQL, POSTGRES, SQLSERVER FOR NOW)
        -> Take Json Data and use it to Generata Data, Table Structure and Can push to upstream source
        -> Premium User can bring their OWN BASE FAKER IMPLEMENTATION....(Javascript only)
        -> The Service should be able to switch provider automatically

B   LIBRARIES AND COMPONENTS
    -> Build with Fastify (typescript)
    -> Mock Data Provider (can auto/manual switch)
        -> Faker
        -> Falso
        -> Dumper (self-implemented) -> Phase 2
    -> Multiple DB Supported
        -> Mysql
        -> SqlServer
        -> Postgress

C   CREATE PROJECT AND INSTALL NECESSARY LIBRARY (-> ONGOING)