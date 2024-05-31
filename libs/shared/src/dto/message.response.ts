import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class MessageResponse {
  constructor(message: string) {
    this.message = message;
  }

  @ApiProperty({ title: 'Сообщение с информацией' })
  @Field()
  readonly message: string;
}
