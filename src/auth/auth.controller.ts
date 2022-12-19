import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginBody, UserBody } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() body: LoginBody) {
    return this.service.login(body);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  register(@Body() body: UserBody) {
    return this.service.register(body);
  }
}
