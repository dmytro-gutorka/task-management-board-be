import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { MediaEntity } from './media.entity.js';

import { UserEntity } from '../../user/index.js';

@Entity('user_avatars')
@Unique('UQ_user_avatars_user_id', ['userId'])
@Unique('UQ_user_avatars_media_id', ['mediaId'])
export class UserAvatarEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @OneToOne(() => MediaEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'media_id' })
  mediaId: number;

  @OneToOne(() => MediaEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'media_id' })
  media: MediaEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
