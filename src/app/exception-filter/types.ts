import type { ZodError } from 'zod';
import type { ErrorResponse } from '@types';
import type { HttpException } from '@exceptions';

// eslint-disable-next-line
export type ExceptionType = new (...args: any[]) => any;

export type KnownException = HttpException | ZodError;

export type ExceptionHandler = (exception: KnownException) => ErrorResponse;

export type ExceptionHandlersConfigItem = {
  handler: ExceptionHandler;
  type: ExceptionType;
};
