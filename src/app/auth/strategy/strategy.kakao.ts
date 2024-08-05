import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-kakao';
import { TSocialUserInfo } from "src/app/user/util/type";

@Injectable()
export class KakaoOAuthStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor() {
        super({
            clientID: process.env.KAKAO_API_KEY,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
            callbackURL: process.env.KAKAO_LOGIN_CALLBACK_URL,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any, info?: any) => void) {
        try {
            const user: TSocialUserInfo = {
                no: profile.id,
                userId: profile._json.kakao_account.email,
                snsType: 1,
            }
            done(null, user)
        }
        catch (error) {
            done(error);
        }        
    }
}