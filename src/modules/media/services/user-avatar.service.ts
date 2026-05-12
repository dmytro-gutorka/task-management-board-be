import type { Nullable } from '@types';
import { MediaStorageFolderPreset } from '../../../infrastructure/media-storage/types.js';
import type { UploadUserAvatarInput } from '../../user/types.js';
import type { MediaEntity } from '../entities/media.entity.js';
import type { UserAvatarRepository } from '../repositories/user-avatar.repository.js';
import type { MediaService } from './media.service.js';

import { MediaType } from '../../../shared/enums/media.enums.js';

export class UserAvatarService {
  constructor(
    private readonly userAvatarRepository: UserAvatarRepository,
    private readonly mediaService: MediaService,
  ) {}

  async uploadUserAvatar(userId: number, avatar: UploadUserAvatarInput): Promise<MediaEntity> {
    const currentAvatar = await this.userAvatarRepository.findByUserId(userId);

    const newMedia = await this.mediaService.upload({
      buffer: avatar.buffer,
      fileName: avatar.originalName,
      mimeType: avatar.mimeType,
      size: avatar.size,
      mediaType: MediaType.IMAGE,
      folderPreset: {
        preset: MediaStorageFolderPreset.USER_AVATAR,
        userId,
      },
      resourceType: MediaType.IMAGE,
    });

    try {
      if (currentAvatar) {
        await this.userAvatarRepository.updateMediaByUserId(userId, newMedia.id);
      } else {
        await this.userAvatarRepository.create({
          userId,
          mediaId: newMedia.id,
        });
      }
    } catch (error) {
      await this.mediaService.deleteOne(newMedia);
      throw error;
    }

    if (currentAvatar?.media) {
      await this.mediaService.deleteOne(currentAvatar.media);
    }

    return newMedia;
  }

  async getCurrentAvatarUrl(userId: number): Promise<Nullable<string>> {
    const userAvatar = await this.userAvatarRepository.findByUserId(userId);

    return userAvatar?.media.publicUrl ?? null;
  }

  async deleteAllByUserId(userId: number): Promise<void> {
    const userAvatar = await this.userAvatarRepository.findByUserId(userId);

    if (!userAvatar?.media) return;

    try {
      await this.mediaService.deleteOne(userAvatar.media);
    } catch {
      /* empty */
    }
  }
}
