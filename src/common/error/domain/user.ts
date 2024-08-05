import { CustomHttpException } from "../custom.error";
import { EUserErrorMessage } from "../enum/message";

export class DuplicateUserId extends CustomHttpException {
    constructor() {
        super(400, 100, EUserErrorMessage.DUPLICATE_USERID);
    }
}

export class DuplicateNickname extends CustomHttpException {
    constructor() {
        super(400, 101, EUserErrorMessage.DUPLICATE_NICKANME);
    }
}

export class UserNotFound extends CustomHttpException {
    constructor() {
        super(404, 100, EUserErrorMessage.NOT_FOUND_USER);
    }
}

export class UnauthorizeAccessToken extends CustomHttpException {
    constructor() {
        super(401, 100, EUserErrorMessage.INCORRECT_ACCESS_TOKEN);
    }
}

export class UnauthorizedRefreshToken extends CustomHttpException {
    constructor() {
        super(401, 101, EUserErrorMessage.INCORRECT_REFRESH_TOKEN);
    }
}

export class ForbiddenResource extends CustomHttpException {
    constructor() {
        super(403, 100, EUserErrorMessage.ISNOT_ADMIN);
    }
}

export class JwtTokenCreatedError extends CustomHttpException {
    constructor(message: string) {
        super(500, 100, message);
    }
}