import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, UserFromGql } from '@app/shared';
import { Comment } from 'src/entities/comments.entity';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment, { name: 'create_comment' })
  async createComment(
    @UserFromGql('id') authorId: string,
    @Args('content') content: string,
    @Args('recommendationId') recommendationId: string,
  ) {
    return this.commentsService.create(recommendationId, content, authorId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment, { name: 'edit_comment' })
  async editComment(
    @UserFromGql('id') authorId: string,
    @Args('content') content: string,
    @Args('id') commentId: string,
  ) {
    return this.commentsService.edit(commentId, content, authorId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment, { name: 'delete_comment' })
  async deleteComment(
    @UserFromGql('id') authorId: string,
    @Args('id') commentId: string,
  ) {
    return this.commentsService.delete(commentId, authorId);
  }
}
