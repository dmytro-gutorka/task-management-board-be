import type { EntityManager } from 'typeorm';
import type { CreateEmailOutboxInput, UpdateEmailOutboxInput } from '../notification.types.js';
import type { EmailOutboxEntity } from '../entities/email-outbox.entity.js';
import type { EmailOutboxRepository } from '../repositories/email-outbox.repository.js';

import { EmailOutboxStatus } from '../notofication.enums.js';

export class EmailOutboxService {
  constructor(private readonly emailOutboxRepository: EmailOutboxRepository) {}

  async enqueue(input: CreateEmailOutboxInput): Promise<EmailOutboxEntity> {
    return this.emailOutboxRepository.create(input);
  }

  async findOneById(id: number, manager?: EntityManager): Promise<EmailOutboxEntity | null> {
    return this.emailOutboxRepository.findOneById(id, manager);
  }

  async findPendingForDispatch(
    limit: number,
    manager: EntityManager,
  ): Promise<EmailOutboxEntity[]> {
    return this.emailOutboxRepository.findPendingForDispatch(limit, manager);
  }

  async update(id: number, input: UpdateEmailOutboxInput, manager?: EntityManager): Promise<void> {
    await this.emailOutboxRepository.update(id, input, manager);
  }

  async deleteFinalizedOlderThan(olderThan: Date, manager?: EntityManager): Promise<void> {
    await this.emailOutboxRepository.deleteFinalizedOlderThan(olderThan, manager);
  }

  async markQueued(id: number, manager?: EntityManager): Promise<void> {
    await this.update(
      id,
      {
        status: EmailOutboxStatus.QUEUED,
        queuedAt: new Date(),
        lastError: null,
      },
      manager,
    );
  }

  async markProcessing(id: number, manager?: EntityManager): Promise<void> {
    await this.update(
      id,
      {
        status: EmailOutboxStatus.PROCESSING,
        processingAt: new Date(),
      },
      manager,
    );
  }

  async markSent(id: number, providerMessageId: string, manager?: EntityManager): Promise<void> {
    await this.update(
      id,
      {
        status: EmailOutboxStatus.SENT,
        providerMessageId,
        sentAt: new Date(),
        failedAt: null,
        lastError: null,
      },
      manager,
    );
  }

  async markFailed(id: number, errorMessage: string, manager?: EntityManager): Promise<void> {
    await this.update(
      id,
      {
        status: EmailOutboxStatus.FAILED,
        failedAt: new Date(),
        lastError: errorMessage,
      },
      manager,
    );
  }

  async markExceededMaxAttempts(
    id: number,
    errorMessage: string,
    manager?: EntityManager,
  ): Promise<void> {
    await this.update(
      id,
      {
        status: EmailOutboxStatus.EXCEEDED_MAX_ATTEMPTS,
        failedAt: new Date(),
        lastError: errorMessage,
      },
      manager,
    );
  }
}
