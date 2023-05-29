import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventsManagerRepository } from '../repository/events-manager.repository';
import { NewEventDto } from '../dto/new-event.dto';
import { EventsManager } from '../entities/events-manager.entity';
import { TenantsRepository } from 'src/tenants/repository/tenants.repository';
import { BAD_REQUEST_RES, UN_RECOGNIZED_TENANT } from 'src/utils/message.utils';
import { plainToInstance } from "class-transformer";

@Injectable()
export class EventsManagerService {
  constructor(
    private readonly eventsMngRepo: EventsManagerRepository,
    private readonly tenantRepo: TenantsRepository,
  ) {}

  async getAllEvents(): Promise<EventsManager[]> {
    return this.eventsMngRepo.find();
  }

  async addNewEvent(newEvent: NewEventDto): Promise<EventsManager> {
    if (!(await this.checkTenantCode(newEvent.tenantCode)))
      throw new NotFoundException(UN_RECOGNIZED_TENANT);
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

  async checkTenantCode(tenantCode: string): Promise<boolean> {
    const findTenantCode = await this.tenantRepo.findOne({
      where: { tenantCode },
    });
    return !!findTenantCode;
  }
}
