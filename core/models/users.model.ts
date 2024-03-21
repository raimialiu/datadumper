import { Column, CreateDateColumn, Entity, FindOptionsWhere, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { SchemaModel } from "./schema.model";

@Entity({ name: 'users' })
export class UsersModel {

    constructor(data?: Partial<UsersModel>) {
        if (data) {
            const { email_address, password,
                password_hint,is_active,
                deleted_at, updated_at } = data

            this.email_address = email_address
            this.password = password
            this.password_hint = password_hint
            this.is_active = is_active
            this.deleted_at = deleted_at
            this.updated_at = updated_at
        }
    }




    static Create(payload: Partial<UsersModel>): UsersModel {
        return new UsersModel(payload)
    }


    @PrimaryColumn()
    @PrimaryGeneratedColumn('uuid')
    id: string


    @Column({ length: 100 })
    email_address: string

    password: string

    @Column({ nullable: true })
    password_hint: string

    @Column({ nullable: true })
    updated_at?: Date

    @CreateDateColumn()
    created_at: Date

    @Column({ nullable: true })
    deleted_at?: Date

    @Column({ nullable: true })
    is_deleted?: boolean

    @Column({ default: true })
    is_active: boolean
    

    @OneToMany((type) => SchemaModel, (l) => l.user, { cascade: false })
    schemas: SchemaModel[]

}