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
import { EVENT_NOT_FOUND, POC_NOT_FOUND } from 'src/utils/message.utils';
import { AccountsService } from '../../accounts/services/accounts.service';
import { PocResDto } from '../dto/poc-res.dto';

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

  async getPointsOfCheckinByUsername(userId: number): Promise<PocResDto[]> {
    const pocAccounts = await this.accountsService.getAllPoc(userId);
    const usernames = pocAccounts.map((account) => account.username);
    // Lấy tất cả points of checkin có username trùng với username của list pocAccount (mỗi pocAccount có 1 username)
    const listPointOfCheckin = await this.pointsOfCheckinRepo
      .createQueryBuilder('pointOfCheckin')
      .leftJoinAndSelect('pointOfCheckin.eventCode', 'eventCode')
      .leftJoinAndSelect('pointOfCheckin.username', 'username')
      .where('pointOfCheckin.username IN (:...usernames)', { usernames })
      .getMany();
    if (!listPointOfCheckin) throw new NotFoundException(POC_NOT_FOUND);
    return listPointOfCheckin.map((poc) => {
      return plainToInstance(PocResDto, {
        ...poc,
        eventCode: poc.eventCode.eventCode,
        username: poc.username.username,
      });
    });
  }

  async getPocByUsername(userId: number, username: string): Promise<PocResDto> {
    const pocAccount = await this.accountsService.getPocByUsername(
      userId,
      username,
    );
    if (!pocAccount) throw new NotFoundException(POC_NOT_FOUND);
    const usernameFind = pocAccount.username;
    const poc = await this.pointsOfCheckinRepo
      .createQueryBuilder('pointOfCheckin')
      .leftJoinAndSelect('pointOfCheckin.eventCode', 'eventCode')
      .leftJoinAndSelect('pointOfCheckin.username', 'username')
      .where('pointOfCheckin.username = :usernameFind', { usernameFind })
      .getOne();
    if (!poc) throw new NotFoundException(POC_NOT_FOUND);
    return plainToInstance(PocResDto, {
      ...poc,
      eventCode: poc.eventCode.eventCode,
      username: poc.username.username,
    });
  }
  async getPocDetails(userId: number): Promise<PocResDto> {
    const pocAccounts = await this.accountsRepo.findOne({
      where: { userId: userId },
    });
    const username = pocAccounts.username;
    const poc = await this.pointsOfCheckinRepo
      .createQueryBuilder('pointOfCheckin')
      .leftJoinAndSelect('pointOfCheckin.eventCode', 'eventCode')
      .leftJoinAndSelect('pointOfCheckin.username', 'username')
      .where('pointOfCheckin.username = :username', { username })
      .getOne();
    if (!poc) throw new NotFoundException(POC_NOT_FOUND);
    return plainToInstance(PocResDto, {
      ...poc,
      eventCode: poc.eventCode.eventCode,
      username: poc.username.username,
    });
  }
}
