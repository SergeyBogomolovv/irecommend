import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ApiExceptionFilter } from '@app/shared/filters/api.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 50000000, maxFiles: 10 }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        throw new BadRequestException({
          message: errors[0].constraints[Object.keys(errors[0].constraints)[0]],
        });
      },
      stopAtFirstError: true,
    }),
  );
  app.useGlobalFilters(new ApiExceptionFilter());

  app.use(
    cors({
      origin: config.get('CLIENT_URL'),
      credentials: true,
    }),
  );
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('IRecommend')
    .setDescription('Api description for irecommend app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(config.get('APP_PORT'));
}
bootstrap();
