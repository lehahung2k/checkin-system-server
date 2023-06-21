import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
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
    res
      .status(HttpStatus.OK)
      .json({ message: SUCCESS_RESPONSE, payload: allEvents });
  }

  @Post('/add-event')
  @Role('admin', 'tenant')
  @ApiBearerAuth()
  async addEvent(@Body() newEvent: NewEventDto, @Res() res, @Req() req) {
    try {
      const userId = parseInt(req.userId);
      const newEventData = await this.eventService.addNewEvent(
        newEvent,
        userId,
      );
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

  @Get('/events')
  @Role('tenant')
  @ApiBearerAuth()
  async getEventsByTenant(@Res() res: any, @Req() req: any): Promise<void> {
    const userId = parseInt(req.userId);
    const events = await this.eventService.getEventsByTenant(userId);
    res
      .status(HttpStatus.OK)
      .json({ message: SUCCESS_RESPONSE, payload: events });
  }

  @Get('/events/view')
  @Role('tenant')
  @ApiBearerAuth()
  async getEventDetails(
    @Res() res: any,
    @Req() req: any,
    @Query('eventId') eventId: number,
  ): Promise<void> {
    const userId = parseInt(req.userId);
    const event = await this.eventService.getEventDetails(userId, eventId);
    res
      .status(HttpStatus.OK)
      .json({ message: SUCCESS_RESPONSE, payload: event });
  }

  @Get('/events/poc-view')
  @Role('poc')
  @ApiBearerAuth()
  async getEventDetailsForPoc(
    @Res() res: any,
    @Req() req: any,
    @Query('eventCode') eventCode: string,
  ): Promise<void> {
    const userId = parseInt(req.userId);
    const event = await this.eventService.getEventDetailsByEventCode(
      userId,
      eventCode,
    );
    res
      .status(HttpStatus.OK)
      .json({ message: SUCCESS_RESPONSE, payload: event });
  }
}
