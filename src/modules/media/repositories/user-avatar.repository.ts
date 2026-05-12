import type { DataSource, EntityManager } from 'typeorm';
import type { CreateUserAvatarInput } from '../../user/types.js';
import { UserAvatarEntity } from '../entities/user-avatar.entity.js';

import { type Nullable } from '../../../shared/types/index.js';

export class UserAvatarRepository {
  constructor(private readonly dataSource: DataSource) {}

  async create(input: CreateUserAvatarInput, manager?: EntityManager): Promise<UserAvatarEntity> {
    const repository = this.getRepository(manager);

    const userAvatar = repository.create(input);

    return repository.save(userAvatar);
  }

  async findByUserId(userId: number, manager?: EntityManager): Promise<Nullable<UserAvatarEntity>> {
    return this.getRepository(manager).findOne({
      where: { userId },
      relations: {
        media: true,
      },
    });
  }

  async updateMediaByUserId(
    userId: number,
    mediaId: number,
    manager?: EntityManager,
  ): Promise<void> {
    await this.getRepository(manager).update({ userId }, { mediaId });
  }

  private getRepository(manager?: EntityManager) {
    return manager
      ? manager.getRepository(UserAvatarEntity)
      : this.dataSource.getRepository(UserAvatarEntity);
  }
}
