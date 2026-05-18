import {
  type ActiveUser,
  type SetLocalPasswordDto,
  type SignInLocalDto,
  type SignUpLocalDto,
  type TokensPair,
} from '../types.js';
import { AuthProvider } from '../enums/auth-provider.enum.js';
import type { AuthRepository } from '../repositories/auth.repository.js';
import type { AuthRegistrationService } from './auth-registration.service.js';
import type { CryptoService } from './crypto.service.js';
import type { JwtService } from './jwt.service.js';
import { BadRequestException, ConflictException, NotFoundException } from '@exceptions';

export class AuthLocalService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    private readonly authRepository: AuthRepository,
    private readonly authRegistrationService: AuthRegistrationService,
  ) {}

  async signUp(signUpDto: SignUpLocalDto): Promise<TokensPair> {
    const existingLocalAuth = await this.authRepository.findByEmailAndProvider(
      signUpDto.email,
      AuthProvider.LOCAL,
    );

    if (existingLocalAuth) {
      throw new ConflictException('User with this email already exists');
    }

    const existingGoogleAuth = await this.authRepository.findByEmailAndProvider(
      signUpDto.email,
      AuthProvider.GOOGLE,
    );

    if (existingGoogleAuth) {
      throw new ConflictException(
        'Account already exists with Google login. Sign in with Google and set a password in Profile/Security.',
      );
    }

    const auth = await this.authRegistrationService.registerUserWithAuth({
      provider: AuthProvider.LOCAL,
      email: signUpDto.email,
      password: signUpDto.password,
    });

    return this.jwtService.signTokensPair({
      id: auth.userId,
      email: auth.email,
      provider: auth.provider,
    });
  }

  async signIn(signInDto: SignInLocalDto): Promise<TokensPair> {
    const existingAuth = await this.authRepository.findByEmailAndProvider(
      signInDto.email,
      AuthProvider.LOCAL,
    );

    if (!existingAuth) {
      const existingGoogleAuth = await this.authRepository.findByEmailAndProvider(
        signInDto.email,
        AuthProvider.GOOGLE,
      );

      if (existingGoogleAuth) {
        throw new BadRequestException(
          'This account uses Google login. Sign in with Google or set a password in Profile/Security.',
        );
      }

      throw new NotFoundException('User not found');
    }

    const passwordVerified = await this.cryptoService.compare(
      signInDto.password,
      existingAuth.password!,
    );

    if (!passwordVerified) {
      throw new BadRequestException('Password is incorrect');
    }

    return this.jwtService.signTokensPair({
      id: existingAuth.userId,
      email: existingAuth.email,
      provider: existingAuth.provider,
    });
  }

  async setPassword(
    activeUser: ActiveUser,
    setLocalPasswordDto: SetLocalPasswordDto,
  ): Promise<void> {
    const existingLocalAuth = await this.authRepository.findByUserIdAndProvider(
      activeUser.id,
      AuthProvider.LOCAL,
    );

    if (existingLocalAuth) {
      throw new ConflictException('Local auth account already exists');
    }

    const existingGoogleAuth = await this.authRepository.findByUserIdAndProvider(
      activeUser.id,
      AuthProvider.GOOGLE,
    );

    if (!existingGoogleAuth) {
      throw new BadRequestException('Only Google users can set a local password this way');
    }

    await this.authRegistrationService.registerUserWithAuth({
      provider: AuthProvider.LOCAL,
      email: activeUser.email,
      password: setLocalPasswordDto.password,
      userId: activeUser.id,
    });
  }
}
