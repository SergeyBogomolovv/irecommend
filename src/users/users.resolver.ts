import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { User } from '@app/shared/entities/user.entity';
import { GqlRelations } from '@app/shared/decorators/gql-relations.decorator';
import { PublicUserResponse } from '@app/shared/dto/public-user.response';

@UseInterceptors(ClassSerializerInterceptor)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => PublicUserResponse, { name: 'one_user' })
  getSelf(
    @Args('id') id: string,
    @GqlRelations('one_user') relations: string[],
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
