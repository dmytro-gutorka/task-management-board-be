import { ConfigService } from '@infrastructure/config-service';
import { DatabaseService } from '@infrastructure/database';
import { LoggerService } from '@infrastructure/logger';
import { runAuthModuleComposer } from '@modules/auth';
import { runTaskModuleComposer } from '@modules/task';
import { runUserModuleComposer } from '@modules/user';
import type { AppModuleRouters, ModulesComposerReturn } from './types.js';
import { MediaRepository } from '../../modules/media/repositories/media.repository.js';
import { UserAvatarRepository } from '../../modules/media/repositories/user-avatar.repository.js';
import { MediaService } from '../../modules/media/services/media.service.js';
import { UserAvatarService } from '../../modules/media/services/user-avatar.service.js';

import { CloudinaryMediaStorageService } from '../../infrastructure/media-storage/index.js';
import { runNotificationModuleComposer } from '../../modules/notification/index.js';

export const runModulesComposer = async (): Promise<ModulesComposerReturn> => {
  // Infrastructure and shared modules and services
  const loggerService = new LoggerService();
  loggerService.init(LoggerService.name);

  const configService = new ConfigService();
  loggerService.init(ConfigService.name);

  const databaseService = new DatabaseService(configService);
  const dataSource = await databaseService.initialize();
  loggerService.init(DatabaseService.name);

  const mediaStorageService = new CloudinaryMediaStorageService(configService);
  loggerService.init(CloudinaryMediaStorageService.name);

  // Shared feature services
  const mediaRepository = new MediaRepository(dataSource);
  const userAvatarRepository = new UserAvatarRepository(dataSource);
  const mediaService = new MediaService(mediaRepository, mediaStorageService);
  const userAvatarService = new UserAvatarService(userAvatarRepository, mediaService);

  // Feature modules and services
  const user = runUserModuleComposer({ dataSource, userAvatarService });

  const notification = runNotificationModuleComposer({ dataSource, configService });
  loggerService.init('NotificationModule');

  const auth = runAuthModuleComposer({
    dataSource,
    configService,
    userService: user.userService,
    emailOutboxService: notification.emailOutboxService,
  });
  loggerService.init('AuthModule');

  const task = runTaskModuleComposer({ dataSource });
  loggerService.init('TaskModule');

  const notification = runNotificationModuleComposer({ dataSource, configService });
  loggerService.init('NotificationModule');

  // Compose routers
  const moduleRouters: AppModuleRouters = {
    userRouter: user.userRouter,
    authRouter: auth.authRouter,
    taskRouter: task.taskRouter,
  };

  return {
    moduleRouters,
    loggerService,
    accessTokenGuard: auth.accessTokenGuard,
    notification,
  };
};
