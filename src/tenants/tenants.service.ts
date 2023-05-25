import { BadRequestException, Injectable } from '@nestjs/common';
import { TenantsRepository } from './tenants.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenants } from './tenants.entity';
import { AddTenantDto } from './dto/add-tenant.dto';
import { BAD_REQUEST_RES } from '../utils/message.utils';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(TenantsRepository)
    private readonly tenantsRepository: TenantsRepository,
  ) {}

  async getAllTenants(): Promise<Tenants[]> {
    return await this.tenantsRepository.find();
  }

  async addTenant(newTenant: AddTenantDto): Promise<Tenants> {
    const addNewTenant: {
      website: string;
      tenantName: string;
      tenantAddress: string;
      contactEmail: string;
      contactName: string;
      tenantCode: string;
      contactPhone: string;
      enabled: boolean;
    } = {
      ...newTenant,
      enabled: true,
    };
    try {
      return await this.tenantsRepository.save(addNewTenant);
    } catch (err) {
      throw new BadRequestException(BAD_REQUEST_RES);
    }
  }
}
