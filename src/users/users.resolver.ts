import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@app/shared/entities/user.entity';
import { UserFromGql } from '@app/shared/decorators/user-gql.decorator';
import { GqlAuthGuard } from '@app/shared/guards/gql-auth.guard';
import { GqlRelations } from '@app/shared/decorators/gql-relations.decorator';
import { PublicUserResponse } from '@app/shared/dto/public-user.response';

@UseInterceptors(ClassSerializerInterceptor)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => PublicUserResponse, { name: 'self_info' })
  getSelf(
    @UserFromGql('id') id: string,
    @GqlRelations('self_info') relations: string[],
  ) {
    return this.usersService.findOne(id, relations);
  }

  @Query(() => [PublicUserResponse], { name: 'search_users' })
  findManyByName(
    @Args('name') name: string,
    @GqlRelations('search_users') relations: string[],
  ) {
    return this.usersService.searchUsers(name, relations);
  }
}
