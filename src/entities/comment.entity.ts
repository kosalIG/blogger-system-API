import { Status } from 'src/interface.global';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comment')
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  comment: string;

  @Column('enum', { enum: Status, default: Status.ACTIVE })
  status?: Status;

  @Column({ default: new Date() })
  createAt?: Date;
}
