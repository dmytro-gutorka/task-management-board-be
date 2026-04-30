/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import type { Maybe } from '@types';

/**
 * Describes the structure of validated request data.
 * Each property corresponds to a request section.
 */
export interface ValidatedRequestField {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

/**
 * Strongly typed alternative to Express `Request` with a `validated` field.
 *
 * Use this in controllers when you need access to type-safe data.
 */
export interface TypedRequest<
  /**
   * Shape of validated data.
   *
   * Ex: `{ body: UserDto; }`
   *
   * Determines the types available under `req.validated`.
   */
  S extends Maybe<ValidatedRequestField> = undefined,
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>,
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  /**
   * Parsed & type-safe request data.
   *
   * Independent of the raw `req.body`, `req.params`, and `req.query`.
   */
  validated: S;
}
