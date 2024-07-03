import { MessageResponse } from '@app/shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recommendation } from 'src/entities/recommendation.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Recommendation)
    private readonly recommendationsRepository: Repository<Recommendation>,
  ) {}

  async addToFavorites(id: string, userId: string) {
    const user = await this.usersService.findOneByIdOrFail(userId, [
      'favorites',
    ]);
    const recommendation = await this.recommendationsRepository.findOne({
      where: { id },
    });
    user.favorites.push(recommendation);
    await this.recommendationsRepository.increment(
      { id: recommendation.id },
      'favoritesCount',
      1,
    );
    this.logger.verbose(
      `User ${user.email} added ${recommendation.title} to favorites`,
    );
    await this.usersService.update(user);
    return new MessageResponse(
      `Рекомендация ${recommendation.title} добавлена в избранные`,
    );
  }

  async removeFromFavorites(id: string, userId: string) {
    const recommendation = await this.recommendationsRepository.findOne({
      where: { id },
    });
    const user = await this.usersService.findOneByIdOrFail(userId, [
      'favorites',
    ]);
    user.favorites = user.favorites.filter(
      ({ id }) => id !== recommendation.id,
    );
    await this.recommendationsRepository.decrement({ id }, 'favoritesCount', 1);
    this.logger.verbose(
      `User ${user.email} deleted ${recommendation.title} from favorites`,
    );
    await this.usersService.update(user);
    return new MessageResponse(
      `Рекомендация ${recommendation.title} удалена из избранного`,
    );
  }
}
