import type { DataSource, EntityManager } from 'typeorm';
import type { EmailOutboxCleanupService } from './services/email-outbox-cleanup.service.js';
import type { EmailOutboxDispatcherService } from './services/email-outbox-dispatcher.service.js';
import type { EmailOutboxProcessorService } from './services/email-outbox-processor.service.js';

import { ConfigService } from '../../infrastructure/config-service/index.js';
import { LoggerService } from '../../infrastructure/logger/index.js';
import type { QueueConnectionOptions } from '../../infrastructure/queue/index.js';
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

export interface SendEmailJobData {
  emailOutboxId: number;
}

export interface EmailWorkerServiceDependencies {
  configService: ConfigService;
  bullMqConnection: QueueConnectionOptions;
  emailOutboxDispatcherService: EmailOutboxDispatcherService;
  emailOutboxProcessorService: EmailOutboxProcessorService;
  emailOutboxCleanupService: EmailOutboxCleanupService;
  loggerService: LoggerService;
}
