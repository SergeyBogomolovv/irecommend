import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { GqlRelations } from 'src/common';

@UseInterceptors(ClassSerializerInterceptor)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, { name: 'one_user' })
  getOneUser(
    @Args('id') id: string,
    @GqlRelations('one_user') relations: string[],
  ) {
    return this.usersService.findOneByIdOrFail(id, relations);
  }

  @Query(() => [User], { name: 'search_users_by_name' })
  findManyByName(
    @Args('name') name: string,
    @Args('page', { type: () => Int, nullable: true }) page: number,
    @Args('limit', { type: () => Int, nullable: true }) limit: number,
    @GqlRelations('search_users') relations: string[],
  ) {
    return this.usersService.searchUsers(name, relations);
  }
}
