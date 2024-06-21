import { InputType, Field } from '@nestjs/graphql';
import { Profile } from 'src/entities/profile.entity';

@InputType()
export class UpdateProfileDto implements Partial<Profile> {
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  about?: string;
}
