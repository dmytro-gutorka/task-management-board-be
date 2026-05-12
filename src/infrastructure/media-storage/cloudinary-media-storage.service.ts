import type { ConfigService } from '@infrastructure/config-service';
import type { MediaStorageService, UploadMediaInput, UploadMediaResult } from './types.js';

import { toError } from '../../shared/utils/toError.js';
import { type UploadApiResponse, v2 as cloudinary } from 'cloudinary';

export class CloudinaryMediaStorageService implements MediaStorageService {
  private readonly defaultFolder: string;

  constructor(configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.env.CLOUDINARY_CLOUD_NAME,
      api_key: configService.env.CLOUDINARY_API_KEY,
      api_secret: configService.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    this.defaultFolder = configService.env.CLOUDINARY_FOLDER;
  }

  private async uploadBuffer(input: UploadMediaInput): Promise<UploadApiResponse> {
    const uploadInfo = {
      folder: input.folder ?? this.defaultFolder,
      resource_type: input.resourceType ?? 'image',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(uploadInfo, (error, result) => {
        if (error) {
          reject(toError(error));
          return;
        }

        if (!result) {
          reject(new Error('Cloudinary upload failed'));
          return;
        }

        resolve(result);
      });

      uploadStream.end(input.buffer);
    });
  }

  async upload(input: UploadMediaInput): Promise<UploadMediaResult> {
    const uploadResult = await this.uploadBuffer(input);

    return {
      publicUrl: uploadResult.secure_url,
      storagePublicId: uploadResult.public_id,
      storageProvider: 'cloudinary',
    };
  }

  async delete(storagePublicId: string): Promise<void> {
    await cloudinary.uploader.destroy(storagePublicId, { resource_type: 'image' });
  }
}
