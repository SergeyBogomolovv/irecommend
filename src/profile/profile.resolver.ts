import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { GqlAuthGuard } from '@app/shared/guards/gql-auth.guard';
import { SerializeOptions, UseGuards } from '@nestjs/common';
import { User } from '@app/shared/entities/user.entity';
import { UserFromGql } from '@app/shared/decorators/user-gql.decorator';
import { GqlRelations } from '@app/shared/decorators/gql-relations.decorator';
import { UpdateProfileDto } from './dto/update-profile.input';
import { AddContactDto } from './dto/add-contact.input';
import { MessageResponse } from '@app/shared/dto/message.response';

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @SerializeOptions({
    groups: ['private'],
  })
  @UseGuards(GqlAuthGuard)
  @Query(() => User, { name: 'profile' })
  getSelf(
    @UserFromGql('id') id: string,
    @GqlRelations('profile') relations: string[],
  ) {
    return this.profileService.getProfileInfo(id, relations);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User, { name: 'update_profile' })
  updateProfile(
    @UserFromGql('id') id: string,
    @Args('payload') payload: UpdateProfileDto,
    @GqlRelations('update_profile') relations: string[],
  ) {
    return this.profileService.updateProfile(id, payload, relations);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageResponse, { name: 'add_contact' })
  addContatToProfile(
    @UserFromGql('id') id: string,
    @Args('payload') payload: AddContactDto,
  ) {
    return this.profileService.addContact(id, payload);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageResponse, { name: 'remove_contact' })
  removeContatFromProfile(@Args('contactId') id: string) {
    return this.profileService.removeContact(id);
  }
}
