import type { Router } from 'express';
import type { LoggerService } from '@infrastructure/logger';
import type { AppGuard } from '@types';

export interface AppModuleRouters {
  userRouter: Router;
  authRouter: Router;
  taskRouter: Router;
}

export interface ModulesComposerReturn {
  accessTokenGuard: AppGuard;
  loggerService: LoggerService;
  moduleRouters: AppModuleRouters;
}

export interface AppRoutesComposerArgs {
  moduleRouters: AppModuleRouters;
  accessTokenGuard: AppGuard;
}
