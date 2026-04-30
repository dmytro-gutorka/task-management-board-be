import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import type { LoggerService } from '@infrastructure/logger';
import type { ErrorResponse } from '@types';
import type {
  ExceptionHandler,
  ExceptionHandlersConfigItem,
  KnownException,
} from 'app/exception-filter/types.js';
import { HttpException, InternalServerErrorException } from '@exceptions';

export class ExceptionsFilterService {
  private readonly handlersConfig: ExceptionHandlersConfigItem[];
  private readonly defaultErrorResponse = new InternalServerErrorException().getJson();

  constructor(private readonly loggerService: LoggerService) {
    this.handlersConfig = [
      { handler: this.httpExceptionHandler, type: HttpException },
      { handler: this.zodExceptionHandler, type: ZodError },
    ];
  }

  allExceptionsHandler = (
    exception: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    this.loggerService.error(exception);

    const candidate = this.handlersConfig.find((handler) => exception instanceof handler.type);

    let errorResponse: ErrorResponse = this.defaultErrorResponse;

    if (candidate) errorResponse = candidate.handler(exception as KnownException);

    res.status(errorResponse.statusCode).json(errorResponse);
  };

  private httpExceptionHandler: ExceptionHandler = (exception: HttpException) => {
    return exception.getJson();
  };

  private zodExceptionHandler: ExceptionHandler = (exception: ZodError) => {
    let message: string | string[] = 'Unknown validation error';

    const validationErrorMessages = exception.issues
      .map<string>(({ message }) => message)
      .filter(Boolean);

    if (validationErrorMessages.length === 1) message = validationErrorMessages[0]!;

    if (validationErrorMessages.length > 1) message = validationErrorMessages;

    return {
      message,
      error: 'Validation error',
      statusCode: 400,
    };
  };
}
