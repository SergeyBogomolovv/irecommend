import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsResolver } from './recommendations.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recommendation } from '@app/shared/entities/recommendation.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recommendation]), UsersModule],
  providers: [RecommendationsResolver, RecommendationsService],
})
export class RecommendationsModule {}
