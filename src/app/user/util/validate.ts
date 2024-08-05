import { UnauthorizedRefreshToken } from "src/common/error/domain/user";

export const isMatches401 = (exist: string, needValid: string) => {
    if (exist !== needValid) {
        throw new UnauthorizedRefreshToken();
    }
}