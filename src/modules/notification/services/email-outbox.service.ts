import type { EntityManager } from 'typeorm';
import type { CreateEmailOutboxInput, UpdateEmailOutboxInput } from '../notification.types.js';
import type { EmailOutboxEntity } from '../entities/email-outbox.entity.js';
import type { EmailOutboxRepository } from '../repositories/email-outbox.repository.js';

export class EmailOutboxService {
  constructor(private readonly emailOutboxRepository: EmailOutboxRepository) {}

  async enqueue(input: CreateEmailOutboxInput): Promise<EmailOutboxEntity> {
    return this.emailOutboxRepository.create(input);
  }

  async update(id: number, input: UpdateEmailOutboxInput, manager?: EntityManager): Promise<void> {
    await this.emailOutboxRepository.update(id, input, manager);
  }
}
