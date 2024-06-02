import {
  Recommendation,
  RecommendationType,
} from '@app/shared/entities/recommendation.entity';
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecommendationInput } from './dto/create-recommendation.input';
import { UsersService } from 'src/users/users.service';
import { FileUpload } from 'graphql-upload-ts';
import { S3Service } from 'src/s3/s3.service';
import { Image } from '@app/shared/entities/image.entity';
import { MessageResponse } from '@app/shared/dto/message.response';
import { UpdateRecommendationInput } from './dto/update-recommendation.input';
import { FuseResult } from 'fuse.js';
const Fuse = require('fuse.js');

@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);
  constructor(
    @InjectRepository(Recommendation)
    private readonly recommendationRepository: Repository<Recommendation>,
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
    private readonly usersService: UsersService,
    private readonly cloud: S3Service,
  ) {}

  async findOneByIdOrFail(id: string, relations?: string[]) {
    const recommendation = await this.recommendationRepository.findOne({
      where: { id },
      relations,
    });
    if (!recommendation)
      throw new NotFoundException('Recommendation not found');
    this.logger.verbose(`Recommendation ${recommendation.title} found by id`);
    return recommendation;
  }

  async findByType(type: RecommendationType, relations?: string[]) {
    const recommendations = await this.recommendationRepository.find({
      where: { type },
      relations,
    });
    this.logger.verbose(`Getting many recommendations with type ${type}`);
    return recommendations;
  }

  async create(
    authorId: string,
    payload: CreateRecommendationInput,
    files: Array<Promise<FileUpload>>,
  ) {
    const author = await this.usersService.findOneByIdOrFail(authorId);
    const recommendation = this.recommendationRepository.create({
      ...payload,
      author,
      images: [],
    });
    files.forEach(async (file) => {
      const { createReadStream } = await file;
      const url = this.cloud.upload({
        path: 'images',
        file: createReadStream(),
      });
      const image = new Image();
      image.recommendation = recommendation;
      image.url = url;
      await this.imagesRepository.save(image);
      recommendation.images.push(image);
    });
    await this.recommendationRepository.save(recommendation);
    this.logger.verbose(
      `Recommendation ${recommendation.title} created by ${author.email}`,
    );
    return new MessageResponse('Рекомендация создана');
  }

  async updateText(
    id: string,
    authorId: string,
    dto: UpdateRecommendationInput,
  ) {
    const recommendation = await this.findOneByIdOrFail(id, ['author']);
    if (recommendation.author.id !== authorId)
      throw new ForbiddenException(
        'У вас нет доступа чтобы изменять чужие рекомендации',
      );
    await this.recommendationRepository.save({
      ...recommendation,
      ...dto,
    });
    this.logger.verbose(
      `Recommendation ${recommendation.title} updated by ${recommendation.author.email}`,
    );
    return new MessageResponse('Рекомендация успешно обновлена');
  }

  async addImages(
    id: string,
    authorId: string,
    files: Array<Promise<FileUpload>>,
  ) {
    const recommendation = await this.findOneByIdOrFail(id, [
      'images',
      'author',
    ]);
    if (recommendation.author.id !== authorId)
      throw new ForbiddenException(
        'У вас нет доступа чтобы изменять чужие рекомендации',
      );
    files.forEach(async (file) => {
      const { createReadStream } = await file;
      const url = this.cloud.upload({
        path: 'images',
        file: createReadStream(),
      });
      const image = this.imagesRepository.create({ url, recommendation });
      recommendation.images.push(await this.imagesRepository.save(image));
    });
    this.logger.verbose(
      `Added images to recommendation ${recommendation.title}`,
    );
    await this.recommendationRepository.save(recommendation);
    return new MessageResponse('Рекомендация изменена');
  }

  async deleteImage(imageId: string, authorId: string) {
    const image = await this.imagesRepository.findOne({
      where: { id: imageId },
      relations: ['recommendation.author'],
    });
    if (authorId !== image.recommendation.author.id)
      throw new ForbiddenException(
        'У вас нет доступа чтобы изменять чужие рекомендации',
      );
    this.cloud.delete(image.url);
    this.logger.verbose(
      `Deleted image from recommendation ${image.recommendation.title}`,
    );
    await this.imagesRepository.delete(image.id);
    return new MessageResponse('Изображение удалено');
  }

  async searchRecommendations(query: string, relations: string[]) {
    const list = await this.recommendationRepository.find({
      relations,
    });

    const fuseOptions = {
      isCaseSensitive: false,
      includeMatches: true,
      findAllMatches: true,
      threshold: 0.4,
      keys: ['title', 'description'],
    };

    const fuse = new Fuse(list, fuseOptions);
    this.logger.verbose(`Searching for recommendations by ${query}`);
    return fuse
      .search(query)
      .map((result: FuseResult<Recommendation>) => result.item);
  }

  async update(recommendation: Partial<Recommendation>) {
    this.logger.verbose(
      `Updating recommendation with`,
      JSON.stringify(recommendation),
    );
    return await this.recommendationRepository.save(recommendation);
  }

  async deleteRecommendation(id: string, authorId: string) {
    const recommendation = await this.findOneByIdOrFail(id, [
      'author',
      'images',
    ]);
    if (recommendation.author.id !== authorId)
      throw new ForbiddenException(
        'У вас нет права удалять чужие рекомендации',
      );
    recommendation.images.forEach((image) => {
      this.cloud.delete(image.url);
    });
    this.logger.verbose(
      `${recommendation.author.email} deleted recommendation ${recommendation.title}`,
    );
    await this.recommendationRepository.remove(recommendation);
    return new MessageResponse('Рекомендация удалена');
  }
}
