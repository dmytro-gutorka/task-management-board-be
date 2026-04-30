import type { UserModuleComposerArgs } from './types.js';
import { UserRepository } from './repositories/user.repository.js';
import { UserService } from './services/user.service.js';
import { UserController } from './user.controller.js';
import { createUserRouter } from './user.router.js';

export const runUserModuleComposer = ({ dataSource }: UserModuleComposerArgs) => {
  const userRepository = new UserRepository(dataSource);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  const userRouter = createUserRouter(userController);

  return {
    userRouter,
    userService,
  };
};
