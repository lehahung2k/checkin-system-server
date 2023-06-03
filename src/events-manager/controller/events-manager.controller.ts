import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/role.guard';
import {
  ADD_SUCCESS,
  BAD_REQUEST_RES,
  SUCCESS_RESPONSE,
  UN_RECOGNIZED_TENANT,
} from 'src/utils/message.utils';
import { EventsManagerService } from '../services/events-manager.service';
import { Role } from 'src/auth/role.decorator';
import { NewEventDto } from '../dto/new-event.dto';

@ApiTags('Events Manager')
@Controller('api/events-manager')
@UseGuards(RoleGuard)
export class EventsManagerController {
  constructor(private readonly eventService: EventsManagerService) {}

  @Get()
  @Role('admin')
  @ApiBearerAuth()
  async getEvents(@Res() res: any): Promise<void> {
    const allEvents = await this.eventService.getAllEvents();
    return await res
      .status(HttpStatus.OK)
      .json({ message: SUCCESS_RESPONSE, payload: allEvents });
  }

  @Post('/add-event')
  @Role('admin', 'tenant')
  @ApiBearerAuth()
  async addEvent(@Body() newEvent: NewEventDto, @Res() res, @Req() req) {
    try {
      const newEventData = await this.eventService.addNewEvent(newEvent);
      res
        .status(HttpStatus.OK)
        .json({ message: ADD_SUCCESS, payload: newEventData });
    } catch (error) {
      console.log(error);
      let message = BAD_REQUEST_RES;
      if (error.message == UN_RECOGNIZED_TENANT) message = UN_RECOGNIZED_TENANT;
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }
}
