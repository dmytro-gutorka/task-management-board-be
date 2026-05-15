import type { EmailWorkerServiceDependencies, SendEmailJobData } from '../notification.types.js';
import type { EmailOutboxCleanupService } from './email-outbox-cleanup.service.js';
import type { EmailOutboxDispatcherService } from './email-outbox-dispatcher.service.js';
import type { EmailOutboxProcessorService } from './email-outbox-processor.service.js';

import { ConfigService } from '../../../infrastructure/config-service/index.js';
import { LoggerService } from '../../../infrastructure/logger/index.js';
import type { QueueConnectionOptions } from '../../../infrastructure/queue/index.js';
import { EmailQueueName } from '../notofication.enums.js';
import type { Job } from 'bullmq';
import { Worker } from 'bullmq';
import type { ScheduledTask } from 'node-cron';
import { schedule } from 'node-cron';

export class EmailWorkerService {
  private worker: Worker<SendEmailJobData> | null = null;
  private dispatchTask: ScheduledTask | null = null;
  private cleanupTask: ScheduledTask | null = null;

  private readonly configService: ConfigService;
  private readonly connection: QueueConnectionOptions;
  private readonly emailOutboxDispatcherService: EmailOutboxDispatcherService;
  private readonly emailOutboxProcessorService: EmailOutboxProcessorService;
  private readonly emailOutboxCleanupService: EmailOutboxCleanupService;
  private readonly loggerService: LoggerService;

  constructor(dependencies: EmailWorkerServiceDependencies) {
    this.configService = dependencies.configService;
    this.connection = dependencies.bullMqConnection;
    this.emailOutboxDispatcherService = dependencies.emailOutboxDispatcherService;
    this.emailOutboxProcessorService = dependencies.emailOutboxProcessorService;
    this.emailOutboxCleanupService = dependencies.emailOutboxCleanupService;
    this.loggerService = dependencies.loggerService;
  }

  async start(): Promise<void> {
    this.startWorker();
    this.startSchedulers();

    await this.dispatchPendingEmails();
  }

  async close(): Promise<void> {
    await this.dispatchTask?.stop();
    await this.cleanupTask?.stop();

    await this.worker?.close();
  }

  private startWorker(): void {
    this.worker = new Worker<SendEmailJobData>(
      EmailQueueName.EMAIL,
      async (job: Job<SendEmailJobData>) => this.emailOutboxProcessorService.process(job),
      {
        connection: this.connection,
      },
    );

    this.worker.on('completed', (job) => {
      this.loggerService.info(`Email job ${job.id ?? 'unknown'} completed`);
    });

    this.worker.on('failed', (job, error) => {
      this.loggerService.error(
        new Error(`Email job ${job?.id ?? 'unknown'} failed`, {
          cause: error,
        }),
      );
    });

    this.loggerService.init('EmailWorker');
  }

  private startSchedulers(): void {
    this.dispatchTask = schedule(this.configService.env.EMAIL_QUEUE_DISPATCH_CRON, () => {
      void this.dispatchPendingEmails();
    });

    this.cleanupTask = schedule(this.configService.env.EMAIL_OUTBOX_CLEANUP_CRON, () => {
      void this.cleanupOldEmails();
    });
  }

  private async dispatchPendingEmails(): Promise<void> {
    try {
      await this.emailOutboxDispatcherService.dispatchPending(
        this.configService.env.EMAIL_QUEUE_DISPATCH_BATCH_SIZE,
      );
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  private async cleanupOldEmails(): Promise<void> {
    try {
      await this.emailOutboxCleanupService.deleteOldFinalizedEmails();
    } catch (error) {
      this.loggerService.error(error);
    }
  }
}
