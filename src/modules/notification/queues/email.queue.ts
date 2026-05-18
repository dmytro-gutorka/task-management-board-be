import type { SendEmailJobData } from '../notification.types.js';

import { ConfigService } from '../../../infrastructure/config-service/index.js';
import type { QueueConnectionOptions } from '../../../infrastructure/queue/index.js';
import { EmailJobName, EmailQueueName } from '../notofication.enums.js';
import { type JobsOptions, Queue } from 'bullmq';

export class EmailQueue {
  private readonly queue: Queue<SendEmailJobData>;
  private readonly defaultJobOptions: JobsOptions;

  constructor(connection: QueueConnectionOptions, configService: ConfigService) {
    this.defaultJobOptions = {
      attempts: configService.env.EMAIL_QUEUE_MAX_ATTEMPTS,
      backoff: {
        delay: configService.env.EMAIL_QUEUE_BACKOFF_DELAY_MS,
        type: 'exponential',
      },
      removeOnComplete: true,
      removeOnFail: false,
    };

    this.queue = new Queue<SendEmailJobData>(EmailQueueName.EMAIL, {
      connection,
      defaultJobOptions: this.defaultJobOptions,
    });
  }

  async addSendEmailJob(emailOutboxId: number): Promise<void> {
    await this.queue.add(
      EmailJobName.SEND_EMAIL,
      { emailOutboxId },
      {
        jobId: this.buildSendEmailJobId(emailOutboxId),
      },
    );
  }

  async close(): Promise<void> {
    await this.queue.close();
  }

  private buildSendEmailJobId(emailOutboxId: number): string {
    return `${EmailJobName.SEND_EMAIL}-${emailOutboxId}`;
  }
}
