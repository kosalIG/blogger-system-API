import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments, Posts, Users } from 'src/entities';
import { Status } from 'src/interface.global';
import { Not, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentRepo: Repository<Comments>,

    @InjectRepository(Posts)
    private readonly postRepo: Repository<Posts>,

    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
  ) {}

  async findPostById(id: number) {
    const data = await this.postRepo.findOne({
      where: { id, status: Not(Status.DELETE) },
    });

    if (data) {
      return { data };
    } else {
      throw new HttpException(
        { message: 'Post not found' },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findUserById(id: number) {
    const data = await this.userRepo.findOne({
      where: { id, status: Not(Status.DELETE) },
    });

    if (data) {
      return { data };
    } else {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(createCommentDto: CreateCommentDto) {
    const postById = this.findPostById(createCommentDto.postId);
    const userById = this.findUserById(createCommentDto.userId);

    await Promise.all([postById, userById]);

    return this.commentRepo.save(createCommentDto);
  }

  async findAll() {
    const results = await this.commentRepo
      .createQueryBuilder('comment')
      .select('comment')
      .leftJoinAndMapOne('comment.user', 'users', 'u', 'u.id = comment.userId')
      .leftJoinAndMapOne('comment.post', 'post', 'p', 'p.id = comment.postId')
      .where('comment.status IN (:...status)', {
        status: [Status.ACTIVE, Status.INACTIVE],
      })
      .andWhere('u.status IN (:...status)', {
        status: [Status.ACTIVE, Status.INACTIVE],
      })
      .andWhere('p.status IN (:...status)', {
        status: [Status.ACTIVE, Status.INACTIVE],
      })
      .orderBy('comment.createAt', 'DESC')
      .getMany();

    return { results };
  }

  async findOne(id: number) {
    const data = await this.commentRepo
      .createQueryBuilder('comment')
      .select('comment')
      .leftJoinAndMapOne('comment.user', 'users', 'u', 'u.id = comment.userId')
      .leftJoinAndMapOne('comment.post', 'post', 'p', 'p.id = comment.postId')
      .where('comment.id = :id AND comment.status IN (:...status)', {
        id,
        status: [Status.ACTIVE, Status.INACTIVE],
      })
      .andWhere('u.status IN (:...status)', {
        status: [Status.ACTIVE, Status.INACTIVE],
      })
      .andWhere('p.status IN (:...status)', {
        status: [Status.ACTIVE, Status.INACTIVE],
      })
      .getOne();

    if (data) {
      return { data };
    } else {
      throw new HttpException(
        { message: 'Comment not found' },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(updateCommentDto: UpdateCommentDto) {
    const postById = this.findPostById(updateCommentDto.postId);
    const userById = this.findUserById(updateCommentDto.userId);
    const cmtById = this.findOne(updateCommentDto.id);

    await Promise.all([postById, userById, cmtById]);

    const data = await this.commentRepo.save(updateCommentDto);

    return { data };
  }

  async remove(id: number) {
    await this.findOne(id);

    const { affected } = await this.commentRepo.update(id, {
      status: Status.DELETE,
    });

    if (affected) {
      return true;
    }
  }
}
