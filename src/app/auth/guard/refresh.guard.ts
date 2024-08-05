import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UnauthorizedRefreshToken } from "src/common/error/domain/user";

@Injectable()
export class RefreshGuard extends AuthGuard('refresh') {
    canActivate(context) {
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if(err || !user) {
            throw err || new UnauthorizedRefreshToken();
        }
        return user;
    }
}