import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { Nullable } from '../../../shared/types/index.js';
import { EmailOutboxStatus, EmailProvider } from '../notofication.enums.js';

@Entity('email_outbox')
export class EmailOutboxEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'recipient_email', type: 'varchar', length: 255 })
  recipientEmail: string;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ name: 'html_body', type: 'text' })
  htmlBody: string;

  @Column({ name: 'text_body', type: 'text', nullable: true })
  textBody: Nullable<string>;

  @Column({ type: 'enum', enum: EmailOutboxStatus, default: EmailOutboxStatus.PENDING })
  status: EmailOutboxStatus;

  @Column({ type: 'varchar', length: 50, default: EmailProvider.RESEND })
  provider: EmailProvider;

  @Column({ name: 'provider_message_id', type: 'varchar', length: 255, nullable: true })
  providerMessageId: Nullable<string>;

  @Column({ name: 'queued_at', type: 'timestamptz', nullable: true })
  queuedAt: Nullable<Date>;

  @Column({ name: 'processing_at', type: 'timestamptz', nullable: true })
  processingAt: Nullable<Date>;

  @Column({ name: 'sent_at', type: 'timestamptz', nullable: true })
  sentAt: Nullable<Date>;

  @Column({ name: 'failed_at', type: 'timestamptz', nullable: true })
  failedAt: Nullable<Date>;

  @Column({ name: 'last_error', type: 'text', nullable: true })
  lastError: Nullable<string>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
