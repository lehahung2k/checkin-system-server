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
  DELETE_FAILED,
  EVENT_NOT_FOUND,
  POC_NOT_FOUND,
  UN_RECOGNIZED_TENANT,
} from 'src/utils/message.utils';
import { plainToInstance } from 'class-transformer';
import { Tenants } from 'src/tenants/entities/tenants.entity';
import { AccountsRepository } from 'src/accounts/repository/accounts.repository';
import { EventResponseDto } from '../dto/event-response.dto';
import { PointsOfCheckinService } from '../../points-of-checkin/services/point-of-checkin.service';
import { UpdateEventDto } from '../dto/update-event.dto';

@Injectable()
export class EventsManagerService {
  constructor(
    private readonly eventsMngRepo: EventsManagerRepository,
    private readonly accountsRepo: AccountsRepository,
    private readonly pocService: PointsOfCheckinService,
  ) {}

  async getAllEvents(): Promise<EventResponseDto[]> {
    const events = await this.eventsMngRepo.find({ relations: ['tenantCode'] });
    return await Promise.all(
      events.map(async (event) => this.transformEvent(event)),
    );
  }

  async getEventsByTenant(userId: number): Promise<EventResponseDto[]> {
    const tenant = await this.findTenantByUserId(userId);
    if (!tenant) throw new NotFoundException(UN_RECOGNIZED_TENANT);
    const tenantCode: string = tenant.tenantCode;
    try {
      const events = await this.eventsMngRepo
        .createQueryBuilder('EventsManager')
        .leftJoinAndSelect('EventsManager.tenantCode', 'tenantCode')
        .where('EventsManager.tenantCode = :tenantCode', { tenantCode })
        .getMany();
      return await Promise.all(
        events.map(async (event) => this.transformEvent(event)),
      );
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
        .leftJoinAndSelect('EventsManager.tenantCode', 'tenantCode')
        .where('EventsManager.tenantCode = :tenantCode', { tenantCode })
        .andWhere('EventsManager.eventId = :eventId', { eventId })
        .getOne();
      return await this.transformEvent(event);
    } catch (e) {
      console.log(e);
      throw new NotFoundException(EVENT_NOT_FOUND);
    }
  }

  async getEventDetailsByEventCode(
    userId: number,
    eventCode: string,
  ): Promise<EventResponseDto> {
    const account = await this.accountsRepo.findOne({
      where: { userId },
    });
    if (!account) throw new NotFoundException(UN_RECOGNIZED_TENANT);
    const tenantCode: string = account.tenantCode;
    try {
      const event = await this.eventsMngRepo
        .createQueryBuilder('EventsManager')
        .leftJoinAndSelect('EventsManager.tenantCode', 'tenantCode')
        .where('EventsManager.tenantCode = :tenantCode', { tenantCode })
        .andWhere('EventsManager.eventCode = :eventCode', { eventCode })
        .getOne();
      return await this.transformEvent(event);
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
    const startTime = new Date(newEvent.startTime);
    const endTime = new Date(newEvent.endTime);
    const addEvent = plainToInstance(EventsManager, {
      ...newEvent,
      startTime,
      endTime,
      enabled: true,
    });

    try {
      return await this.eventsMngRepo.save(addEvent);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(BAD_REQUEST_RES);
    }
  }
  async getEventByPointCode(
    userId: number,
    pointCode: string,
  ): Promise<EventResponseDto> {
    const poc = await this.pocService.getPocDetails(userId, pointCode);
    if (!poc) throw new NotFoundException(POC_NOT_FOUND);
    // tìm event theo pointCode dựa vào quan hệ giữa event và poc
    const event = await this.eventsMngRepo
      .createQueryBuilder('EventsManager')
      .where('EventsManager.eventCode = :eventCode', {
        eventCode: poc.eventCode,
      })
      .getOne();
    return this.transformEvent(event);
  }

  async updateEvent(
    userId: number,
    eventId: number,
    updateEvent: Partial<UpdateEventDto>,
  ) {
    const tenant = await this.findTenantByUserId(userId);
    if (!tenant) throw new NotFoundException(UN_RECOGNIZED_TENANT);
    const tenantCode: string = tenant.tenantCode;
    // truy vấn event theo tenantCode và eventId
    const event = await this.eventsMngRepo
      .createQueryBuilder('EventsManager')
      .where('EventsManager.tenantCode = :tenantCode', { tenantCode })
      .andWhere('EventsManager.eventId = :eventId', { eventId })
      .getOne();
    if (!event) throw new NotFoundException(EVENT_NOT_FOUND);
    updateEvent.startTime = new Date(updateEvent.startTime);
    updateEvent.endTime = new Date(updateEvent.endTime);
    // update event theo các dữ liệu được truyền vào
    Object.assign(event, updateEvent);
    await this.eventsMngRepo.save(event);
  }

  async deleteEvent(userId: number, eventId: number) {
    const tenant = await this.findTenantByUserId(userId);
    if (!tenant) throw new NotFoundException(UN_RECOGNIZED_TENANT);
    const tenantCode: string = tenant.tenantCode;
    // tìm event theo tenantCode và eventId
    const event = await this.eventsMngRepo
      .createQueryBuilder('EventsManager')
      .where('EventsManager.tenantCode = :tenantCode', { tenantCode })
      .andWhere('EventsManager.eventId = :eventId', { eventId })
      .getOne();
    if (!event) throw new NotFoundException(EVENT_NOT_FOUND);
    // kiểm tra xem event có đang có các poc nào không
    const poc = await this.pocService.getPocListByEventCode(event.eventCode);
    if (poc.length > 0) throw new BadRequestException(DELETE_FAILED);
    // xóa event
    try {
      await this.eventsMngRepo.delete(event.eventId);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(DELETE_FAILED);
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

  // Chuyển đổi dữ liệu trả về
  private transformEvent(event: EventsManager): EventResponseDto {
    const base64Image = event.eventImg
      ? Buffer.from(event.eventImg).toString('utf8')
      : '';
    return plainToInstance(EventResponseDto, {
      ...event,
      tenantCode: event.tenantCode?.tenantCode,
      eventImg: base64Image,
    });
  }
}
