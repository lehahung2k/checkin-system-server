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
import { PointsOfCheckinService } from '../services/point-of-checkin.service';
import {
  ERROR_RESPONSE,
  POC_NOT_FOUND,
  SUCCESS_RESPONSE,
} from 'src/utils/message.utils';
import { Role } from 'src/auth/role.decorator';
import { PointsOfCheckinDto } from '../dto/points-of-checkin.dto';
import { RoleGuard } from 'src/auth/role.guard';

@ApiTags('Points of Checkin')
@Controller('api/point-of-checkin')
@UseGuards(RoleGuard)
export class PointsOfCheckinController {
  constructor(private readonly pocService: PointsOfCheckinService) {}

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
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get('/poc')
  @Role('tenant')
  @ApiBearerAuth()
  async getAllPoc(@Res() res: any, @Req() req: any): Promise<void> {
    try {
      const userId = parseInt(req.userId);
      const poc = await this.pocService.getPointsOfCheckinByUsername(userId);
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: poc });
    } catch (error) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: POC_NOT_FOUND, payload: null });
    }
  }

  @Get('/poc/view')
  @Role('tenant')
  @ApiBearerAuth()
  async getPocByUsername(
    @Query('username') username: string,
    @Res() res: any,
    @Req() req: any,
  ): Promise<void> {
    try {
      const userId = parseInt(req.userId);
      const poc = await this.pocService.getPocByUsername(userId, username);
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: poc });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_RESPONSE, payload: null });
    }
  }

  @Get('/poc/list-poc')
  @Role('poc')
  @ApiBearerAuth()
  async getPocListByPoc(@Res() res, @Req() req) {
    try {
      const userId = parseInt(req.userId);
      const poc = await this.pocService.getPocListByPoc(userId);
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: poc });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_RESPONSE, payload: null });
    }
  }

  @Get('/poc/details')
  @Role('poc')
  @ApiBearerAuth()
  async getPocDetails(
    @Res() res: any,
    @Req() req: any,
    @Query('pointCode') pointCode: string,
  ): Promise<void> {
    try {
      const userId = parseInt(req.userId);
      const poc = await this.pocService.getPocDetails(userId, pointCode);
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: poc });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message, payload: null });
    }
  }
}
