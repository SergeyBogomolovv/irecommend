import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { S3Module } from './s3/s3.module';
import { ProfileModule } from './profile/profile.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CommentsModule } from './comments/comments.module';
import { TerminusModule } from '@nestjs/terminus';
import { Comment } from './entities/comments.entity';
import { Contact } from './entities/contact.entity';
import { Image } from './entities/image.entity';
import { Profile } from './entities/profile.entity';
import { Recommendation } from './entities/recommendation.entity';
import { User } from './entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    TerminusModule.forRoot({
      gracefulShutdownTimeoutMs: 1000,
    }),

    ConfigModule.forRoot({
      isGlobal: true,
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
        MAIL_PORT: Joi.number().integer().required(),

        YANDEX_ACCESS: Joi.string().required(),
        YANDEX_SECRET: Joi.string().required(),
        YANDEX_BUCKET: Joi.string().required(),
        YANDEX_ENDPOINT: Joi.string().required(),
        YANDEX_REGION: Joi.string().required(),

        CLIENT_URL: Joi.string().required(),
      }),
    }),
    EventEmitterModule.forRoot({ global: true }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          ttl: 0,
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
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [Comment, Contact, Image, Profile, Recommendation, User],
        synchronize: true,
        dataSourceFactory: async (options: DataSourceOptions) => {
          const dataSource = await new DataSource(options).initialize();
          return dataSource;
        },
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    MailModule,
    AuthModule,
    UsersModule,
    S3Module,
    ProfileModule,
    RecommendationsModule,
    FavoritesModule,
    CommentsModule,
  ],
})
export class AppModule {}
