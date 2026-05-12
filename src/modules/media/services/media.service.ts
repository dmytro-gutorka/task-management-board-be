import type { EntityManager } from 'typeorm';
import type { CreateUploadedMediaInput, UploadMediaFileInput } from '../types.js';
import type { MediaEntity } from '../entities/media.entity.js';
import type { MediaRepository } from '../repositories/media.repository.js';

import type { MediaStorageService } from '../../../infrastructure/media-storage/index.js';

export class MediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly mediaStorageService: MediaStorageService,
  ) {}

  async upload(input: UploadMediaFileInput): Promise<MediaEntity> {
    const uploadedMedia = await this.mediaStorageService.upload({
      buffer: input.buffer,
      fileName: input.fileName,
      mimeType: input.mimeType,
      folderPreset: input.folderPreset,
      resourceType: input.resourceType,
    });

    return this.create(
      {
        mediaType: input.mediaType,
        publicUrl: uploadedMedia.publicUrl,
        storageProvider: uploadedMedia.storageProvider,
        storagePublicId: uploadedMedia.storagePublicId,
        mimeType: input.mimeType,
        originalName: input.fileName,
        sizeBytes: input.size,
      },
      input.manager,
    );
  }

  async create(input: CreateUploadedMediaInput, manager?: EntityManager): Promise<MediaEntity> {
    return this.mediaRepository.create(input, manager);
  }

  async deleteMany(media: MediaEntity[], manager?: EntityManager): Promise<void> {
    if (media.length === 0) return;

    for (const mediaItem of media) {
      await this.mediaStorageService.delete(mediaItem.storagePublicId);
      await this.mediaRepository.delete([mediaItem.id], manager);
    }
  }
}
