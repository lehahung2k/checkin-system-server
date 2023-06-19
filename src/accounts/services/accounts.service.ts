import { Injectable } from '@nestjs/common';
import { AccountsRepository } from '../repository/accounts.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountResDto } from '../dto/account-res.dto';
import { Accounts } from '../entities/accounts.entity';
import { Tenants } from '../../tenants/entities/tenants.entity';

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

  // Tìm toàn bộ POC đã đăng ký với tenantCode được doanh nghiệp cung cấp
  async getAllPoc(userId: number): Promise<AccountResDto[]> {
    const tenant = await this.findTenantByUserId(userId);
    const listPoc = await this.usersRepository
      .createQueryBuilder('account')
      .where('account.role = :role', { role: 'poc' })
      .getMany();
    // Nếu tenantCode của POC trùng với tenantCode của doanh nghiệp thì trả đẩy tenant vào listPoc và trả về
    const pocsAccounts = listPoc.filter(
      (poc) => poc.tenantCode === tenant.tenantCode,
    );
    return this.mappingResponse(pocsAccounts);
  }

  async getPocByUsername(userId: number, username: string) {
    const tenant = await this.findTenantByUserId(userId);
    const poc = await this.usersRepository.findOne({
      where: { username: username, tenantCode: tenant.tenantCode, role: 'poc' },
    });
    return poc;
  }

  async getAllAccountTenant(): Promise<AccountResDto[]> {
    const listTenant = await this.usersRepository
      .createQueryBuilder('account')
      .where('account.role = :role', { role: 'tenant' })
      .getMany();
    return this.mappingResponse(listTenant);
  }

  // Tìm kiếm tenant theo userId dựa vào quan hệ nhiều nhiều của bảng accounts và tenants
  async findTenantByUserId(userId: number): Promise<Tenants> {
    const account = await this.usersRepository
      .createQueryBuilder('Accounts')
      .leftJoinAndSelect('Accounts.tenants', 'tenants')
      .where('Accounts.userId = :userId', { userId })
      .getOne();
    return account.tenants[0];
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
