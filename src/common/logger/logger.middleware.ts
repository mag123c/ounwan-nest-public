import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { winstonLogger } from './winston';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor() { }

    use(req: Request, res: Response, next: NextFunction) {
        const { ip, method, originalUrl } = req;
        const userAgent = req.get('user-agent');

        res.on('finish', () => {
            const { statusCode } = res;

            //200번대 -> INFO
            //400번대 -> 비즈니스 로직 에러 관리를 위한 warn레벨
            //500번대 -> 코드에러, ORM에러 분류를 위한 error레벨
            if (statusCode >= 200 && statusCode < 300) {

                winstonLogger.log(`[${method}]${originalUrl}(${statusCode}) ${ip} ${userAgent}`);

            }

            if (statusCode >= 300 && statusCode < 400) {

                winstonLogger.warn(`[${method}]${originalUrl}(${statusCode}) ${ip} ${userAgent}`);

            }
            if (statusCode >= 400 && statusCode <= 500) {

                winstonLogger.error(`[${method}]${originalUrl}(${statusCode}) ${ip} ${userAgent}`);
                
            }
        });

        next();
    }
}