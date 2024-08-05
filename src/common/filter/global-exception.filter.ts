import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { CustomHttpException } from '../error/custom.error';
import { winstonLogger } from '../logger/winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let json = {
      statusCode: status,
      message: exception.message || 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (exception instanceof CustomHttpException) {
      json.statusCode = (status * 1000) + exception.errorCode;
    }

    if (exception.sql) json['sql'] = exception.sql;

    if (process.env.NODE_ENV !== 'production') json['stack'] = exception.stack;
    if (process.env.NODE_ENV === 'local') {
      winstonLogger.error(exception.stack);
    }

    response.status(status).json(json);
  }
}
