import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsResolver } from './recommendations.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recommendation } from '@app/shared/entities/recommendation.entity';
import { UsersModule } from 'src/users/users.module';
import { S3Module } from 'src/s3/s3.module';
import { SharedModule } from '@app/shared';
import { Image } from '@app/shared/entities/image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recommendation, Image]),
    UsersModule,
    S3Module,
    SharedModule,
  ],
  providers: [RecommendationsResolver, RecommendationsService],
})
export class RecommendationsModule {}
