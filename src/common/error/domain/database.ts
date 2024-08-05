import { CustomHttpException } from "../custom.error";

export class InsertFail extends CustomHttpException {
    constructor(message: string, sql: string, sqlMessage: string) {
        super(500, 100, message, sql, sqlMessage);
    }
}

export class SelectFail extends CustomHttpException {
    constructor(message: string, sql: string, sqlMessage: string) {
        super(500, 101, message, sql, sqlMessage);
    }
}

export class UpdateFail extends CustomHttpException {
    constructor(message: string, sql: string, sqlMessage: string) {
        super(500, 102, message, sql, sqlMessage);
    }
}

export class DeteleFail extends CustomHttpException {
    constructor(message: string, sql: string, sqlMessage: string) {
        super(500, 103, message, sql, sqlMessage);
    }
}