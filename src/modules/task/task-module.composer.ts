import type { TaskModuleComposerArgs } from './task.types.js';
import { TaskRepository } from './repositories/task.repository.js';
import { TaskService } from './services/task.service.js';
import { TaskController } from './task.controller.js';
import { createTaskRouter } from './task.router.js';

export const runTaskModuleComposer = ({ dataSource }: TaskModuleComposerArgs) => {
  const taskRepository = new TaskRepository(dataSource);
  const taskService = new TaskService(taskRepository);
  const taskController = new TaskController(taskService);

  const taskRouter = createTaskRouter(taskController);

  return { taskRouter };
};
