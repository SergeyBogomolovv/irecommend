import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { SerializeOptions, UseGuards } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.input';
import { AddContactDto } from './dto/add-contact.input';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import {
  GqlAuthGuard,
  GqlRelations,
  MessageResponse,
  UserFromGql,
} from '@app/shared';
import { User } from 'src/entities/user.entity';

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @SerializeOptions({
    groups: ['private'],
  })
  @UseGuards(GqlAuthGuard)
  @Query(() => User, { name: 'profile', nullable: true })
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
    @Args('payload', { type: () => UpdateProfileDto, nullable: true })
    payload: UpdateProfileDto,
    @Args('image', { type: () => GraphQLUpload, nullable: true })
    image: FileUpload,
    @GqlRelations('update_profile') relations: string[],
  ) {
    return this.profileService.updateProfile(id, payload, image, relations);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageResponse, { name: 'add_contact' })
  addContatToProfile(
    @UserFromGql('id') id: string,
    @Args('payload', { type: () => AddContactDto }) payload: AddContactDto,
  ) {
    return this.profileService.addContact(id, payload);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageResponse, { name: 'remove_contact' })
  removeContatFromProfile(@Args('contactId') id: string) {
    return this.profileService.removeContact(id);
  }
}
