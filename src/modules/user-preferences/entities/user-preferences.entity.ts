import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { AppLanguage, AppTheme } from '../user-preferences.types.js';

import { UserEntity } from '../../user/index.js';

@Entity('user_preferences')
export class UserPreferencesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, (user) => user.preferences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: Relation<UserEntity>;

  @Column({
    name: 'user_id',
    unique: true,
  })
  userId: number;

  @Column({
    type: 'varchar',
    default: AppLanguage.EN,
  })
  language: AppLanguage;

  @Column({
    type: 'varchar',
    default: AppTheme.SYSTEM,
  })
  theme: AppTheme;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;
}
