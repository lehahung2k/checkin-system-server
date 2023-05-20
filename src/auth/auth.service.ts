import { Injectable } from '@nestjs/common';
import { AccountsRepository } from '../accounts/accounts.repository';
import { AddAccountDto } from '../accounts/dto/add-account.dto';
import { Accounts } from '../accounts/accounts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from '../utils/algorithm.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Accounts)
    private readonly accountRepo: AccountsRepository,
  ) {}

  async createAccount(addNewAccount: AddAccountDto): Promise<Accounts> {
    const encryptPass = await hashPassword(addNewAccount.password);

    const newAccount: {
      password: any;
      phoneNumber: string;
      role: string;
      companyName: string;
      fullName: string;
      active: number;
      tenantCode: string;
      email: string;
      enabled: boolean;
      username: string;
    } = {
      ...addNewAccount,
      password: encryptPass,
      active: 1,
      enabled: true,
    };
    return await this.accountRepo.save(newAccount);
  }
  async isEmailTaken(email: string): Promise<boolean> {
    const existingAccount = await this.accountRepo.findOne({
      where: { email },
    });
    return !!existingAccount;
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const existingAccount = await this.accountRepo.findOne({
      where: { username },
    });
    return !!existingAccount;
  }
}
