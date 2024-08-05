import { CustomHttpException } from "../custom.error";
import { EFileErrorMessage } from "../enum/message";

export class UnsupportedTypeError extends CustomHttpException {
    constructor() {
        super(400, 200, EFileErrorMessage.UNSUPPORTED_TYPE);
    }
}

export class UnsupportedSizeError extends CustomHttpException {
    constructor() {
        super(400, 201, EFileErrorMessage.UNSUPPORTED_SIZE);
    }
}

export class FileExistsError extends CustomHttpException {
    constructor() {
        super(400, 202, EFileErrorMessage.EXISTS_FILE);
    }
}

export class FileNotFoundError extends CustomHttpException {
    constructor() {
        super(404, 200, EFileErrorMessage.NOT_FOUND_FILE);
    }
}