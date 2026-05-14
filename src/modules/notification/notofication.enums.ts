export enum EmailOutboxStatus {
  PENDING = 'pending', // There is a record in Postgres, but "job" is not in BullMQ yet
  QUEUED = 'queued', //  job is in BullMQ
  PROCESSING = 'processing', // worker took "job" for working
  SENT = 'sent',
  FAILED = 'failed', // the last attempt failed but can be retried
  EXCEEDED_MAX_ATTEMPTS = 'exceeded_max_attempts',
}

export enum EmailProvider {
  RESEND = 'resend',
}
