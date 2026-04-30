import type { NextFunction, Request, Response } from 'express';
import type { AppGuard } from '@types';
import type { JwtService } from '../services/jwt.service.js';
import { UnauthorizedException } from '@exceptions';

export class AccessTokenGuard implements AppGuard {
  constructor(private readonly jwtService: JwtService) {}

  canActivate = async (req: Request, _res: Response, next: NextFunction) => {
    const accessToken = this.getToken(req);

    req.user = await this.jwtService.verify(accessToken);

    next();
  };

  private getToken(req: Request) {
    const bearerToken = req.headers.authorization;
    const NoTokenError = new UnauthorizedException('Missing Bearer token');

    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      throw NoTokenError;
    }

    const token = bearerToken.split('Bearer ')[1];
    if (!token) {
      throw NoTokenError;
    }

    return token;
  }
}
