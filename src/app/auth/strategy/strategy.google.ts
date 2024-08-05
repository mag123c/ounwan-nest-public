import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { TSocialUserInfo } from "src/app/user/util/type";

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.GOOGLE_LOGIN_CALLBACK_URL}`,
      scope: ['email', 'profile'],
    })
  }

  //refresh token get
  authorizationParams(): { [key: string]: string; } {
    return ({
      access_type: 'offline',
      prompt: 'select_account',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const user: TSocialUserInfo = {
        no: profile.id,
        userId: profile.emails[0].value,
        snsType : 3,
      };
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
