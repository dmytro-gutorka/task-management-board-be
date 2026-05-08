import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import type { Nullable } from '@types';
import { UserPreferencesEntity } from '../../user-preferences/entities/user-preferences.entity.js';

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

  @Column({ name: 'avatar_url', type: 'varchar', length: 255, nullable: true })
  avatarUrl: Nullable<string>;

  @Column({
    name: 'last_login_at',
    type: 'timestamptz',
    nullable: true,
  })
  lastLoginAt: Nullable<Date>;

  @OneToOne(() => UserPreferencesEntity, (preferences) => preferences.user)
  preferences: Relation<UserPreferencesEntity>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
