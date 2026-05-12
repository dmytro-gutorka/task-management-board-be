import type { DataSource } from 'typeorm';
import type { Nullable } from '@types';
import { MediaStorageFolderPreset } from '../../../infrastructure/media-storage/types.js';
import type { UploadUserAvatarDto } from '../../user/types.js';
import type { UserAvatarRepository } from '../repositories/user-avatar.repository.js';
import type { MediaService } from './media.service.js';

import { MediaType } from '../../../shared/enums/media.enums.js';

export class UserAvatarService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly mediaService: MediaService,
    private readonly userAvatarRepository: UserAvatarRepository,
  ) {}

  async uploadUserAvatar(userId: number, avatar: UploadUserAvatarDto): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const media = await this.mediaService.upload({
        buffer: avatar.buffer,
        fileName: avatar.originalName,
        mimeType: avatar.mimeType,
        size: avatar.size,
        mediaType: MediaType.IMAGE,
        resourceType: MediaType.IMAGE,
        folderPreset: {
          preset: MediaStorageFolderPreset.USER_AVATAR,
          userId,
        },
        manager,
      });

      await this.userAvatarRepository.create(userId, media.id, manager);
    });
  }

  async getCurrentAvatarUrl(userId: number): Promise<Nullable<string>> {
    const currentAvatar = await this.userAvatarRepository.findCurrentByUserId(userId);

    return currentAvatar?.media.publicUrl ?? null;
  }

  async deleteAllByUserId(userId: number): Promise<void> {
    const avatars = await this.userAvatarRepository.findAllByUserId(userId);
    const avatarMedia = avatars.map((avatar) => avatar.media);

    await this.mediaService.deleteMany(avatarMedia);
  }
}
