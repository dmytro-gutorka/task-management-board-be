import { EmailOutboxRepository } from '../modules/notification/repositories/email-outbox.repository.js';

import { ConfigService } from '../infrastructure/config-service/index.js';
import { DatabaseService } from '../infrastructure/database/index.js';
import { ResendEmailProviderService } from '../infrastructure/email-provider/index.js';
import { LoggerService } from '../infrastructure/logger/index.js';
import { createBullMqConnection } from '../infrastructure/queue/index.js';
import {
  EmailOutboxCleanupService,
  EmailOutboxDispatcherService,
  EmailOutboxProcessorService,
  EmailOutboxService,
  EmailQueue,
  EmailWorkerService,
} from '../modules/notification/index.js';

export const runEmailWorkerComposer = async () => {
  const loggerService = new LoggerService();
  loggerService.init(LoggerService.name);

  const configService = new ConfigService();
  loggerService.init(ConfigService.name);

  const databaseService = new DatabaseService(configService);
  const dataSource = await databaseService.initialize();
  loggerService.init(DatabaseService.name);

  const bullMqConnection = createBullMqConnection(configService);
  const emailOutboxRepository = new EmailOutboxRepository(dataSource);
  const emailOutboxService = new EmailOutboxService(emailOutboxRepository);
  const emailProviderService = new ResendEmailProviderService(configService);
  const emailQueue = new EmailQueue(bullMqConnection, configService);
  const emailOutboxDispatcherService = new EmailOutboxDispatcherService(
    dataSource,
    emailOutboxService,
    emailQueue,
    loggerService,
  );
  const emailOutboxProcessorService = new EmailOutboxProcessorService(
    emailOutboxService,
    emailProviderService,
  );
  const emailOutboxCleanupService = new EmailOutboxCleanupService(
    configService,
    emailOutboxService,
    loggerService,
  );
  const emailWorkerService = new EmailWorkerService({
    configService,
    bullMqConnection,
    emailOutboxDispatcherService,
    emailOutboxProcessorService,
    emailOutboxCleanupService,
    loggerService,
  });

  return {
    emailWorkerService,
    emailQueue,
    dataSource,
    loggerService,
  };
};
