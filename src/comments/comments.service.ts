import { Comment, MessageResponse } from '@app/shared';
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecommendationsService } from 'src/recommendations/recommendations.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly recommendationsService: RecommendationsService,
  ) {}

  async findOneByIdOrFail(id: string, relations?: string[]) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations,
    });
    if (!comment) throw new NotFoundException('Comment not found');
    this.logger.verbose(`Found comment ${comment.content} by id`);
    return comment;
  }

  async create(recommendationId: string, content: string, authorId: string) {
    const author = await this.usersService.findOneByIdOrFail(authorId);
    const recommendation = await this.recommendationsService.findOneByIdOrFail(
      recommendationId,
      ['comments'],
    );
    const comment = this.commentsRepository.create({
      author,
      recommendation,
      recommendationId: recommendation.id,
      content,
    });
    recommendation.comments.push(comment);
    await this.recommendationsService.update(recommendation);
    await this.commentsRepository.save(comment);
    this.logger.verbose(
      `User ${comment.author.email} added comment to ${recommendation.title}`,
    );
    return new MessageResponse('Комментарий добавлен');
  }

  async edit(id: string, content: string, authorId: string) {
    const comment = await this.findOneByIdOrFail(id, ['author']);
    if (comment.author.id !== authorId)
      throw new ForbiddenException(
        'Вы не можете редактировать чужой комментарий',
      );
    comment.content = content;
    await this.commentsRepository.save(comment);
    this.logger.verbose(
      `User ${comment.author.email} updated comment ${comment.content}`,
    );
    return new MessageResponse('Комментарий успешно изменен');
  }

  async delete(id: string, authorId: string) {
    const comment = await this.findOneByIdOrFail(id, ['author']);
    if (comment.author.id !== authorId)
      throw new ForbiddenException('Вы не можете удалить чужой комментарий');
    await this.commentsRepository.remove(comment);
    this.logger.verbose(
      `${comment.author.email} deleted comment ${comment.content}`,
    );
    return new MessageResponse('Комментарий успешно удален');
  }
}
