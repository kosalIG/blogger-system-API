import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UpdateUserDto } from './users.dto';
import { Users } from 'src/entities';
import { Status } from 'src/interface.global';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  // In([Status.ACTIVE, Status.INACTIVE])
  async getAllUser() {
    const results = await this.userRepository.find({
      where: { status: Not(Status.DELETE) },
      order: { createAt: 'DESC' },
    });

    return { results };
  }

  async getSingleUser(id: number) {
    if (Number.isNaN(id)) {
      throw new BadRequestException({ message: 'id must be a number' });
    }

    const data = await this.userRepository.findOne({
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

  async updateUser(user: UpdateUserDto) {
    const { id, ...newUser } = user;

    const singleUser = await this.getSingleUser(id);

    const { affected } = await this.userRepository.update(id, { ...newUser });

    if (affected) {
      return { data: { ...singleUser?.data, ...user } };
    }
  }

  async removeUser(id: number) {
    await this.getSingleUser(id);

    const { affected } = await this.userRepository.update(id, {
      status: Status.DELETE,
    });

    if (affected) {
      return true;
    }
  }
}
