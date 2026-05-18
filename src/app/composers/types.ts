import type { Router } from 'express';
import type { LoggerService } from '@infrastructure/logger';
import type { AppGuard } from '@types';

import { runNotificationModuleComposer } from '../../modules/notification/index.js';

export interface AppModuleRouters {
  userRouter: Router;
  authRouter: Router;
  taskRouter: Router;
}

export interface ModulesComposerReturn {
  accessTokenGuard: AppGuard;
  loggerService: LoggerService;
  moduleRouters: AppModuleRouters;
  notification: ReturnType<typeof runNotificationModuleComposer>;
}

export interface AppRoutesComposerArgs {
  moduleRouters: AppModuleRouters;
  accessTokenGuard: AppGuard;
}
