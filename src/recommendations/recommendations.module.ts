import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsResolver } from './recommendations.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { S3Module } from 'src/s3/s3.module';
import { Image, SharedModule, Recommendation } from '@app/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recommendation, Image]),
    UsersModule,
    S3Module,
    SharedModule,
  ],
  providers: [RecommendationsResolver, RecommendationsService],
  exports: [RecommendationsService, TypeOrmModule.forFeature([Recommendation])],
})
export class RecommendationsModule {}
