import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreatedUserResponse } from 'src/app/user/dto/response/user.response';
import { JwtTokenCreatedError } from 'src/common/error/domain/user';
import { userLogger } from 'src/common/logger/api.logger';
import { Transactional } from 'typeorm-transactional';
import { EUser } from '../../user/db/entity/user.entity';
import { ExtraUserInfo } from '../../user/dto/request/signin.dto';
import { IUserService } from '../../user/service/core/user.service';
import { JwtTokenResopnse } from '../dto/response/token.response';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        @Inject('UserService')
        private userService: IUserService
    ) { }

    async snsSignIn(user: CreatedUserResponse, res: any): Promise<JwtTokenResopnse | null> {
        const existUser: EUser = await this.userService.getUserInfo(user.no, user.userId);
        if (existUser) {
            const role = await this.userService.getUserRole(existUser.no);
            if (role && role == 'admin') {
                existUser.role = role;
            }
            const { accessToken, refreshToken } = this.createToken(existUser);
            await this.userService.updateRefresToken(existUser.no, existUser.snsNo, existUser.userId, refreshToken);
            return new JwtTokenResopnse(accessToken, refreshToken);
        }
        return null;
    }

    @Transactional({ connectionName: 'ounwanDataSource' })
    async signUp(signUpUserDto: ExtraUserInfo): Promise<JwtTokenResopnse> {

        try {
            const existsEUser: EUser = await this.userService.getUserInfo(signUpUserDto.snsNo, signUpUserDto.userId);

            if (!existsEUser) {
                const signUpUser: EUser = await this.userService.saveUserInfo(signUpUserDto);

                const token = this.createToken(signUpUser);
                await this.userService.updateRefresToken(signUpUser.no, signUpUser.snsNo, signUpUser.userId, token.refreshToken);

                userLogger('signup', signUpUser);
                return token;
            }
        }
        catch (e) {
            userLogger('error', `[User] 회원가입 실패(${signUpUserDto}): ${e}`);
        }

    }

    createToken(userInfo: EUser): JwtTokenResopnse {
        const payload = this.createPayload(userInfo);
        return new JwtTokenResopnse(this.createAccessToken(payload), this.createRefreshToken(payload));
    }

    createPayload(userInfo: EUser) {
        return {
            no: userInfo.no,
            snsNo: userInfo.snsNo,
            userId: userInfo.userId,
            role: userInfo.role
        }
    }

    createAccessToken(payload: { no: number, snsNo: string, userId: string }) {
        try {
            return this.jwtService.sign(payload,
                {
                    secret: this.configService.get('JWT_SECRET'),
                    expiresIn: this.configService.get('JWT_EXPIRATION_TIME')
                });
        }
        catch (e) {
            throw new JwtTokenCreatedError(e.message);
        }

    }

    createRefreshToken(payload: { no: number, snsNo: string, userId: string }) {
        try {
            return this.jwtService.sign(payload,
                {
                    secret: this.configService.get('JWT_SECRET'),
                    expiresIn: this.configService.get('JWT_EXPIRATION_REFRESH_TIME')
                });
        }
        catch (e) {
            throw new JwtTokenCreatedError(e.message);
        }

    }

    decodeToken(token: string) {
        return this.jwtService.decode(token);
    }

}
