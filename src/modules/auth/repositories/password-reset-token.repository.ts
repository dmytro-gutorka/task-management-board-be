import { type DataSource, type EntityManager, IsNull, MoreThan, type Repository } from 'typeorm';
import type { CreatePasswordResetTokenInput } from '../types.js';
import { PasswordResetTokenEntity } from '../entities/password-reset-token.entity.js';

import type { Nullable } from '../../../shared/types/index.js';

export class PasswordResetTokenRepository {
  private readonly passwordResetTokenRepository: Repository<PasswordResetTokenEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.passwordResetTokenRepository = this.dataSource.getRepository(PasswordResetTokenEntity);
  }

  async create(
    input: CreatePasswordResetTokenInput,
    manager?: EntityManager,
  ): Promise<PasswordResetTokenEntity> {
    const repository = this.getRepository(manager);
    const passwordResetToken = repository.create(input);

    return repository.save(passwordResetToken);
  }

  async findByTokenHash(
    tokenHash: string,
    manager?: EntityManager,
  ): Promise<Nullable<PasswordResetTokenEntity>> {
    return this.getRepository(manager).findOneBy({ tokenHash });
  }

  async revokeActiveByUserId(userId: number, manager?: EntityManager): Promise<void> {
    await this.getRepository(manager).update(
      {
        userId,
        usedAt: IsNull(),
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
      { revokedAt: new Date() },
    );
  }

  async markUsed(id: number, manager?: EntityManager): Promise<void> {
    await this.getRepository(manager).update({ id }, { usedAt: new Date() });
  }

  private getRepository(manager?: EntityManager) {
    return manager
      ? manager.getRepository(PasswordResetTokenEntity)
      : this.passwordResetTokenRepository;
  }
}
