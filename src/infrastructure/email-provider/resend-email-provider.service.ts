import type { EmailProviderService, SendEmailInput, SendEmailResult } from './types.js';

import { ConfigService } from '../config-service/index.js';
import { Resend } from 'resend';

export class ResendEmailProviderService implements EmailProviderService {
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(configService: ConfigService) {
    this.resend = new Resend(configService.env.RESEND_API_KEY);
    this.fromEmail = configService.env.RESEND_EMAIL_FROM;
  }

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    const { data, error } = await this.resend.emails.send({
      from: this.fromEmail,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });

    if (error) throw new Error(error.message);

    if (!data?.id) throw new Error('Email provider did not return message id');

    return {
      providerMessageId: data.id,
    };
  }
}
