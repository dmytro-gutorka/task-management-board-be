export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailResult {
  providerMessageId: string;
}

export interface EmailProviderService {
  send(input: SendEmailInput): Promise<SendEmailResult>;
}
