import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../../auth/role.guard';
import { GuestsService } from '../services/guests.service';
import { Role } from '../../auth/role.decorator';

@Controller('guests')
@ApiTags('Guests')
@UseGuards(RoleGuard)
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get('')
  @Role('admin', 'tenant', 'poc')
  @ApiBearerAuth()
  async getAllGuests() {
    return this.guestsService.getAllGuests();
  }
}
