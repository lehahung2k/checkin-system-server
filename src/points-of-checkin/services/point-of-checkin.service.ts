import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PointsOfCheckinRepository } from '../repository/point-of-checkin.repository';
import { PointsOfCheckin } from '../entities/points-of-checkin.entity';
import { PointsOfCheckinDto } from '../dto/points-of-checkin.dto';
import { EventsManagerRepository } from 'src/events-manager/repository/events-manager.repository';
import { AccountsRepository } from 'src/accounts/repository/accounts.repository';
import { plainToInstance } from 'class-transformer';
import { EVENT_NOT_FOUND } from 'src/utils/message.utils';
import { AccountsService } from '../../accounts/services/accounts.service';

@Injectable()
export class PointsOfCheckinService {
  constructor(
    private readonly pointsOfCheckinRepo: PointsOfCheckinRepository,
    private readonly eventsManagerRepo: EventsManagerRepository,
    private readonly accountsRepo: AccountsRepository,
    private readonly accountsService: AccountsService,
  ) {}

  async getAllPointsOfCheckin(): Promise<PointsOfCheckin[]> {
    return await this.pointsOfCheckinRepo.find();
  }

  async getPointOfCheckinById(pointId: number): Promise<PointsOfCheckin> {
    return await this.pointsOfCheckinRepo.findOne({
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
      return await this.pointsOfCheckinRepo.save(addPoint);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(EVENT_NOT_FOUND);
    }
  }

  async getPointOfCheckinByUsername(
    userId: number,
  ): Promise<PointsOfCheckin[]> {
    const pocAccounts = await this.accountsService.getAllPoc(userId);
    const usernames = pocAccounts.map((account) => account.username);
    // Lấy tất cả points of checkin có username trùng với username của list pocAccount (mỗi pocAccount có 1 username)
    try {
      const listPointOfCheckin = await this.pointsOfCheckinRepo
        .createQueryBuilder('pointOfCheckin')
        .where('pointOfCheckin.username IN (:...usernames)', { usernames })
        .getMany();
      console.log(listPointOfCheckin);
      return listPointOfCheckin;
    } catch (error) {
      console.log(error);
    }
  }
}
