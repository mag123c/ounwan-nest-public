import { Body, Controller, Get, Inject, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EUser } from '../user/db/entity/user.entity';
import { ExtraUserInfo } from '../user/dto/request/signin.dto';
import { IUserService } from '../user/service/core/user.service';
import { TSocialUserInfo } from '../user/util/type';
import { AuthService } from './decorator/auth.service';
import { JwtTokenResopnse } from './dto/response/token.response';
import { GoogleAuthGuard } from './guard/google.guard';
import { KakaoAuthGuard } from './guard/kakao.guard';
import { NaverAuthGuard } from './guard/naver.guard';
import { RefreshGuard } from './guard/refresh.guard';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        @Inject('UserService')
        private userService: IUserService,
    ) { }

    @ApiOperation({
        summary: 'refresh access token',
        description: '제공된 RefreshToken을 검증하고 유효할 경우 새로운 AccessToken을 발급'
    })
    @ApiResponse({ status: 201, description: '토큰 재생성 완료', type: JwtTokenResopnse })
    @UseGuards(RefreshGuard)
    @Get('refresh-token')
    async validateToken(@Req() req: any, @Res() res: any): Promise<JwtTokenResopnse> {
        const eUser: EUser = await this.userService.getUserInfo(req.user.snsNo, req.user.userId);
        const renewToken: JwtTokenResopnse = this.authService.createToken(eUser);
        await this.userService.updateRefresToken(eUser.no, eUser.snsNo, eUser.userId, renewToken.refreshToken);
        this.setCookie(res, renewToken.accessToken, renewToken.refreshToken);        
        return res.json(renewToken);
    }

    @ApiOperation({ summary: '회원가입' })
    @ApiCreatedResponse({ description: 'User Info -> JWT Created', type: JwtTokenResopnse })
    @Post('signup')
    async signUp(@Body() signUpUserDto: ExtraUserInfo): Promise<JwtTokenResopnse> {
        return await this.authService.signUp(signUpUserDto);
    }

    @ApiOperation({
        summary: 'Kakao Signin href',
        description: '프론트에서 카카오 로그인 페이지로 리다이렉션하는 경로. 실제 window.location.href 사용'
    })
    @ApiResponse({ status: 302, description: '카카오 로그인 페이지로 리다이렉션' })
    @UseGuards(KakaoAuthGuard)
    @Get('signin/kakao')
    async kakaoSignIn(@Req() req: any) { }

    @ApiOperation({
        summary: 'Google Signin href',
        description: '프론트에서 구글 로그인 페이지로 리다이렉션하는 경로. 실제 window.location.href 사용'
    })
    @ApiResponse({ status: 302, description: '구글 로그인 페이지로 리다이렉션' })
    @UseGuards(GoogleAuthGuard)
    @Get('signin/google')
    async googleSignIn(@Req() req: any) { }

    @ApiOperation({
        summary: 'Naver Signin href',
        description: '프론트에서 네이버 로그인 페이지로 리다이렉션하는 경로. 실제 window.location.href 사용'
    })
    @ApiResponse({ status: 302, description: '네이버 로그인 페이지로 리다이렉션' })
    @UseGuards(NaverAuthGuard)
    @Get('signin/naver')
    async naverSignIn(@Req() req: any) { }


    @ApiOperation({
        summary: 'Kakao Signin callback',
        description: '카카오 로그인 후 콜백, 로그인 성공시 토큰을 발급하고 쿠키에 저장 후 메인 페이지로 리다이렉션, 실패시 로그인 페이지로 리다이렉션'
    })
    @ApiResponse({ status: 302, description: '메인 페이지로 리다이렉션' })
    @Redirect()
    @UseGuards(KakaoAuthGuard)
    @Get('signin/kakao/callback')
    async kakaoSignInCallback(@Req() req: any, @Res() res: any): Promise<{ url: string }> {
        return await this.createSocialSignInCallback(req, res);
    }


    @ApiOperation({
        summary: 'Naver Signin callback',
        description: '네이버 로그인 후 콜백, 로그인 성공시 토큰을 발급하고 쿠키에 저장 후 메인 페이지로 리다이렉션, 실패시 로그인 페이지로 리다이렉션'
    })
    @ApiResponse({ status: 302, description: '메인 페이지로 리다이렉션' })
    @Redirect()
    @UseGuards(NaverAuthGuard)
    @Get('signin/naver/callback')
    async naverSignInCallback(@Req() req: any, @Res() res: any): Promise<{ url: string }> {
        return await this.createSocialSignInCallback(req, res);
    }


    @ApiOperation({
        summary: 'Google Signin callback',
        description: '구글 로그인 후 콜백, 로그인 성공시 토큰을 발급하고 쿠키에 저장 후 메인 페이지로 리다이렉션, 실패시 로그인 페이지로 리다이렉션'
    })
    @ApiResponse({ status: 302, description: '메인 페이지로 리다이렉션' })
    @ApiOperation({ summary: 'Google Signin callback' })
    @Redirect()
    @UseGuards(GoogleAuthGuard)
    @Get('signin/google/callback')
    async googleSignInCallback(@Req() req: any, @Res() res: any): Promise<{ url: string }> {
        return await this.createSocialSignInCallback(req, res);
    }



    /**
     * @summary 소셜 로그인 콜백 공통 처리 로직
     * @description 로그인 성공시 토큰을 발급하고 쿠키에 저장 후 메인 페이지로 리다이렉션, 실패시 로그인 페이지로 리다이렉션
     * @param req 
     * @param res 
     */
    private async createSocialSignInCallback(req: any, res: any): Promise<{ url: string }> {
        const user: TSocialUserInfo = req.user;
        const token: JwtTokenResopnse = await this.authService.snsSignIn(user, res);
        if (token) {
            this.setCookie(res, token.accessToken, token.refreshToken);
            return { url: `${process.env.FRONT_MAIN_REDIRECT_URL}` };
        }
        else {
            return { url: `${process.env.FRONT_LOGIN_REDIRECT_URL}?snsType=${user.snsType}&userId=${user.userId}&no=${user.no}` };
        }
    }

    /**
     * @summary 쿠키 세팅
     * @param res 
     * @param accessToken 
     * @param refreshToken 
     */
    private async setCookie(res: any, accessToken: string, refreshToken: string): Promise<void> {       
        const maxAge: number = Number(process.env.MAX_AGE);
        const domain = process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : 'localhost';
        res.cookie('access_token', accessToken, {
            domain: domain,
            path: '/',
            maxAge: maxAge,
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            domain: domain,
            path: '/',
            maxAge: maxAge * 4,
        });        
    }
}
