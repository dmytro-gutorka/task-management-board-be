import type { QueueConnectionOptions } from './types.js';

import { ConfigService } from '../config-service/index.js';

export function createBullMqConnection(configService: ConfigService): QueueConnectionOptions {
  return {
    host: configService.env.REDIS_HOST,
    port: configService.env.REDIS_PORT,
    maxRetriesPerRequest: null,
  };
}
