import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { MediaStorageProvider, type MediaType } from '../../../shared/enums/media.enums.js';

@Entity('media')
export class MediaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'media_type', type: 'varchar', length: 30 })
  mediaType: MediaType;

  @Column({ name: 'public_url', type: 'text' })
  publicUrl: string;

  @Column({ name: 'storage_provider', type: 'varchar', length: 50 })
  storageProvider: MediaStorageProvider;

  @Column({ name: 'storage_public_id', type: 'varchar', length: 255 })
  storagePublicId: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ name: 'original_name', type: 'varchar', length: 255 })
  originalName: string;

  @Column({ name: 'size_bytes', type: 'integer' })
  sizeBytes: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
