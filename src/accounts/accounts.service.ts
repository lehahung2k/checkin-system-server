import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountResDto } from './dto/account-res.dto';
import { Accounts } from './accounts.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountsRepository)
    private usersRepository: AccountsRepository,
  ) {}
  async getAll(): Promise<AccountResDto[]> {
    const listAccount = await this.usersRepository.find();
    return this.mappingResponse(listAccount);
  }

  async getAllPoc(): Promise<AccountResDto[]> {
    const listPoc = await this.usersRepository
      .createQueryBuilder('account')
      .where('account.role = :role', { role: 'poc' })
      .getMany();
    return this.mappingResponse(listPoc);
  }

  mappingResponse(accountRes: Accounts[]): AccountResDto[] {
    return accountRes.map((res) => ({
      userId: res.userId,
      username: res.username,
      fullName: res.fullName,
      phoneNumber: res.phoneNumber,
      email: res.email,
      active: res.active,
      role: res.role,
      tenantCode: res.tenantCode,
      companyName: res.companyName,
      enabled: res.enabled,
    }));
  }
}
