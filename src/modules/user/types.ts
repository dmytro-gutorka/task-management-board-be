import type { DataSource } from 'typeorm';
import type { infer as ZodInfer } from 'zod';
import type { Nullable } from '@types';
import type { CreateUserSchema } from './schemas/create-user.schema.js';
import type { UpdateUserSchema } from './schemas/update-user.schema.js';
import type { UserAvatarService } from '../media/services/user-avatar.service.js';

import { AVATAR_ALLOWED_MIME_TYPES } from './user.constants.js';

export type CreateUserDto = ZodInfer<typeof CreateUserSchema>;

export type UpdateUserDto = ZodInfer<typeof UpdateUserSchema>;

export interface UserResponse {
  id: number;
  email: string;
  name: Nullable<string>;
  surname: Nullable<string>;
  birthday: Nullable<Date>;
  avatarUrl: Nullable<string>;
  lastLoginAt: Nullable<Date>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadUserAvatarDto {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface UserModuleComposerArgs {
  dataSource: DataSource;
  userAvatarService: UserAvatarService;
}

export type AvatarAllowerMimeTypes = (typeof AVATAR_ALLOWED_MIME_TYPES)[number];
