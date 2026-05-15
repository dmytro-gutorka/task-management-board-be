import type { SendEmailJobData } from '../notification.types.js';
import type { EmailOutboxService } from './email-outbox.service.js';

import type { EmailProviderService } from '../../../infrastructure/email-provider/index.js';
import { toError } from '../../../shared/utils/toError.js';
import { EmailOutboxStatus } from '../notofication.enums.js';
import type { Job } from 'bullmq';

export class EmailOutboxProcessorService {
  constructor(
    private readonly emailOutboxService: EmailOutboxService,
    private readonly emailProviderService: EmailProviderService,
  ) {}

  async process(job: Job<SendEmailJobData>): Promise<void> {
    const emailOutbox = await this.emailOutboxService.findOneById(job.data.emailOutboxId);

    if (!emailOutbox) return;

    if (
      emailOutbox.status === EmailOutboxStatus.SENT ||
      emailOutbox.status === EmailOutboxStatus.EXCEEDED_MAX_ATTEMPTS
    ) {
      return;
    }

    await this.emailOutboxService.markProcessing(emailOutbox.id);

    try {
      const sendResult = await this.emailProviderService.send({
        to: emailOutbox.recipientEmail,
        subject: emailOutbox.subject,
        html: emailOutbox.htmlBody,
        text: emailOutbox.textBody ?? undefined,
      });

      await this.emailOutboxService.markSent(emailOutbox.id, sendResult.providerMessageId);
    } catch (error) {
      const normalizedError = toError(error);

      if (this.isFinalAttempt(job)) {
        await this.emailOutboxService.markExceededMaxAttempts(
          emailOutbox.id,
          normalizedError.message,
        );
      } else {
        await this.emailOutboxService.markFailed(emailOutbox.id, normalizedError.message);
      }

      throw normalizedError;
    }
  }

  private isFinalAttempt(job: Job<SendEmailJobData>): boolean {
    const maxAttempts = job.opts.attempts ?? 1;

    return job.attemptsMade + 1 >= maxAttempts;
  }
}
