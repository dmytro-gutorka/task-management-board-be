import { Router } from 'express';
import { UpdateUserSchema } from './schemas/update-user.schema.js';
import { UserController } from './user.controller.js';
import { validateBodyMiddleware } from '@validation-middlewares/validate-body.middleware.js';

export const createUserRouter = (userController: UserController): Router => {
  const userRouter = Router();

  userRouter.get('/me', userController.me);

  userRouter.patch('/me', [validateBodyMiddleware(UpdateUserSchema)], userController.updateMe);

  userRouter.delete('/me', userController.deleteMe);

  return userRouter;
};
