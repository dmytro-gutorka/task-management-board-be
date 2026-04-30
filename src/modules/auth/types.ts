import type { DataSource } from 'typeorm';
import type { infer as ZodInfer } from 'zod';
import type { ConfigService } from '@infrastructure/config-service';
import type { UserService } from '@modules/user';
import type { Nullable } from '@types';
import type { AuthProvider } from './enums/auth-provider.enum.js';
import type { ActiveUserSchema } from './schemas/active-user.schema.js';
import type { SignInLocalSchema } from './schemas/sign-in-local.schema.js';
import type { SignUpLocalSchema } from './schemas/sign-up-local.schema.js';

export interface CreateAuthDto {
  email: string;
  password: Nullable<string>;
  userId: number;
  provider: AuthProvider;
}

export interface UpdateAuthDto extends Partial<CreateAuthDto> {}

export interface AuthRegisterPayload {
  provider: AuthProvider;
  email: string;
  password?: string;
}

export interface TokensPair {
  accessToken: string;
  refreshToken: string;
}

// ! DTO-s
export type SignInLocalDto = ZodInfer<typeof SignInLocalSchema>;
export type SignUpLocalDto = ZodInfer<typeof SignUpLocalSchema>;

// ! Responses
export type TokenResponse = {
  accessToken: string;
};

// ! composer
export interface AuthModuleComposerArgs {
  dataSource: DataSource;
  configService: ConfigService;
  userService: UserService;
}

export type ActiveUser = ZodInfer<typeof ActiveUserSchema>;
