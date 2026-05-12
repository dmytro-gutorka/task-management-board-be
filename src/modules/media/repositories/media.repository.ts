import type { DataSource, EntityManager, Repository } from 'typeorm';
import { MediaEntity } from '../entities/media.entity.js';

export class MediaRepository {
  private readonly mediaRepository: Repository<MediaEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.mediaRepository = this.dataSource.getRepository(MediaEntity);
  }

  async create(media: Omit<MediaEntity, 'id' | 'createdAt'>, manager?: EntityManager) {
    const repository = this.getRepository(manager);
    return repository.save(media);
  }

  async delete(ids: number[], manager?: EntityManager): Promise<void> {
    if (ids.length === 0) return;

    const repository = this.getRepository(manager);
    await repository.delete(ids);
  }

  private getRepository(manager?: EntityManager) {
    return manager ? manager.getRepository(MediaEntity) : this.mediaRepository;
  }
}
