import { MessageResponse } from '@app/shared';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { RecommendationsService } from 'src/recommendations/recommendations.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly recommendationsService: RecommendationsService,
  ) {}

  async addToFavorites(id: string, userId: string) {
    const user = await this.usersService.findOneByIdOrFail(userId, [
      'favorites',
    ]);
    const recommendation = await this.recommendationsService.findOneByIdOrFail(
      id,
      ['author'],
    );
    if (recommendation.author.id === user.id)
      throw new ForbiddenException(
        'Вы не можете добавлять в избранное свои рекомендации',
      );
    user.favorites.forEach(({ id }) => {
      if (id === recommendation.id)
        throw new ForbiddenException(
          'В избранное можно добавлять только 1 раз',
        );
    });

    user.favorites.push(recommendation);
    recommendation.favoritesCount++;
    this.logger.verbose(
      `User ${user.email} added ${recommendation.title} to favorites`,
    );

    await this.usersService.update(user);
    await this.recommendationsService.update(recommendation);

    return new MessageResponse(
      `Рекомендация ${recommendation.title} добавлена в избранные`,
    );
  }

  async removeFromFavorites(id: string, userId: string) {
    const recommendation =
      await this.recommendationsService.findOneByIdOrFail(id);
    const user = await this.usersService.findOneByIdOrFail(userId, [
      'favorites',
    ]);
    user.favorites = user.favorites.filter(
      ({ id }) => id !== recommendation.id,
    );
    recommendation.favoritesCount--;
    this.logger.verbose(
      `User ${user.email} deleted ${recommendation.title} from favorites`,
    );
    await this.usersService.update(user);
    await this.recommendationsService.update(recommendation);
    return new MessageResponse(
      `Рекомендация ${recommendation.title} удалена из избранного`,
    );
  }
}
