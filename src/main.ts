import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { GqlExceptionFilter } from 'src/common';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const dataSource = app.get<DataSource>(DataSource);

  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, async () => {
      try {
        await dataSource.destroy();
        logger.debug('Database connection closed.');
      } catch (err) {
        logger.error('Error while closing database connection', err);
      }
      await app.close();
      logger.debug('Nest application closed.');
      process.exit(0);
    });
  });

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

  await app.listen(config.get('PORT') || 3000, () => {
    logger.log(`App started on ${config.get('PORT')}`);
  });
}
bootstrap();
