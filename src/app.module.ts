import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),

        APP_PORT: Joi.string().required(),

        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().integer().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().integer().required(),

        MAIL_TRANSPORT: Joi.string().required(),
        MAIL_HOST: Joi.string().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASS: Joi.string().required(),

        YANDEX_ACCESS: Joi.string().required(),
        YANDEX_SECRET: Joi.string().required(),
        YANDEX_BUCKET: Joi.string().required(),
      }),
    }),
    EventEmitterModule.forRoot(),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          ttl: 3 * 60 * 1000,
          socket: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
          },
        });
        return { store };
      },
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        port: config.get('POSTGRES_PORT'),
        database: config.get('POSTGRES_DB'),
        username: config.get('POSTGRES_USER'),
        password: config.get('POSTGRES_PASSWORD'),
        host: config.get('POSTGRES_HOST'),
        entities: [],
        synchronize: true,
      }),
    }),
    MailModule,
    AuthModule,
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: 'src/schema.gql',
    // }),
  ],
})
export class AppModule {}
