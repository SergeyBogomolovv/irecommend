import { Comment } from '@app/shared/entities/comments.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecommendationsService } from 'src/recommendations/recommendations.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly recommendationsService: RecommendationsService,
  ) {}
  async create() {}
  async edit() {}
  async delete() {}
}
