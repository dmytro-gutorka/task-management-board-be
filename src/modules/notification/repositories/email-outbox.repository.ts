import type { DataSource, EntityManager, Repository } from 'typeorm';
import { In, LessThan } from 'typeorm';
import type { CreateEmailOutboxInput, UpdateEmailOutboxInput } from '../notification.types.js';
import { EmailOutboxEntity } from '../entities/email-outbox.entity.js';

import type { Nullable } from '../../../shared/types/index.js';
import { EmailOutboxStatus, EmailProvider } from '../notofication.enums.js';

export class EmailOutboxRepository {
  private readonly emailOutboxRepository: Repository<EmailOutboxEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.emailOutboxRepository = this.dataSource.getRepository(EmailOutboxEntity);
  }

  async findOneById(id: number, manager?: EntityManager): Promise<Nullable<EmailOutboxEntity>> {
    return this.getRepository(manager).findOneBy({ id });
  }

  async findPendingForDispatch(
    limit: number,
    manager: EntityManager,
  ): Promise<EmailOutboxEntity[]> {
    const queryBuilder = this.getRepository(manager).createQueryBuilder('email_outbox');
    const alias = queryBuilder.alias;

    return queryBuilder
      .setLock('pessimistic_write')
      .setOnLocked('skip_locked')
      .where(`${alias}.status = :status`, { status: EmailOutboxStatus.PENDING })
      .orderBy(`${alias}.createdAt`, 'ASC')
      .limit(limit)
      .getMany();
  }

  async create(input: CreateEmailOutboxInput): Promise<EmailOutboxEntity> {
    const repository = this.getRepository(input.manager);

    const emailOutbox = repository.create({
      recipientEmail: input.recipientEmail,
      subject: input.subject,
      htmlBody: input.htmlBody,
      textBody: input.textBody ?? null,
      status: EmailOutboxStatus.PENDING,
      provider: input.provider ?? EmailProvider.RESEND,
    });

    return repository.save(emailOutbox);
  }

  async update(id: number, input: UpdateEmailOutboxInput, manager?: EntityManager): Promise<void> {
    await this.getRepository(manager).update(id, input);
  }

  async deleteFinalizedOlderThan(olderThan: Date, manager?: EntityManager): Promise<void> {
    await this.getRepository(manager).delete({
      status: In([EmailOutboxStatus.SENT, EmailOutboxStatus.EXCEEDED_MAX_ATTEMPTS]),
      updatedAt: LessThan(olderThan),
    });
  }

  private getRepository(manager?: EntityManager) {
    return manager ? manager.getRepository(EmailOutboxEntity) : this.emailOutboxRepository;
  }
}
