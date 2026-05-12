import type { DataSource, EntityManager, Repository } from 'typeorm';
import { MediaEntity } from '../entities/media.entity.js';
import { UserAvatarEntity } from '../entities/user-avatar.entity.js';

import { type Nullable, SortOrder } from '../../../shared/types/index.js';
import { UserEntity } from '../../user/index.js';

export class UserAvatarRepository {
  private readonly userAvatarRepository: Repository<UserAvatarEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.userAvatarRepository = this.dataSource.getRepository(UserAvatarEntity);
  }

  async create(
    userId: UserEntity['id'],
    mediaId: MediaEntity['id'],
    manager?: EntityManager,
  ): Promise<UserAvatarEntity> {
    const repository = this.getRepository(manager);

    return repository.save({
      user: { id: userId },
      media: { id: mediaId },
    });
  }

  async findCurrentByUserId(userId: UserEntity['id']): Promise<Nullable<UserAvatarEntity>> {
    return this.userAvatarRepository.findOne({
      where: { user: { id: userId } },
      relations: { media: true },
      order: { createdAt: SortOrder.DESC, id: SortOrder.DESC },
    });
  }

  async findAllByUserId(userId: UserEntity['id']): Promise<UserAvatarEntity[]> {
    return this.userAvatarRepository.find({
      where: { user: { id: userId } },
      relations: { media: true },
      order: { createdAt: SortOrder.DESC, id: SortOrder.DESC },
    });
  }

  private getRepository(manager?: EntityManager) {
    return manager ? manager.getRepository(UserAvatarEntity) : this.userAvatarRepository;
  }
}
