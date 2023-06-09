import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../../auth/role.guard';
import { GuestsService } from '../services/guests.service';
import { Role } from '../../auth/role.decorator';
import { SUCCESS_RESPONSE } from 'src/utils/message.utils';
import { GuestsDto } from '../dto/guests.dto';

@Controller('api/guests')
@ApiTags('Guests')
@UseGuards(RoleGuard)
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get('')
  @Role('admin', 'tenant', 'poc')
  @ApiBearerAuth()
  async getAllGuests(@Res() res) {
    const guests = await this.guestsService.getAllGuests();
    res
      .status(HttpStatus.OK)
      .json({ message: SUCCESS_RESPONSE, payload: guests });
  }

  @Post('event/checkin')
  @Role('poc')
  @ApiBearerAuth()
  async addGuest(@Body() newGuest: GuestsDto, @Res() res) {
    try {
      const guest = await this.guestsService.createGuest(newGuest);
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: guest });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get('event/details')
  @Role('tenant', 'poc')
  @ApiBearerAuth()
  async getGuestByGuestCode(@Res() res, @Query('guestCode') guestCode: string) {
    const guest = await this.guestsService.getGuestByCode(guestCode);
    res
      .status(HttpStatus.OK)
      .json({ message: SUCCESS_RESPONSE, payload: guest });
  }

  @Get('event/list-guests')
  @Role('tenant', 'poc')
  @ApiBearerAuth()
  async getAllGuestsByPointCode(
    @Query('pointCode') pointCode: string,
    @Res() res,
  ) {
    try {
      const guests = await this.guestsService.getAllGuestsByPointCode(
        pointCode,
      );
      res.status(HttpStatus.OK).json({
        message: SUCCESS_RESPONSE,
        count: guests.length,
        payload: guests,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
