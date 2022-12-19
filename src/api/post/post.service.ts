import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Posts } from 'src/entities';
import { Status } from 'src/interface.global';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts) private readonly postRepository: Repository<Posts>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    return await this.postRepository.save(createPostDto);
  }

  async findAll() {
    const results = await this.postRepository
      .createQueryBuilder('post')
      .select('post')
      .leftJoinAndMapOne('post.user', 'users', 'u', 'u.id = post.userId')
      .where('post.status IN (:...status)', {
        status: [Status.ACTIVE, Status.INACTIVE],
      })
      .orderBy('post.createAt', 'DESC')
      .getMany();

    return { results };
  }

  async findOne(id: number) {
    if (Number.isNaN(id)) {
      throw new BadRequestException({ message: 'id must be a number' });
    }

    const data = await this.postRepository
      .createQueryBuilder('post')
      .select('post')
      .leftJoinAndMapOne('post.user', 'users', 'u', 'u.id = post.userId')
      .where('post.id = :id AND post.status IN (:...status)', {
        id,
        status: [Status.ACTIVE, Status.INACTIVE],
      })
      .getOne();

    if (data) {
      return { data };
    } else {
      throw new HttpException(
        { message: 'Post not found' },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updatePost(post: UpdatePostDto) {
    await this.findOne(post.id);

    // if (post.userId) delete post.userId;

    const data = await this.postRepository.save(post);

    return { data };
  }

  async remove(id: number) {
    await this.findOne(id);

    const { affected } = await this.postRepository.update(id, {
      status: Status.DELETE,
    });

    if (affected) {
      return true;
    }
  }
}
