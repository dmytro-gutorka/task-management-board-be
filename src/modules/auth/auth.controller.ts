import type { Request, Response } from 'express';
import type { MessageResponse, TypedRequest } from '@types';
import type { ActiveUser, SignInLocalDto, SignUpLocalDto, TokenResponse } from './types.js';
import type { AuthService } from './services/auth.service.js';
import type { AuthLocalService } from './services/auth-local.service.js';
import type { CookiesService } from './services/cookies.service.js';

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookiesService: CookiesService,
    private readonly authLocalService: AuthLocalService,
  ) {}

  signUp = async (req: TypedRequest<{ body: SignUpLocalDto }>, res: Response) => {
    const tokens = await this.authLocalService.signUp(req.validated.body);
    const { accessToken, refreshToken } = tokens;

    this.cookiesService.setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({ accessToken } satisfies TokenResponse);
  };

  signIn = async (req: TypedRequest<{ body: SignInLocalDto }>, res: Response) => {
    const tokens = await this.authLocalService.signIn(req.validated.body);
    const { accessToken, refreshToken } = tokens;

    this.cookiesService.setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({ accessToken } satisfies TokenResponse);
  };

  signOut = (_req: Request, res: Response) => {
    this.cookiesService.clearRefreshTokenCookie(res);

    res.status(200).json({ message: 'Successfully signed out' } satisfies MessageResponse);
  };

  refresh = (req: Request, res: Response) => {
    const user: ActiveUser = req.user!;
    const { accessToken, refreshToken } = this.authService.refreshToken(user);

    this.cookiesService.setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({ accessToken } satisfies TokenResponse);
  };
}
