import type { DataSource } from 'typeorm';
import type { EmailOutboxService } from './email-outbox.service.js';

import { LoggerService } from '../../../infrastructure/logger/index.js';
import type { EmailQueue } from '../queues/email.queue.js';

export class EmailOutboxDispatcherService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly emailOutboxService: EmailOutboxService,
    private readonly emailQueue: EmailQueue,
    private readonly loggerService: LoggerService,
  ) {}

  async dispatchPending(limit: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const pendingEmails = await this.emailOutboxService.findPendingForDispatch(limit, manager);

      for (const pendingEmail of pendingEmails) {
        await this.emailQueue.addSendEmailJob(pendingEmail.id);
        await this.emailOutboxService.markQueued(pendingEmail.id, manager);
      }

      if (pendingEmails.length > 0) {
        this.loggerService.info(`Queued ${pendingEmails.length} email outbox item(s)`);
      }
    });
  }
}
