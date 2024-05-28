import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ApiExceptionFilter } from '@app/shared/filters/api.filter';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(graphqlUploadExpress());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return new BadRequestException({
          message: errors[0].constraints[Object.keys(errors[0].constraints)[0]],
        });
      },
      stopAtFirstError: true,
    }),
  );

  app.useGlobalFilters(new ApiExceptionFilter());

  const corsOptions = {
    origin: '*',
    credentials: true,
  };

  app.use(cors(corsOptions));

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
