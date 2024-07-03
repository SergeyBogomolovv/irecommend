import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResolver } from './favorites.resolver';
import { SharedModule } from '@app/shared';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recommendation } from 'src/entities/recommendation.entity';

@Module({
  imports: [
    UsersModule,
    SharedModule,
    TypeOrmModule.forFeature([Recommendation]),
  ],
  providers: [FavoritesResolver, FavoritesService],
})
export class FavoritesModule {}
