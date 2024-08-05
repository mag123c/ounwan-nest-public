import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { CustomHttpException } from '../error/custom.error';

@Catch(CustomHttpException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
  catch(exception: CustomHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.statusCode;
    const stack = exception.stack;

    let json = {
      errorCode: (status * 1000) + exception.errorCode,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    if (process.env.NODE_ENV !== 'production') {
      json['stack'] = stack;

      if (exception.sql) {
        json['sql'] = exception.sql;
      }      
    }

    if (process.env.NODE_ENV === 'local') {
      new Logger().log(stack);
    }

    response
      .status(status)
      .json(json);
  }
}
