import { Router } from 'express';
import { CreateTaskSchema } from './schemas/create-task.schema.js';
import { TaskQuerySchema } from './schemas/task-query.schema.js';
import { UpdateTaskSchema } from './schemas/update-task.schema.js';
import { ParamsIdSchema } from '@schemas/params-id.schema.js';
import { TaskController } from './task.controller.js';
import { validateBodyMiddleware } from '@validation-middlewares/validate-body.middleware.js';
import { validateParamsMiddleware } from '@validation-middlewares/validate-params.middleware.js';
import { validateQueryMiddleware } from '@validation-middlewares/validate-query.middleware.js';
import { validateRequestMiddleware } from '@validation-middlewares/validate-request.middleware.js';

export const createTaskRouter = (taskController: TaskController) => {
  const taskRouter = Router();

  taskRouter.get('/', [validateQueryMiddleware(TaskQuerySchema)], taskController.findAll);

  taskRouter.get('/:id', [validateParamsMiddleware(ParamsIdSchema)], taskController.findOne);

  taskRouter.post('/', [validateBodyMiddleware(CreateTaskSchema)], taskController.create);

  taskRouter.patch(
    '/:id',
    [validateRequestMiddleware({ body: UpdateTaskSchema, params: ParamsIdSchema })],
    taskController.update,
  );

  taskRouter.delete('/:id', [validateParamsMiddleware(ParamsIdSchema)], taskController.delete);

  return taskRouter;
};
