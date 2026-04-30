import { Router } from 'express';
import type { AppRoutesComposerArgs } from './types.js';

export const runRoutersComposer = ({
  moduleRouters,
  accessTokenGuard,
}: AppRoutesComposerArgs): Router => {
  const rootRouter = Router();

  rootRouter.use('/auth', moduleRouters.authRouter);
  rootRouter.use('/users', [accessTokenGuard.canActivate], moduleRouters.userRouter);
  rootRouter.use('/tasks', [accessTokenGuard.canActivate], moduleRouters.taskRouter);

  return rootRouter;
};
