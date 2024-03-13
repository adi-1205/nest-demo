import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from '../../auth/enums/roles.enum';
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    verify_token: string

    @Column('boolean', { default: false })
    verified: boolean

    @Column({ default: Role.User })
    role: Role

    constructor(user: Partial<User>) {
        Object.assign(this, user)
    }
}