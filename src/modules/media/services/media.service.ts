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

    const mediaInput = {
      mediaType: input.mediaType,
      publicUrl: uploadedMedia.publicUrl,
      storageProvider: uploadedMedia.storageProvider,
      storagePublicId: uploadedMedia.storagePublicId,
      mimeType: input.mimeType,
      originalName: input.fileName,
      sizeBytes: input.size,
    };

    try {
      return await this.create(mediaInput, input.manager);
    } catch (error) {
      try {
        await this.mediaStorageService.delete(uploadedMedia.storagePublicId);
      } catch {
        // Intentionally ignore cleanup errors here.
        // The original DB error below is more important for the caller.
        // Failed storage cleanup can be retried manually/logged later when a logger is available.
      }
      throw error;
    }
  }

  async create(input: CreateUploadedMediaInput, manager?: EntityManager): Promise<MediaEntity> {
    return this.mediaRepository.create(input, manager);
  }

  async deleteOne(media: MediaEntity, manager?: EntityManager): Promise<void> {
    await this.mediaStorageService.delete(media.storagePublicId);
    await this.mediaRepository.delete([media.id], manager);
  }

  async tryDeleteOne(media: MediaEntity, manager?: EntityManager): Promise<void> {
    try {
      await this.deleteOne(media, manager);
    } catch {
      // Intentionally ignore media cleanup errors.
      // The caller uses this method for best-effort cleanup.
    }
  }
}
