import type { NextFunction, Request, Response } from 'express';
import type { AppGuard } from '@types';
import type { JwtService } from '../services/jwt.service.js';
import { UnauthorizedException } from '@exceptions';

export class RefreshTokenGuard implements AppGuard {
  constructor(private jwtService: JwtService) {}

  canActivate = async (req: Request, _res: Response, next: NextFunction) => {
    const refreshToken = req.cookies['refresh_token'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    req.user = await this.jwtService.verify(refreshToken);

    next();
  };
}
