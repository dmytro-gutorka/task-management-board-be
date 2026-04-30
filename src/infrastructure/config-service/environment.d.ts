import type { EnvFile } from './types.js';

declare global {
  namespace NodeJS {
    // @ts-expect-error: This is a global variable
    interface ProcessEnv extends EnvFile {}
  }
}

// If this file has no import/export statements (i.e., is a script)
// convert it into a module by adding an empty export statement.
export {};
