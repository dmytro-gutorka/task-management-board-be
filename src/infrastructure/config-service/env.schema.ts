import { z } from 'zod';

export const EnvFileSchema = z.object({
  // APP
  APP_PORT: z.coerce.number('APP_PORT must be a number in env file'),
  APP_ENV: z.enum(
    ['dev', 'prod', 'test'],
    'APP_ENV must be in env file. Available values: dev, prod, test',
  ),

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
});
