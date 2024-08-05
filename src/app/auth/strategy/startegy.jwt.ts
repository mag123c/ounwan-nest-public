import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EUser } from 'src/app/user/db/entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['HS256'],
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
   * @param payload => jwt payload
   */
  async validate(payload: any) {
    const user: EUser = new EUser();
    user.no = payload.no;
    user.snsNo = payload.snsNo;
    user.userId = payload.userId;
    return user;
  }
}
