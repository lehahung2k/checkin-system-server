import { BadRequestException, Injectable } from '@nestjs/common';
import { TenantsRepository } from './tenants.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenants } from './tenants.entity';
import { AddTenantDto } from './dto/add-tenant.dto';
import { BAD_REQUEST_RES } from '../utils/message.utils';
import { AccountsRepository } from '../accounts/accounts.repository';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(TenantsRepository)
    private readonly tenantsRepository: TenantsRepository,
    @InjectRepository(AccountsRepository)
    private readonly accountRepo: AccountsRepository,
  ) {}

  async getAllTenants(): Promise<Tenants[]> {
    return await this.tenantsRepository.find();
  }

  async addTenant(newTenant: AddTenantDto, userId: number): Promise<Tenants> {
    const userAccount = await this.accountRepo.findOne({ where: { userId } });
    const addNewTenant = this.tenantsRepository.create({
      ...newTenant,
      enabled: true,
    });
    if (!userAccount.tenants) {
      userAccount.tenants = []; // Tạo mảng trống nếu chưa được khởi tạo
    }
    userAccount.tenants.push(addNewTenant);
    try {
      await this.tenantsRepository.save(addNewTenant);
      await this.accountRepo.save(userAccount);

      return addNewTenant;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(BAD_REQUEST_RES);
    }
  }
}
