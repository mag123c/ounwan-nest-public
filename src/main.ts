require('dotenv').config()
const envFile = `.env.${process.env.NODE_ENV}`;
require('dotenv').config({ path: envFile });

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import compression from 'compression';
import cookieParser from 'cookie-parser';
import expressBasicAuth from "express-basic-auth";
import { initializeTransactionalContext } from "typeorm-transactional";
import { AppModule } from "./app/app.module";
import { setupSwagger } from "./common/config/swagger.config";
import { CustomHttpExceptionFilter } from "./common/filter/custom-exception.filter";
import { ErrorsInterceptor } from "./common/interceptor/error.interceptor";
import { winstonLogger } from "./common/logger/winston";

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  app.useLogger(winstonLogger);
  //lifecycle
  app.enableShutdownHooks();
  app.enableCors(
    {
      // origin: process.env.CORS_ORIGIN,
      origin:
        [
          'http://localhost:3000', 'http://127.0.0.1:3000',
          'https://app.ounwan.net', 
        ],
      credentials: true,
    }
  )
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: false }));
  //Decrease size of response body
  app.use(compression());
  app.use(cookieParser());
  app.useGlobalInterceptors(new ErrorsInterceptor());
  app.useGlobalFilters(new CustomHttpExceptionFilter());

  app.use(
    ['/api-docs'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );
  setupSwagger(app);

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    winstonLogger.error(`Uncaught Exception: ${err.message}`, {
        stack: err.stack,
    });
});


  app
    .listen(process.env.PORT || 1234, '0.0.0.0')
    .then(() => {
      console.log(`Server is running on ${process.env.PORT || 1234}`);
    });
}

bootstrap();
