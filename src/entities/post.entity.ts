import { Status } from 'src/interface.global';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('post')
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column()
  tittle: string;

  @Column({ nullable: true })
  description?: string;

  @Column('enum', { enum: Status, default: Status.ACTIVE })
  status?: Status;

  @Column({ default: new Date() })
  createAt?: Date;
}
