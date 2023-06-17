import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventsManagerRepository } from '../repository/events-manager.repository';
import { NewEventDto } from '../dto/new-event.dto';
import { EventsManager } from '../entities/events-manager.entity';
import {
  BAD_REQUEST_RES,
  EVENT_NOT_FOUND,
  UN_RECOGNIZED_TENANT,
} from 'src/utils/message.utils';
import { plainToInstance } from 'class-transformer';
import { Tenants } from 'src/tenants/entities/tenants.entity';
import { AccountsRepository } from 'src/accounts/repository/accounts.repository';
import { EventResponseDto } from '../dto/event-response.dto';

@Injectable()
export class EventsManagerService {
  constructor(
    private readonly eventsMngRepo: EventsManagerRepository,
    private readonly accountsRepo: AccountsRepository,
  ) {}

  async getAllEvents(): Promise<EventsManager[]> {
    return this.eventsMngRepo.find();
  }

  async getEventsByTenant(userId: number): Promise<EventsManager[]> {
    const tenant = await this.findTenantByUserId(userId);
    if (!tenant) throw new NotFoundException(UN_RECOGNIZED_TENANT);
    const tenantCode: string = tenant.tenantCode;
    try {
      return await this.eventsMngRepo
        .createQueryBuilder('EventsManager')
        .where('EventsManager.tenantCode = :tenantCode', { tenantCode })
        .getMany();
    } catch (e) {
      console.log(e);
      throw new NotFoundException(EVENT_NOT_FOUND);
    }
  }

  async getEventDetails(
    userId: number,
    eventId: number,
  ): Promise<EventResponseDto> {
    const tenant = await this.findTenantByUserId(userId);
    if (!tenant) throw new NotFoundException(UN_RECOGNIZED_TENANT);
    const tenantCode: string = tenant.tenantCode;
    try {
      const event = await this.eventsMngRepo
        .createQueryBuilder('EventsManager')
        .where('EventsManager.tenantCode = :tenantCode', { tenantCode })
        .andWhere('EventsManager.eventId = :eventId', { eventId })
        .getOne();
      let base64Image = '';
      if (event.eventImg)
        base64Image = Buffer.from(event.eventImg).toString('utf8');
      const eventRes = plainToInstance(EventResponseDto, {
        ...event,
        eventImg: base64Image,
      });
      return eventRes;
    } catch (e) {
      console.log(e);
      throw new NotFoundException(EVENT_NOT_FOUND);
    }
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
    return account.tenants[0];
  }
}
