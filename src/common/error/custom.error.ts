export class CustomHttpException extends Error {
    sql?: string;
    sqlMessage?: string;
    constructor(public statusCode: number, public errorCode: number, public message: string, sql?: string, sqlMessage?: string) {
        super(message);        

        if (sql) this.sql = sql;
        if (sqlMessage) this.sqlMessage = sqlMessage;

        Object.setPrototypeOf(this, CustomHttpException.prototype);
    }
    
}