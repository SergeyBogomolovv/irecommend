import { MessageResponse } from 'src/common';
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comments.entity';
import { RecommendationsService } from 'src/recommendations/recommendations.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ManyCommentsResponse } from './dto/many-comments.response';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly recommendationsService: RecommendationsService,
  ) {}

  async getByRecommendationId(
    recommendationId: string,
    count?: number,
    relations?: string[],
  ) {
    const [comments, totalCount] = await this.commentsRepository.findAndCount({
      where: { recommendationId },
      take: count,
      relations,
      order: { created_at: 'DESC' },
    });
    return new ManyCommentsResponse({ comments, totalCount });
  }

  async findOneByIdOrFail(id: string, relations?: string[]) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations,
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async create(recommendationId: string, content: string, authorId: string) {
    const author = await this.usersService.findOneByIdOrFail(authorId);
    const recommendation =
      await this.recommendationsService.findOneByIdOrFail(recommendationId);
    const comment = this.commentsRepository.create({
      author,
      recommendation,
      recommendationId: recommendation.id,
      content,
    });
    this.logger.debug(
      `User ${comment.author.email} added comment to ${recommendation.title}`,
    );
    return await this.commentsRepository.save(comment);
  }

  async edit(id: string, content: string, authorId: string) {
    const comment = await this.findOneByIdOrFail(id, ['author']);
    if (comment.author.id !== authorId)
      throw new ForbiddenException(
        'Вы не можете редактировать чужой комментарий',
      );
    this.logger.debug(
      `User ${comment.author.email} updated comment ${comment.content}`,
    );
    await this.commentsRepository.save({ ...comment, content });
    return new MessageResponse('Комментарий изменен');
  }

  async delete(id: string, authorId: string) {
    const comment = await this.findOneByIdOrFail(id, ['author']);
    if (comment.author.id !== authorId)
      throw new ForbiddenException('Вы не можете удалить чужой комментарий');
    this.logger.debug(
      `${comment.author.email} deleted comment ${comment.content}`,
    );
    await this.commentsRepository.remove(comment);
    return new MessageResponse(`Комментарий удален`);
  }
}
