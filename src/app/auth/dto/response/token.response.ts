export class JwtTokenResopnse  {
    status: number = 201;    
    accessToken: string;
    refreshToken: string;    

    constructor(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}