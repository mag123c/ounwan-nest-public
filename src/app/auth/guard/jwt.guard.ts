import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizeAccessToken } from 'src/common/error/domain/user';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        return await super.canActivate(context) as boolean;
    }

    handleRequest(err: any, user: any, info: any) {
        if(err || !user) {            
            throw new UnauthorizeAccessToken();
        }
        return user;
    }
}