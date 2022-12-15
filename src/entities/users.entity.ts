import { Gender, Status } from 'src/interface.global';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  avatar?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('enum', { enum: Gender })
  gender: Gender;

  @Column()
  dob: Date;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column('enum', { enum: Status, default: Status.ACTIVE })
  status?: Status;

  @Column({ default: new Date() })
  createAt?: Date;
}
