import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserService } from 'src/app/user/service/core/user.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(
        private readonly configService: ConfigService,
        @Inject('UserService')
        private readonly userService: IUserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.headers?.authorization?.split(' ')[1];
            }]),
            ignoreExpiration: false,
            passReqToCallback: true,
            algorithms: ['HS256'],
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    /**
     * @param payload => jwt payload
     */
    async validate(req: Request, payload: any, done: (error: any, user?: any, info?: any) => void) {
        try {
            const refreshToken = req.headers.authorization.split(' ')[1];
            await this.userService.matchRefreshToken(payload.snsNo, payload.userId, refreshToken);
            done(null, payload)
        }
        catch (e) {
            done(e);
        }

    }
}
