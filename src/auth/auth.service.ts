import { BadRequestException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { User } from 'src/database/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { MailService } from 'src/mail/mail.service';
import { Role } from './enums/roles.enum';


@Injectable()
export class AuthService {

    constructor(
        @Inject('USER_REPOSITORY') private readonly user: Repository<User>,
        private jwtService: JwtService,
        private mailService: MailService
    ) { }

    async register(createUserDto: CreateUserDto) {
        try {

            const newUser = new User(createUserDto)
            const hashed = bcrypt.hashSync(newUser.password)
            newUser.password = hashed
            const randomString = crypto.randomBytes(8).toString("hex");
            const result = await this.user.save({ ...newUser, verify_token: randomString, role: Role.User })
            delete result.password
            let mailResult = await this.mailService.sendHtmlMail({
                from: process.env.MAIL_SENDER,
                to: newUser.email,
                subject: 'Verify email for NEST demo',
                context: {
                    url: `http://localhost:3000/auth/verify?tk=${randomString}&uname=${newUser.username}`
                }
            })

            if (!mailResult.sent) {
                throw new InternalServerErrorException('Verification can not be established, contact customer care.')
            }
            return { ...result, success: true }

        } catch (err) {

            if (err.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('Email address is already in use');
            } else {
                console.error('Error during registration:', err);
                throw new InternalServerErrorException('Something went wrong');
            }
        }
    }

    async verify({ tk = '', uname = '' }) {

        let result = await this.user.findOne({
            where: {
                username: uname,
                verify_token: tk
            }
        })

        if (result) {
            result.verified = true;
            await this.user.save(result)
            return true
        }
        return false;
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.user.findOne({ where: { email: loginUserDto.email } })

        if (!user) throw new UnauthorizedException('Invalid email or password')

        if (!bcrypt.compareSync(loginUserDto.password, user.password)) throw new UnauthorizedException('Invalid email or password')

        let token = await this.jwtService.sign({
            id: user.id,
        })

        return { token, success: true, user }
    }

    async findAll() {
        return await this.user.find({
            select: ['username', 'email']
        })
    }

    async del() {
        return await this.user.delete({})
    }
}
