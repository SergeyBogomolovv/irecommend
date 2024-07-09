import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@app/shared';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet());

  app.use('/graphql', graphqlUploadExpress());

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

  app.useGlobalFilters(new GqlExceptionFilter());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

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
  await app.listen(config.get('APP_PORT'), () => {
    logger.log(`App started on ${config.get('APP_PORT')}`);
  });
}
bootstrap();
