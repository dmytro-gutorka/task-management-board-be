import type { NotificationModuleComposerArgs } from './notification.types.js';
import { EmailOutboxRepository } from './repositories/email-outbox.repository.js';
import { EmailOutboxService } from './services/email-outbox.service.js';

import { ResendEmailProviderService } from '../../infrastructure/email-provider/index.js';

export const runNotificationModuleComposer = ({
  dataSource,
  configService,
}: NotificationModuleComposerArgs) => {
  const emailOutboxRepository = new EmailOutboxRepository(dataSource);
  const emailOutboxService = new EmailOutboxService(emailOutboxRepository);
  const emailProviderService = new ResendEmailProviderService(configService);

  return {
    emailOutboxService,
    emailProviderService,
  };
};
