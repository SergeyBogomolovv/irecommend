import { Resolver, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { User } from '@app/shared/entities/user.entity';
import { UserFromGql } from '@app/shared/decorators/user-gql.decorator';
import { GqlAuthGuard } from '@app/shared/guards/gql-auth.guard';
import { GqlRelations } from '@app/shared/decorators/gql-relations.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { name: 'self_info' })
  getSelf(
    @UserFromGql('id') id: string,
    @GqlRelations('self_info') relations: string[],
  ) {
    return this.usersService.findOne(id, relations);
  }
}
