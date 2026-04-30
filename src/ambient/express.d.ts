import 'express';
import type { ActiveUser } from '@modules/auth';

declare module 'express-serve-static-core' {
  interface Request {
    /**
     ** ❓Global placeholder for validated request data.
     ** ⚠️Do not use this directly — use `ITypedRequest` for strong typing.
     */
    validated?: unknown;

    user?: ActiveUser;
  }
}
