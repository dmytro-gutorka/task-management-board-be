import type { DataSource, EntityManager } from 'typeorm';
import type { EmailOutboxRepository } from './repositories/email-outbox.repository.js';
import type { EmailOutboxService } from './services/email-outbox.service.js';

import { ConfigService } from '../../infrastructure/config-service/index.js';
import type { EmailProviderService } from '../../infrastructure/email-provider/index.js';
import { LoggerService } from '../../infrastructure/logger/index.js';
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

export interface EmailWorkerComposerArgs {
  configService: ConfigService;
  dataSource: DataSource;
  emailOutboxRepository: EmailOutboxRepository;
  emailOutboxService: EmailOutboxService;
  emailProviderService: EmailProviderService;
  loggerService: LoggerService;
}
