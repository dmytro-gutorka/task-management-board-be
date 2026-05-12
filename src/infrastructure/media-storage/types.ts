export type MediaStorageResourceType = 'image' | 'video' | 'raw' | 'auto';

export interface UploadMediaInput {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  folder?: string;
  resourceType?: MediaStorageResourceType;
}

export interface UploadMediaResult {
  publicUrl: string;
  storagePublicId: string;
  storageProvider: string;
}

export interface MediaStorageService {
  upload(input: UploadMediaInput): Promise<UploadMediaResult>;
  delete(storagePublicId: string): Promise<void>;
}
