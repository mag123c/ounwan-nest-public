import {
    CallHandler,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { winstonLogger } from '../logger/winston';
import { getCurrentTimeStringFormat } from '../util/time.util';

//에러 전처리
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {

    constructor() {

    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError(async (exception) => {
                const request = context.getArgByIndex(0);
                const status = exception.errorCode?.status
                    ? exception.errorCode.status
                    : exception instanceof HttpException
                        ? exception.getStatus()
                        : HttpStatus.INTERNAL_SERVER_ERROR;
                const message = exception.errorCode?.message
                    ? exception.errorCode.message
                    : exception.message
                        ? exception.message
                        : 'UNKNOWN';
                const detail = exception?.response?.message ? exception.response.message : null;
                const user = exception.user ? exception.user
                    : request.headers.authorization ? request.headers.authorization.replace('Bearer ', '')
                        : 'UNKNOWN';
                const sql = exception.sql ? exception.sql : null;
                const sqlMessage = exception.sqlMessage ? exception.sqlMessage : null;

                let formatMessage: ErrorMessage = {
                    statusCode: status,
                    timestamp: getCurrentTimeStringFormat(),
                    path: request.url,
                    message: message,                    
                }

                if(detail) formatMessage.detail = detail;
                if (sql) formatMessage.sql = sql;
                if (sqlMessage) formatMessage.sqlMessage = sqlMessage;
                if (user) formatMessage.user = user;
                if (exception.stack) formatMessage.stack = exception.stack;

                winstonLogger.error(JSON.stringify(formatMessage, null, 2));                            

                throw exception;

            }),
        );
    }
   

}

type ErrorMessage = {
    statusCode: number;
    timestamp: any;
    path: string;
    message: string;        
    detail?: string;
    sql?: string;
    sqlMessage?: string;
    user?: string;
    stack?: string;
}