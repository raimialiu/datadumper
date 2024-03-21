import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UsersModel } from "./users.model";

@Entity({ name: 'schemas' })
export class SchemaModel {


    constructor(data?: Partial<SchemaModel>) {
        if (data) {
            const { description, name, is_active,
                deleted_at, updated_at,id } = data

            this.id = id
            this.name = name
            this.description = description
            this.is_active = is_active
            this.deleted_at = deleted_at
            this.updated_at = updated_at
        }
    }




    static Create(payload: Partial<SchemaModel>): SchemaModel {
        return new SchemaModel(payload)
    }

    @PrimaryColumn()
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ length: 60 })
    name: string

    @Column({ length: 80 })
    user_id: string

    @Column({ nullable: true, type: 'text' })
    description?: string

    @Column({ type: 'json' })
    schema_definition: string


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

    @ManyToOne(() => UsersModel, user => user.schemas)
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: UsersModel
}