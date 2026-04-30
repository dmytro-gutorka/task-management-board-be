import type { Response } from 'express';
import type { ConfigService } from '@infrastructure/config-service';

export class CookiesService {
  constructor(private readonly configService: ConfigService) {}

  setRefreshTokenCookie(res: Response, refresh_token: string) {
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: true,
      secure: process.env.APP_ENV === 'prod',
      maxAge: this.configService.env.REFRESH_TOKEN_TTL * 1000,
    });
  }

  clearRefreshTokenCookie(res: Response) {
    res.clearCookie('refresh_token');
  }
}
