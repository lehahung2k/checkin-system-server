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
    const addNewTenant = this.tenantsRepository.create({
      ...newTenant,
      enabled: true,
    });

    try {
      return await this.tenantsRepository.save(addNewTenant);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(BAD_REQUEST_RES);
    }
  }
}
