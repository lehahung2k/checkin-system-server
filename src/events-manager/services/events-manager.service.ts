import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventsManagerRepository } from '../repository/events-manager.repository';
import { NewEventDto } from '../dto/new-event.dto';
import { EventsManager } from '../entities/events-manager.entity';
import { BAD_REQUEST_RES, UN_RECOGNIZED_TENANT } from 'src/utils/message.utils';
import { plainToInstance } from 'class-transformer';
import { Tenants } from 'src/tenants/entities/tenants.entity';
import { AccountsRepository } from 'src/accounts/repository/accounts.repository';

@Injectable()
export class EventsManagerService {
  constructor(
    private readonly eventsMngRepo: EventsManagerRepository,
    private readonly accountsRepo: AccountsRepository,
  ) {}

  async getAllEvents(): Promise<EventsManager[]> {
    return this.eventsMngRepo.find();
  }

  async addNewEvent(
    newEvent: NewEventDto,
    userId: number,
  ): Promise<EventsManager> {
    // Lấy thông tin của tenant dựa vào userId và gán tenantCode cho newEvent
    const tenant = await this.findTenantByUserId(userId);
    if (!tenant) throw new NotFoundException(UN_RECOGNIZED_TENANT);
    newEvent.tenantCode = tenant.tenantCode;
    const addEvent = plainToInstance(EventsManager, {
      ...newEvent,
      enabled: true,
    });
    console.log(addEvent);

    try {
      // Save the new event to the database
      return await this.eventsMngRepo.save(addEvent);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(BAD_REQUEST_RES);
    }
  }

  // Tìm kiếm tenant theo userId dựa vào quan hệ nhiều nhiều của bảng accounts và tenants
  async findTenantByUserId(userId: number): Promise<Tenants> {
    const account = await this.accountsRepo
      .createQueryBuilder('Accounts')
      .leftJoinAndSelect('Accounts.tenants', 'tenants')
      .where('Accounts.userId = :userId', { userId })
      .getOne();
    const tenant = account.tenants[0];
    return tenant;
  }
}
