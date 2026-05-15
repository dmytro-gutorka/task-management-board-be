import { z } from 'zod';

export const EnvFileSchema = z.object({
  // APP
  APP_PORT: z.coerce.number('APP_PORT must be a number in env file'),
  APP_ENV: z.enum(
    ['dev', 'prod', 'test'],
    'APP_ENV must be in env file. Available values: dev, prod, test',
  ),
  APP_FRONTEND_URL: z.string('APP_FRONTEND_URL must be in env file'),

  // DATABASE
  DB_HOST: z.string('DB_HOST must be in env file'),
  DB_USERNAME: z.string('DB_USERNAME must be in env file'),
  DB_PASSWORD: z.string('DB_PASSWORD must be in env file'),
  DB_DATABASE: z.string('DB_DATABASE must be in env file'),
  DB_PORT: z.coerce.number('DB_PORT must be a number in env file'),

  // JWT
  JWT_SECRET: z.string('JWT_SECRET must be a string in env file'),
  JWT_SALT_ROUNDS: z.coerce.number('JWT_SALT_ROUNDS must be a number in env file'),
  ACCESS_TOKEN_TTL: z.coerce.number('ACCESS_TOKEN_TL must be a number in env file'),
  REFRESH_TOKEN_TTL: z.coerce.number('REFRESH_TOKEN_TL must be a number in env file'),

  // CLOUDINARY
  CLOUDINARY_CLOUD_NAME: z.string('CLOUDINARY_CLOUD_NAME must be in env file'),
  CLOUDINARY_API_KEY: z.string('CLOUDINARY_API_KEY must be in env file'),
  CLOUDINARY_API_SECRET: z.string('CLOUDINARY_API_SECRET must be in env file'),
  CLOUDINARY_FOLDER: z.string('CLOUDINARY_FOLDER must be in env file'),

  // RESET_PASSWORD
  RESET_PASSWORD_TOKEN_BYTES: z.coerce.number(
    'RESET_PASSWORD_TOKEN_BYTES must be a number in env file',
  ),
  RESET_PASSWORD_TOKEN_TTL_MS: z.coerce.number(
    'RESET_PASSWORD_TOKEN_TTL_MS must be a number in env file',
  ),

  // RESEND
  RESEND_API_KEY: z.string('RESEND_API_KEY must be in env file'),
  RESEND_EMAIL_FROM: z.string('RESEND_EMAIL_FROM must be in env file'),

  // REDIS
  REDIS_HOST: z.string('REDIS_HOST must be in env file'),
  REDIS_PORT: z.coerce.number('REDIS_PORT must be a number in env file'),

  // EMAIL QUEUE
  EMAIL_QUEUE_MAX_ATTEMPTS: z.coerce.number(
    'EMAIL_QUEUE_MAX_ATTEMPTS must be a number in env file',
  ),
  EMAIL_QUEUE_BACKOFF_DELAY_MS: z.coerce.number(
    'EMAIL_QUEUE_BACKOFF_DELAY_MS must be a number in env file',
  ),
  EMAIL_QUEUE_DISPATCH_BATCH_SIZE: z.coerce.number(
    'EMAIL_QUEUE_DISPATCH_BATCH_SIZE must be a number in env file',
  ),
  EMAIL_OUTBOX_CLEANUP_RETENTION_DAYS: z.coerce.number(
    ': EMAIL_OUTBOX_CLEANUP_RETENTION_DAYS must be a number in env file',
  ),

  // EMAIL CRON
  EMAIL_QUEUE_DISPATCH_CRON: z.string('EMAIL_QUEUE_DISPATCH_CRON must be in env file'),
  EMAIL_OUTBOX_CLEANUP_CRON: z.string('EMAIL_OUTBOX_CLEANUP_CRON must be in env file'),
});
