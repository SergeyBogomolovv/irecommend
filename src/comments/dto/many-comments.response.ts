import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/entities/comments.entity';

@ObjectType()
export class ManyCommentsResponse {
  constructor(payload: ManyCommentsResponse) {
    Object.assign(this, payload);
  }

  @Field(() => [Comment])
  comments: Comment[];

  @Field(() => Int)
  totalCount: number;
}
