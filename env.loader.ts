import {readFileSync} from 'fs'
export class EnvLoader {
 
    static Load<T>(objType: any, filePath?: string): T {
        let envfileType = Object.create(objType)
       

        const appendValue = (baseObject, key, value) =>{
            const objectKeys = Object.keys(baseObject)
            console.log({objectKeys})
            const containsKeys = objectKeys.includes(key)

            if(containsKeys) {
                baseObject[key] = value
            }
        }

        if(!filePath) {
            const envs = Object.entries(process.env)

            envs.forEach((v)=>{
                const [key, value] = v
                appendValue(envfileType, key, value)
            })
        }
        else {
            const data = Buffer.from(readFileSync(filePath)).toString()
            data.split(/\r?\n/)
                .forEach((line) =>{
                    const [key, value] = line.split('=')
                    appendValue(envfileType, key, value)

            })
        }

        console.log({envfileType})
        return envfileType as T
    }

    
}