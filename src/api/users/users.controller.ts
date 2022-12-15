import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateUserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUser();
  }

  @Get(':id')
  getSingleUser(@Param('id') id: string) {
    return this.userService.getSingleUser(+id);
  }

  @Put()
  @UsePipes(ValidationPipe)
  updateUser(@Body() user: UpdateUserDto) {
    return this.userService.updateUser(user);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }
}
