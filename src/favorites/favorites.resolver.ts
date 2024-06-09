import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FavoritesService } from './favorites.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, MessageResponse, UserFromGql } from '@app/shared';

@Resolver()
export class FavoritesResolver {
  constructor(private readonly favoritesService: FavoritesService) {}
  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageResponse, { name: 'add_to_favorites' })
  async addToFavorites(
    @UserFromGql('id') userId: string,
    @Args('id') id: string,
  ) {
    return this.favoritesService.addToFavorites(id, userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageResponse, { name: 'remove_from_favorites' })
  async removeFromFavorites(
    @UserFromGql('id') userId: string,
    @Args('id') id: string,
  ) {
    return this.favoritesService.removeFromFavorites(id, userId);
  }
}
