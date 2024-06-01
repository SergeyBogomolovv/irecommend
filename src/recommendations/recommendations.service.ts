import { Recommendation } from '@app/shared/entities/recommendation.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecommendationInput } from './dto/create-recommendation.input';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);
  constructor(
    @InjectRepository(Recommendation)
    private readonly recommendationRepository: Repository<Recommendation>,
    private readonly usersService: UsersService,
  ) {}

  async create(authorId: string, payload: CreateRecommendationInput) {
    const author = await this.usersService.findOneByIdOrFail(authorId);
  }
}
