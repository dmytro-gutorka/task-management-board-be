import * as bcrypt from 'bcrypt';
import type { ConfigService } from '@infrastructure/config-service';

export class CryptoService {
  constructor(private readonly configService: ConfigService) {}

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.configService.env.JWT_SALT_ROUNDS);
  }

  async compare(raw: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(raw, hashed);
  }
}
