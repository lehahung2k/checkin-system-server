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

@Controller('guests')
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

  @Post('/add-guest')
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

  @Get('/details')
  @Role('admin', 'tenant', 'poc')
  @ApiBearerAuth()
  async getGuestById(@Res() res, @Query('guestId') guestId: number) {
    const guest = await this.guestsService.getGuestById(guestId);
    res
      .status(HttpStatus.OK)
      .json({ message: SUCCESS_RESPONSE, payload: guest });
  }
}
