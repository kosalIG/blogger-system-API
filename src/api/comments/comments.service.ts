import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments, Posts } from 'src/entities';
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
  ) {}

  async findPostById(id: number) {
    const data = await this.postRepo.findOne({
      where: { id, status: Not(Status.DELETE) },
    });

    if (data) {
      return { data };
    } else {
      throw new HttpException('Fuck you Bitch', HttpStatus.NOT_FOUND);
    }
  }

  async create(createCommentDto: CreateCommentDto) {
    await this.findPostById(createCommentDto.postId);

    return this.commentRepo.save(createCommentDto);
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
