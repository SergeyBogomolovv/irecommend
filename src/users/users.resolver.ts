import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { User } from '@app/shared/entities/user.entity';
import { UserFromGql } from '@app/shared/decorators/user-gql.decorator';
import { GqlAuthGuard } from '@app/shared/guards/gql-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GqlRelations } from '@app/shared/decorators/gql-relations.decorator';
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { name: 'profile' })
  getSelfProfile(
    @UserFromGql('id') id: string,
    @GqlRelations('profile') relations: string[],
  ) {
    return this.usersService.getFullUserInfo(id, relations);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User, { name: 'update_profile' })
  getUsersProfile(
    @UserFromGql('id') id: string,
    @Args('payload') payload: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(id, payload);
  }
}
