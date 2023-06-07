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
import { PointOfCheckinService } from '../services/point-of-checkin.service';
import { EVENT_NOT_FOUND, SUCCESS_RESPONSE } from 'src/utils/message.utils';
import { Role } from 'src/auth/role.decorator';
import { PointsOfCheckinDto } from '../dto/points-of-checkin.dto';
import { RoleGuard } from 'src/auth/role.guard';

@ApiTags('Points of Checkin')
@Controller('point-of-checkin')
@UseGuards(RoleGuard)
export class PointOfCheckinController {
  constructor(private readonly pocService: PointOfCheckinService) {}

  @Get('')
  @Role('admin', 'tenant')
  @ApiBearerAuth()
  async getAllPointsOfCheckin(@Res() res) {
    const points = await this.pocService.getAllPointsOfCheckin();
    res
      .status(HttpStatus.OK)
      .json({ message: SUCCESS_RESPONSE, payload: points });
  }

  @Post('/create')
  @Role('tenant', 'poc')
  @ApiBearerAuth()
  async createPointOfCheckin(
    @Body() newPoint: PointsOfCheckinDto,
    @Res() res,
    @Req() req,
  ) {
    try {
      const userId = parseInt(req.userId);
      const newPointData = await this.pocService.createPointOfCheckin(
        newPoint,
        userId,
      );
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: newPointData });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.BAD_REQUEST).json({ message: EVENT_NOT_FOUND });
    }
  }
}
