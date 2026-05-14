import type { DataSource, EntityManager } from 'typeorm';

import { ConfigService } from '../../infrastructure/config-service/index.js';
import { type EmailOutboxStatus, EmailProvider } from './notofication.enums.js';

export interface CreateEmailOutboxInput {
  recipientEmail: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  provider?: EmailProvider;
  manager?: EntityManager;
}

export interface UpdateEmailOutboxInput {
  status?: EmailOutboxStatus;
  providerMessageId?: string | null;
  queuedAt?: Date | null;
  processingAt?: Date | null;
  sentAt?: Date | null;
  failedAt?: Date | null;
  lastError?: string | null;
}

export interface NotificationModuleComposerArgs {
  dataSource: DataSource;
  configService: ConfigService;
}
