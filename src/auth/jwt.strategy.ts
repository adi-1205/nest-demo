import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from "src/database/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('USER_REPOSITORY') private readonly user: Repository<User>,
    ) {
        super({
            jwtFromRequest: function (req) {
                var token = null;
                if (req && req.cookies) {
                    token = req.cookies['auth'];
                }
                
                return token;
            },
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload) {
        const { id } = payload

        const user = this.user.findOne({ where: { id } })

        if (!user) throw new UnauthorizedException('Unauthorized')

        return user
    }

}

