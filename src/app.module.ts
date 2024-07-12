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
import AppDataSource from './data-source';
import { User } from './entities/user.entity';
import { Comment } from './entities/comments.entity';
import { Contact } from './entities/contact.entity';
import { Image } from './entities/image.entity';
import { Profile } from './entities/profile.entity';
import { Recommendation } from './entities/recommendation.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TerminusModule.forRoot({
      gracefulShutdownTimeoutMs: 1000,
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),

        PORT: Joi.string().required(),

        POSTGRES_URL: Joi.string().required(),

        REDIS_URL: Joi.string().required(),

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
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    EventEmitterModule.forRoot({ global: true }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          ttl: 0,
          url: config.get('REDIS_URL'),
        });
        return { store };
      },
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      entities: [User, Comment, Contact, Image, Profile, Recommendation],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      introspection: false,
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
