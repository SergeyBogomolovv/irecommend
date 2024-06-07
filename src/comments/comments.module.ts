import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { UsersModule } from 'src/users/users.module';
import { RecommendationsModule } from 'src/recommendations/recommendations.module';
import { SharedModule } from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@app/shared/entities/comments.entity';

@Module({
  imports: [
    UsersModule,
    RecommendationsModule,
    SharedModule,
    TypeOrmModule.forFeature([Comment]),
  ],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}