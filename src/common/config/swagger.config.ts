import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Swagger 세팅
 * @param {INestApplication} app
 */
export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('위드 라이트 Node API')
    .setDescription('위드 라이트 Node API / 2024.01.04 ~')
    .setVersion('1.0.0')
    .addTag('swagger')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: "JWT",
      in: "header",
    },
    'accessToken'
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document, {
    swaggerOptions: { 
      //bearer token 유지 - 편의성
      persistAuthorization: true,
    }
  });
}