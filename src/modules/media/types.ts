import type { EntityManager } from 'typeorm';
import type {
  MediaStorageFolderPresetConfig,
  MediaStorageResourceType,
} from '../../infrastructure/media-storage/types.js';
import type { MediaEntity } from './entities/media.entity.js';

import type { MediaType } from '../../shared/enums/media.enums.js';
import { AVATAR_ALLOWED_MIME_TYPES } from '../user/user.constants.js';

export interface UploadMediaFileInput {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  size: number;
  mediaType: MediaType;
  resourceType?: MediaStorageResourceType;
  folderPreset?: MediaStorageFolderPresetConfig;
  manager?: EntityManager;
}

export interface CreateUploadedMediaInput {
  mediaType: MediaType;
  publicUrl: string;
  storageProvider: MediaEntity['storageProvider'];
  storagePublicId: string;
  mimeType: string;
  originalName: string;
  sizeBytes: number;
}

export interface CreateUserAvatarInput {
  userId: number;
  mediaId: number;
}

export interface UploadUserAvatarInput {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
}

export type AvatarAllowerMimeTypes = (typeof AVATAR_ALLOWED_MIME_TYPES)[number];
