import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities';
import { Repository } from 'typeorm';
import { LoginBody, UserBody } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async findOneUser(email: string) {
    const result = await this.userRepo
      .createQueryBuilder('users')
      .select('users')
      .addSelect('users.password')
      .where('users.email =:email', { email })
      .getOne();

    if (!result) throw new NotFoundException('User not found');

    return result;
  }

  async login({ email, password }: LoginBody) {
    // Find user
    const {
      id,
      password: authPassword,
      ...newUser
    } = await this.findOneUser(email);

    if (!(await bcrypt.compare(password, authPassword)))
      throw new BadRequestException('incorrect password');

    // Generate auth user token
    const data = { id, email };

    const accessToken = await this.jwtService.signAsync(data, {
      noTimestamp: true,
    });

    return { data: { ...newUser, accessToken } };
  }

  async register(user: UserBody) {
    // Find user
    const result = await this.userRepo.findOne({
      where: { email: user.email },
    });

    if (result) throw new BadRequestException('Email already register');

    const hashPwd = await bcrypt.hash(user.password, 10);

    const userObj: UserBody = await this.userRepo.save({
      ...user,
      password: hashPwd,
    });

    delete userObj.password;

    return { data: { ...userObj } };
  }
}
