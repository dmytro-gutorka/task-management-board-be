import { ConfigService } from '@infrastructure/config-service';
import { DatabaseService } from '@infrastructure/database';
import { LoggerService } from '@infrastructure/logger';
import { runAuthModuleComposer } from '@modules/auth';
import { runTaskModuleComposer } from '@modules/task';
import { runUserModuleComposer } from '@modules/user';
import type { AppModuleRouters, ModulesComposerReturn } from './types.js';

export const runModulesComposer = async (): Promise<ModulesComposerReturn> => {
  // Infrastructure and shared modules and services
  const loggerService = new LoggerService();
  loggerService.init(LoggerService.name);

  const configService = new ConfigService();
  loggerService.init(ConfigService.name);

  const databaseService = new DatabaseService(configService);
  const dataSource = await databaseService.initialize();
  loggerService.init(DatabaseService.name);

  // Feature modules and services
  const user = runUserModuleComposer({ dataSource });
  loggerService.init('UserModule');

  const auth = runAuthModuleComposer({ dataSource, configService, userService: user.userService });
  loggerService.init('AuthModule');

  const task = runTaskModuleComposer({ dataSource });
  loggerService.init('TaskModule');

  // Compose routers
  const moduleRouters: AppModuleRouters = {
    userRouter: user.userRouter,
    authRouter: auth.authRouter,
    taskRouter: task.taskRouter,
  };

  return { moduleRouters, loggerService, accessTokenGuard: auth.accessTokenGuard };
};
