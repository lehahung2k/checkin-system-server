import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PointOfCheckinRepository } from '../repository/point-of-checkin.repository';
import { PointsOfCheckin } from '../entities/point-of-checkin.entity';
import { PointsOfCheckinDto } from '../dto/points-of-checkin.dto';
import { EventsManagerRepository } from 'src/events-manager/repository/events-manager.repository';
import { AccountsRepository } from 'src/accounts/repository/accounts.repository';
import { plainToInstance } from 'class-transformer';
import { EVENT_NOT_FOUND } from 'src/utils/message.utils';

@Injectable()
export class PointOfCheckinService {
  constructor(
    private readonly pointOfCheckinRepo: PointOfCheckinRepository,
    private readonly eventsManagerRepo: EventsManagerRepository,
    private readonly accountsRepo: AccountsRepository,
  ) {}

  async getAllPointsOfCheckin(): Promise<PointsOfCheckin[]> {
    return await this.pointOfCheckinRepo.find();
  }

  async getPointOfCheckinById(pointId: number): Promise<PointsOfCheckin> {
    return await this.pointOfCheckinRepo.findOne({
      where: { pointId: pointId },
    });
  }

  async createPointOfCheckin(
    newPoint: PointsOfCheckinDto,
    userId: number,
  ): Promise<PointsOfCheckin> {
    const event = await this.eventsManagerRepo.findOne({
      where: { eventCode: newPoint.eventCode },
    });
    if (!event) throw new NotFoundException(EVENT_NOT_FOUND);
    const user = await this.accountsRepo.findOne({
      where: { userId: userId },
    });
    newPoint.username = user.username;
    try {
      const addPoint = plainToInstance(PointsOfCheckin, {
        ...newPoint,
        enabled: true,
      });
      return await this.pointOfCheckinRepo.save(addPoint);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(EVENT_NOT_FOUND);
    }
  }
}
