import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { UsersModule } from 'src/users/users.module';
import { RecommendationsModule } from 'src/recommendations/recommendations.module';
import { Comment, SharedModule } from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';

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
