import { Router } from 'express';
import { UpdateUserSchema } from './schemas/update-user.schema.js';
import { UserController } from './user.controller.js';
import { uploadAvatarMiddleware } from './middlewares/upload-avatar.middleware.js';
import { validateBodyMiddleware } from '@validation-middlewares/validate-body.middleware.js';

export const createUserRouter = (userController: UserController): Router => {
  const userRouter = Router();

  userRouter.get('/me', userController.me);

  userRouter.patch('/me', [validateBodyMiddleware(UpdateUserSchema)], userController.updateMe);

  userRouter.delete('/me', userController.deleteMe);

  userRouter.post('/me/avatar', [uploadAvatarMiddleware], userController.uploadMyAvatar);

  return userRouter;
};
