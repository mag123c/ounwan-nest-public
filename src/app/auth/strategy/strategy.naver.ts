import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-naver-v2";
import { TSocialUserInfo } from "src/app/user/util/type";

@Injectable()
export class NaverOAuthStrategy extends PassportStrategy(Strategy, 'naver') {
    constructor() {
        super({
            clientID: process.env.NAVER_CLIENT_ID,
            clientSecret: process.env.NAVER_CLIENT_SECRET,
            callbackURL: process.env.NAVER_LOGIN_CALLBACK_URL,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any, info?: any) => void) {
        try {
            const user: TSocialUserInfo = {
                no: profile.id,
                userId: profile.email,                
                snsType: 2,
            };
            done(null, user)
        }
        catch (error) {
            done(error);
        }        
    }
}