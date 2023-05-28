import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventsManagerRepository } from './events-manager.repository';
import { NewEventDto } from './dto/new-event.dto';
import { EventsManager } from './events-manager.entity';
import { TenantsRepository } from 'src/tenants/tenants.repository';
import { BAD_REQUEST_RES, UN_RECOGNIZED_TENANT } from 'src/utils/message.utils';

@Injectable()
export class EventsManagerService {
  constructor(
    private readonly eventsMngRepo: EventsManagerRepository,
    private readonly tenantRepo: TenantsRepository,
  ) {}

  async getAllEvents(): Promise<EventsManager[]> {
    return this.eventsMngRepo.find();
  }

  async addNewEvent(newEvent: NewEventDto) {
    const tenantCode = newEvent.tenantCode;
    const tenantCodeCheck = await this.tenantRepo.findOne({
      where: { tenantCode },
    });

    console.log(tenantCodeCheck);

    if (!tenantCodeCheck) throw new NotFoundException(UN_RECOGNIZED_TENANT);

    const addNew: {
      eventCode: string;
      eventDescription: string;
      eventName: string;
      startTime: Date;
      eventImg: Buffer;
      tenantCode: string;
      endTime: Date;
      enabled: boolean;
    } = {
      ...newEvent,
      enabled: true,
    };
    try {
      // await this.eventsMngRepo.save(addNew);
      console.log(addNew);
      console.log(typeof addNew);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(BAD_REQUEST_RES);
    }
  }
}
