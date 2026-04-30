import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Nullable } from '@types';

@Entity('users', { orderBy: { id: 'ASC' } })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 50 })
  email: string; // Denormalized field from AuthEntity.email

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: Nullable<string>;

  @Column({ type: 'varchar', length: 50, nullable: true })
  surname: Nullable<string>;

  @Column({ nullable: true, type: 'date' })
  birthday: Nullable<Date>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
