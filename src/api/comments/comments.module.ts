import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments, Posts, Users } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Comments, Posts, Users])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
