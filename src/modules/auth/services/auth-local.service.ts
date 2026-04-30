import { type SignUpLocalDto, type TokensPair } from '../types.js';
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
    // Check if the auth record already exists
    const existingAuth = await this.authRepository.findByEmailAndProvider(
      signUpDto.email,
      AuthProvider.LOCAL,
    );

    if (existingAuth) {
      throw new ConflictException('User with this email already exists');
    }

    const auth = await this.authRegistrationService.registerUser({
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

  async signIn(signUpDto: SignUpLocalDto): Promise<TokensPair> {
    const existingAuth = await this.authRepository.findByEmailAndProvider(
      signUpDto.email,
      AuthProvider.LOCAL,
    );

    if (!existingAuth) {
      throw new NotFoundException('User not found');
    }

    const passwordVerified = await this.cryptoService.compare(
      signUpDto.password,
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
}
