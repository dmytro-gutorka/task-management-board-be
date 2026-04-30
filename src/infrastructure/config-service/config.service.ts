import { prettifyError } from 'zod';
import type { EnvFile } from './types.js';
import { EnvFileSchema } from './env.schema.js';

export class ConfigService {
  private readonly _env: EnvFile;

  constructor() {
    const parseResult = EnvFileSchema.safeParse(process.env);

    if (parseResult.success) {
      this._env = parseResult.data;
      return;
    }

    throw new Error(prettifyError(parseResult.error));
  }

  get env() {
    return this._env;
  }
}
