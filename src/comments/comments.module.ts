import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { UsersModule } from 'src/users/users.module';
import { RecommendationsModule } from 'src/recommendations/recommendations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comments.entity';

@Module({
  imports: [
    UsersModule,
    RecommendationsModule,
    TypeOrmModule.forFeature([Comment]),
  ],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
