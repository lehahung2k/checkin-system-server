import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TenantsRepository } from '../repository/tenants.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenants } from '../entities/tenants.entity';
import { AddTenantDto } from '../dto/add-tenant.dto';
import { BAD_REQUEST_RES, TENANT_NOT_FOUND } from '../../utils/message.utils';
import { AccountsRepository } from '../../accounts/repository/accounts.repository';
import { UpdateTenantDto } from '../dto/update-tenant.dto';
import { AccountsService } from "../../accounts/services/accounts.service";

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
    newTenant.tenantName = userAccount.companyName;
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

  // Lấy thông tin tenant theo id của user
  // Kiểm tra xem đối tác này đã tạo tenant hay chưa
  async checkTenantByUser(userId: number): Promise<Tenants> {
    try {
      const checkUser = await this.accountRepo.findOne({
        where: { userId },
      });
      const tenantName = checkUser.companyName;
      return await this.tenantsRepository.findOne({
        where: { tenantName },
      });
    } catch (err) {
      console.log(err);
      throw new NotFoundException(TENANT_NOT_FOUND);
    }
  }

  async updateTenant(
    userId: number,
    updateTenant: Partial<UpdateTenantDto>,
  ): Promise<void> {
    const tenant = await this.findTenantByUserId(userId);
    if (!tenant) {
      throw new NotFoundException(TENANT_NOT_FOUND);
    }
    Object.assign(tenant, updateTenant);
    await this.tenantsRepository.save(tenant);
  }

  // Kiểm tra tenant đã tồn tai hay chưa bằng tên tenant
  async checkTenantByName(tenantName: string): Promise<Tenants> {
    try {
      return await this.tenantsRepository.findOne({ where: { tenantName } });
    } catch (err) {
      console.log(err);
      throw new NotFoundException(TENANT_NOT_FOUND);
    }
  }

  // Tìm kiếm tenant theo userId dựa vào quan hệ nhiều nhiều của bảng accounts và tenants
  async findTenantByUserId(userId: number): Promise<Tenants> {
    const account = await this.accountRepo
      .createQueryBuilder('Accounts')
      .leftJoinAndSelect('Accounts.tenants', 'tenants')
      .where('Accounts.userId = :userId', { userId })
      .getOne();
    return account.tenants[0];
  }
}
