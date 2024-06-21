import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { GqlRelations } from '@app/shared/decorators/gql-relations.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, { name: 'one_user' })
  getOneUser(
    @Args('id') id: string,
    @GqlRelations('one_user') relations: string[],
  ) {
    return this.usersService.findOneByEmailOrFail(id, relations);
  }

  @Query(() => [User], { name: 'search_users' })
  findManyByName(
    @Args('name') name: string,
    @GqlRelations('search_users') relations: string[],
  ) {
    return this.usersService.searchUsers(name, relations);
  }
}
