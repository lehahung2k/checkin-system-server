import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../../auth/role.guard';
import { GuestsService } from '../services/guests.service';
import { Role } from '../../auth/role.decorator';
import {
  DELETE_ALL_GUEST_SUCCESS,
  DELETE_DATA_SUCCESS,
  SUCCESS_RESPONSE,
} from 'src/utils/message.utils';
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
  @ApiBody({ type: GuestsDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tính năng check-in',
  })
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

  @Delete('event/delete')
  @Role('tenant', 'poc')
  @ApiBearerAuth()
  async deleteGuest(@Query('guestId') guestId: number, @Res() res) {
    try {
      await this.guestsService.deleteGuest(guestId);
      res.status(HttpStatus.OK).json({
        message: DELETE_DATA_SUCCESS,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Delete('event/delete-all')
  @Role('tenant', 'poc')
  @ApiBearerAuth()
  async deleteAllGuests(@Query('pointCode') pointCode: string, @Res() res) {
    try {
      await this.guestsService.deleteAllGuests();
      res.status(HttpStatus.OK).json({
        message: DELETE_ALL_GUEST_SUCCESS,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
