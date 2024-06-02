import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResolver } from './favorites.resolver';
import { SharedModule } from '@app/shared';
import { RecommendationsModule } from 'src/recommendations/recommendations.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, RecommendationsModule, SharedModule],
  providers: [FavoritesResolver, FavoritesService],
})
export class FavoritesModule {}
