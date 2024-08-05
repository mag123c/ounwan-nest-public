import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EUser } from 'src/app/user/db/entity/user.entity';
import { UserRole } from '../enum/role.enum';

@Injectable()
export class RoleStrategy extends PassportStrategy(Strategy, 'role') {
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
    if (payload.role == UserRole.ADMIN) {
      return new EUser().tokenToEntity(payload);
    }
  }
}
