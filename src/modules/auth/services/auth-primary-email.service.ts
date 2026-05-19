import type { UserService } from '@modules/user';
import type {
  ActiveUser,
  PrimaryEmailOption,
  PrimaryEmailOptionsResponse,
  UpdatePrimaryEmailDto,
  UpdatePrimaryEmailResponse,
} from '../types.js';
import type { AuthRepository } from '../repositories/auth.repository.js';
import { BadRequestException } from '@exceptions';

export class AuthPrimaryEmailService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
  ) {}

  async getOptions(activeUser: ActiveUser): Promise<PrimaryEmailOptionsResponse> {
    const user = await this.userService.findOneUserAuthModel(activeUser.id);
    const authAccounts = await this.authRepository.findManyByUserId(activeUser.id);

    const emailOptions: Record<string, PrimaryEmailOption> = {};

    for (const authAccount of authAccounts) {
      const emailOption = emailOptions[authAccount.email];

      if (emailOption) {
        emailOption.providers.push(authAccount.provider);
        continue;
      }

      emailOptions[authAccount.email] = {
        email: authAccount.email,
        providers: [authAccount.provider],
        isPrimary: authAccount.email === user.email,
      };
    }

    return {
      primaryEmail: user.email,
      emails: emailOptions ? Array.from(Object.values(emailOptions)) : [],
    };
  }

  async update(
    activeUser: ActiveUser,
    updatePrimaryEmailDto: UpdatePrimaryEmailDto,
  ): Promise<UpdatePrimaryEmailResponse> {
    const authAccounts = await this.authRepository.findManyByUserId(activeUser.id);
    const canUseEmailAsPrimary = authAccounts.some(
      (authAccount) => authAccount.email === updatePrimaryEmailDto.email,
    );

    if (!canUseEmailAsPrimary) {
      throw new BadRequestException('Primary email must belong to one of your auth accounts');
    }

    await this.userService.updatePrimaryEmail(activeUser.id, updatePrimaryEmailDto.email);

    return {
      message: 'Primary email updated successfully',
      primaryEmail: updatePrimaryEmailDto.email,
    };
  }
}
