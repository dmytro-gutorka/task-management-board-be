import { z } from 'zod';
import { TaskFilterStatus } from '../enums/task-status.enum.js';

const statusValues = Object.values(TaskFilterStatus);

export const statusTaskQuerySchema = z.object({
  status: z.enum(statusValues, `Available status fields are: ${statusValues.join(', ')}`),
});
