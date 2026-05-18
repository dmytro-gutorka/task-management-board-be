import type { DataSource } from 'typeorm';
import type { infer as ZodInfer } from 'zod';
import type { ConfigService } from '@infrastructure/config-service';
import type { UserService } from '@modules/user';
import type { Nullable } from '@types';
import type { AuthProvider } from './enums/auth-provider.enum.js';
import type { ActiveUserSchema } from './schemas/active-user.schema.js';
import type { ConfirmPasswordResetSchema } from './schemas/confirm-password-reset.schema.js';
import type { SignInGoogleSchema } from './schemas/sign-in-google.schema.js';
import type { SignInLocalSchema } from './schemas/sign-in-local.schema.js';
import type { SignUpLocalSchema } from './schemas/sign-up-local.schema.js';

import type { GoogleAuthProviderService } from '../../infrastructure/google-auth/index.js';
import { EmailOutboxService } from '../notification/index.js';

export interface CreateAuthDto {
  email: string;
  password: Nullable<string>;
  userId: number;
  provider: AuthProvider;
  providerAccountId?: Nullable<string>;
}

export interface UpdateAuthDto extends Partial<CreateAuthDto> {}

export interface AuthRegisterPayload {
  provider: AuthProvider;
  email: string;
  name?: string;
  password?: string;
  userId?: number;
  providerAccountId?: Nullable<string>;
}

export interface TokensPair {
  accessToken: string;
  refreshToken: string;
}

// ! DTO-s
export type SignInLocalDto = ZodInfer<typeof SignInLocalSchema>;
export type SignUpLocalDto = ZodInfer<typeof SignUpLocalSchema>;
export type SignInGoogleDto = ZodInfer<typeof SignInGoogleSchema>;

// ! Responses
export type TokenResponse = {
  accessToken: string;
};

// ! composer
export interface AuthModuleComposerArgs {
  dataSource: DataSource;
  configService: ConfigService;
  userService: UserService;
  emailOutboxService: EmailOutboxService;
  googleAuthProviderService: GoogleAuthProviderService;
}

export type ActiveUser = ZodInfer<typeof ActiveUserSchema>;

// Reset password
export interface PasswordResetRequestResponse {
  message: string;
}

export interface CreatePasswordResetTokenInput {
  userId: number;
  authId: number;
  tokenHash: string;
  expiresAt: Date;
}

export type ConfirmPasswordResetDto = ZodInfer<typeof ConfirmPasswordResetSchema>;
