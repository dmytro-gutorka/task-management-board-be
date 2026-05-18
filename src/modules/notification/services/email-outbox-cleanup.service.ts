import type { EmailOutboxService } from './email-outbox.service.js';

import { ConfigService } from '../../../infrastructure/config-service/index.js';
import { LoggerService } from '../../../infrastructure/logger/index.js';
import { MILLISECONDS_IN } from '../../../shared/constants/common.constants.js';

export class EmailOutboxCleanupService {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailOutboxService: EmailOutboxService,
    private readonly loggerService: LoggerService,
  ) {}

  async deleteOldFinalizedEmails(): Promise<void> {
    const retentionMs =
      this.configService.env.EMAIL_OUTBOX_CLEANUP_RETENTION_DAYS * MILLISECONDS_IN.DAY;
    const olderThan = new Date(Date.now() - retentionMs);

    await this.emailOutboxService.deleteFinalizedOlderThan(olderThan);
    this.loggerService.info('Email outbox cleanup completed');
  }
}
