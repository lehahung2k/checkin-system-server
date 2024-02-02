import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../../auth/role.guard';
import {
  ADD_SUCCESS,
  BAD_REQUEST_RES,
  DELETE_DATA_SUCCESS,
  SUCCESS_RESPONSE,
  UN_RECOGNIZED_TENANT,
  UPDATE_INFO_SUCCESS,
} from '../../utils/message.utils';
import { EventsManagerService } from '../services/events-manager.service';
import { NewEventDto } from '../dto/new-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { Role } from '../../auth/role.decorator';

@ApiTags('Events Manager')
@Controller('api/events-manager')
@UseGuards(RoleGuard)
export class EventsManagerController {
  constructor(private readonly eventService: EventsManagerService) {}

  @Get()
  @Role('admin')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách sự kiện bởi admin',
  })
  async getEvents(@Res() res: any): Promise<void> {
    const allEvents = await this.eventService.getAllEvents();
    res
      .status(HttpStatus.OK)
      .json({ message: SUCCESS_RESPONSE, payload: allEvents });
  }

  @Post('/add-event')
  @Role('tenant')
  @ApiBearerAuth()
  @ApiBody({ type: NewEventDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Thêm sự kiện mới với quyền đối tác',
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách sự kiện bởi đối tác',
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xem chi tiết sự kiện bởi mã sự kiện với quyền đối tác',
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xem chi tiết sự kiện bởi mã sự kiện với quyền quản lý quầy',
  })
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

  @Get('/events/poc-code')
  @Role('poc')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy sự kiện bởi mã quầy với quyền quản lý quầy',
  })
  async getEventByPointCode(
    @Res() res: any,
    @Req() req: any,
    @Query('pointCode') pointCode: string,
  ) {
    const userId = parseInt(req.userId);
    try {
      const event = await this.eventService.getEventByPointCode(
        userId,
        pointCode,
      );
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: event });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }

  @Patch('/events/update')
  @Role('tenant')
  @ApiBearerAuth()
  async updateEvent(
    @Res() res: any,
    @Req() req: any,
    @Query('eventId') eventId: number,
    @Body() updateEvent: Partial<UpdateEventDto>,
  ): Promise<void> {
    try {
      const userId = parseInt(req.userId);
      const updatedEvent = await this.eventService.updateEvent(
        userId,
        eventId,
        updateEvent,
      );
      res
        .status(HttpStatus.OK)
        .json({ message: UPDATE_INFO_SUCCESS, payload: updatedEvent });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Delete('/events/delete')
  @Role('tenant')
  @ApiBearerAuth()
  async deleteEvent(
    @Res() res: any,
    @Req() req: any,
    @Query('eventId') eventId: number,
  ) {
    try {
      const userId = parseInt(req.userId);
      await this.eventService.deleteEvent(userId, eventId);
      res.status(HttpStatus.OK).json({ message: DELETE_DATA_SUCCESS });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
