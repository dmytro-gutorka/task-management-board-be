import type { MediaStorageProvider } from '../../shared/enums/media.enums.js';

export type MediaStorageResourceType = 'image' | 'video' | 'raw' | 'auto';

export enum MediaStorageFolderPreset {
  USER_AVATAR = 'user_avatar',
}

export type MediaStorageFolderPresetConfig = {
  preset: MediaStorageFolderPreset.USER_AVATAR;
  userId: number;
};

export interface UploadMediaInput {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  folder?: string;
  folderPreset?: MediaStorageFolderPresetConfig;
  resourceType?: MediaStorageResourceType;
}

export interface UploadMediaResult {
  publicUrl: string;
  storagePublicId: string;
  storageProvider: MediaStorageProvider;
}

export interface MediaStorageService {
  upload(input: UploadMediaInput): Promise<UploadMediaResult>;
  delete(storagePublicId: string): Promise<void>;
}
