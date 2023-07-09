import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountsRepository } from '../repository/accounts.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountResDto } from '../dto/account-res.dto';
import { Accounts } from '../entities/accounts.entity';
import { Tenants } from '../../tenants/entities/tenants.entity';
import { INCORRECT_PASSWORD } from '../../utils/message.utils';
import { comparePassword, hashPassword } from '../../utils/algorithm.utils';
import { UpdateProfileDto } from '../dto/update-profile.dto';

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

  async getAccountById(userId: number): Promise<AccountResDto> {
    const account = await this.usersRepository
      .createQueryBuilder('account')
      .where('account.userId = :userId', { userId })
      .getOne();
    // change to accountResDto
    return this.mapAccountToResponse(account);
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
    if (!poc) throw new NotFoundException();
    return this.mapAccountToResponse(poc);
  }

  async getAllAccountTenant(): Promise<AccountResDto[]> {
    const listTenant = await this.usersRepository
      .createQueryBuilder('account')
      .where('account.role = :role', { role: 'tenant' })
      .getMany();
    return this.mappingResponse(listTenant);
  }

  async updateProfile(
    userId: number,
    updateProfileDto: Partial<UpdateProfileDto>,
  ) {
    const account = await this.usersRepository
      .createQueryBuilder('account')
      .where('account.userId = :userId', { userId })
      .getOne();
    if (!account) throw new NotFoundException();
    Object.assign(account, updateProfileDto);
    console.log(account);
    await this.usersRepository.save(account);
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const account = await this.usersRepository
      .createQueryBuilder('account')
      .where('account.userId = :userId', { userId })
      .getOne();
    if (!account) throw new NotFoundException();
    const checkPass = await comparePassword(oldPassword, account.password);
    if (!checkPass) throw new BadRequestException(INCORRECT_PASSWORD);
    account.password = await hashPassword(newPassword);
    await this.usersRepository.save(account);
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

  mapAccountToResponse(account: Accounts): AccountResDto {
    return {
      userId: account.userId,
      username: account.username,
      fullName: account.fullName,
      phoneNumber: account.phoneNumber,
      email: account.email,
      active: account.active,
      role: account.role,
      tenantCode: account.tenantCode,
      companyName: account.companyName,
      enabled: account.enabled,
    };
  }

  mappingResponse(accountRes: Accounts[]): AccountResDto[] {
    return accountRes.map((res) => this.mapAccountToResponse(res));
  }
}
