import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PointOfCheckinService } from '../services/point-of-checkin.service';

@ApiTags('Points of Checkin')
@Controller('point-of-checkin')
export class PointOfCheckinController {
  constructor(private readonly pocService: PointOfCheckinService) {}
}
