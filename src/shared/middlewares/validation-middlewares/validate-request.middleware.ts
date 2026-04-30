import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { Maybe, ValidatedRequestField } from '@types';
import type { ValidationConfig, ValidationField } from './types.js';

export const validateRequestMiddleware = (config: ValidationConfig): RequestHandler => {
  const configEntries = Object.entries(config);

  let validated: Maybe<ValidatedRequestField> = undefined;

  return (req: Request, _res: Response, next: NextFunction) => {
    configEntries.forEach(([key, validator]) => {
      // cast keys and values to correct types to avoid type errors
      const requestKey = key as ValidationField;
      const valueToValidate = req[requestKey] as unknown;

      // validate value
      const parsedData = validator.parse(valueToValidate, { reportInput: true });
      if (!validated) validated = {};

      validated[requestKey] = parsedData;
    });

    if (validated) req.validated = validated;

    next();
  };
};
