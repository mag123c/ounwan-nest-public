import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ForbiddenResource, UnauthorizeAccessToken } from 'src/common/error/domain/user';
import { UserRole } from '../enum/role.enum';

@Injectable()
export class RoleGuard extends AuthGuard('role') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        return await super.canActivate(context) as boolean;
    }

    handleRequest(err, user, info) {
        if(err || !user) {
            throw new UnauthorizeAccessToken();
        }
        if (user.role != UserRole.ADMIN) {
            throw new ForbiddenResource();
        }
        return user;
    }
}