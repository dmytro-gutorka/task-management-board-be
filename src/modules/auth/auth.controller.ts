import type { Request, Response } from 'express';
import type { MessageResponse, TypedRequest } from '@types';
import type {
  ActiveUser,
  ConfirmPasswordResetDto,
  SetLocalPasswordDto,
  SignInGoogleDto,
  SignInLocalDto,
  SignUpLocalDto,
  TokenResponse,
} from './types.js';
import type { AuthService } from './services/auth.service.js';
import type { AuthGoogleService } from './services/auth-google.service.js';
import type { AuthLocalService } from './services/auth-local.service.js';
import type { CookiesService } from './services/cookies.service.js';
import type { PasswordResetService } from './services/password-reset.service.js';

interface AuthControllerDependencies {
  authService: AuthService;
  cookiesService: CookiesService;
  authLocalService: AuthLocalService;
  authGoogleService: AuthGoogleService;
  passwordResetService: PasswordResetService;
}

export class AuthController {
  private readonly authService: AuthService;
  private readonly cookiesService: CookiesService;
  private readonly authLocalService: AuthLocalService;
  private readonly authGoogleService: AuthGoogleService;
  private readonly passwordResetService: PasswordResetService;

  constructor(dependencies: AuthControllerDependencies) {
    this.authService = dependencies.authService;
    this.cookiesService = dependencies.cookiesService;
    this.authLocalService = dependencies.authLocalService;
    this.authGoogleService = dependencies.authGoogleService;
    this.passwordResetService = dependencies.passwordResetService;
  }

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

  signInGoogle = async (req: TypedRequest<{ body: SignInGoogleDto }>, res: Response) => {
    const tokens = await this.authGoogleService.signIn(req.validated.body);
    const { accessToken, refreshToken } = tokens;

    this.cookiesService.setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({ accessToken } satisfies TokenResponse);
  };

  linkGoogle = async (req: TypedRequest<{ body: SignInGoogleDto }>, res: Response) => {
    const user: ActiveUser = req.user!;

    await this.authGoogleService.link(user, req.validated.body);

    res
      .status(200)
      .json({ message: 'Google account linked successfully' } satisfies MessageResponse);
  };

  setPassword = async (req: TypedRequest<{ body: SetLocalPasswordDto }>, res: Response) => {
    const user: ActiveUser = req.user!;

    await this.authLocalService.setPassword(user, req.validated.body);

    res.status(200).json({ message: 'Password set successfully' } satisfies MessageResponse);
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

  requestPasswordReset = async (req: Request, res: Response) => {
    const user: ActiveUser = req.user!;
    const response = await this.passwordResetService.requestAuthenticatedPasswordReset(user);

    res.status(200).json(response);
  };

  confirmPasswordReset = async (
    req: TypedRequest<{ body: ConfirmPasswordResetDto }>,
    res: Response,
  ) => {
    await this.passwordResetService.confirmPasswordReset(req.validated.body);

    res
      .status(200)
      .json({ message: 'Password was successfully changed' } satisfies MessageResponse);
  };
}
