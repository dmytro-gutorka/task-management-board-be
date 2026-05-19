import type { NextFunction, Request, Response } from 'express';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface AppGuard {
  canActivate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export type DbMetaFiles = 'id' | 'createdAt' | 'updatedAt';
export type OmitDbMetaFiles<T> = Omit<T, DbMetaFiles>;
