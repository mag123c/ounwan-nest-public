import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './decorator/auth.service';
import { JwtStrategy } from './strategy/startegy.jwt';
import { GoogleOAuthStrategy } from './strategy/strategy.google';
import { KakaoOAuthStrategy } from './strategy/strategy.kakao';
import { NaverOAuthStrategy } from './strategy/strategy.naver';
import { RefreshStrategy } from './strategy/strategy.refresh';
import { RoleStrategy } from './strategy/strategy.role';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [
        ConfigModule,
      ],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION_TIME'),
          algorithm: 'HS256',
        },
        secret: configService.get<string>('JWT_SECRET'),
      }),

    }),

    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    
    JwtStrategy,
    GoogleOAuthStrategy,
    KakaoOAuthStrategy,
    NaverOAuthStrategy,
    RefreshStrategy,
    RoleStrategy,
  ],
})
export class AuthModule { }
