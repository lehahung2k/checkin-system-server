import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PointsOfCheckinRepository } from '../repository/point-of-checkin.repository';
import { PointsOfCheckin } from '../entities/points-of-checkin.entity';
import { PointsOfCheckinDto } from '../dto/points-of-checkin.dto';
import { plainToInstance } from 'class-transformer';
import {
  DELETE_FAILED,
  EVENT_NOT_FOUND,
  POC_EXISTED,
  POC_NOT_FOUND,
} from '../../utils/message.utils';
import { AccountsService } from '../../accounts/services/accounts.service';
import { PocResDto } from '../dto/poc-res.dto';
import { UpdatePocDto } from '../dto/update-poc.dto';
import { GuestsService } from '../../guests/services/guests.service';
import { AccountsRepository } from '../../accounts/repository/accounts.repository';
import { EventsManagerRepository } from '../../events-manager/repository/events-manager.repository';

@Injectable()
export class PointsOfCheckinService {
  constructor(
    private readonly pointsOfCheckinRepo: PointsOfCheckinRepository,
    private readonly eventsManagerRepo: EventsManagerRepository,
    private readonly accountsRepo: AccountsRepository,
    private readonly accountsService: AccountsService,
    private readonly guestsService: GuestsService,
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
    const username = user.username;
    const pocCheck = await this.pointsOfCheckinRepo
      .createQueryBuilder('poc')
      .where('poc.username = :username', { username })
      .andWhere('poc.eventCode = :eventCode', { eventCode: newPoint.eventCode })
      .getOne();
    if (pocCheck) throw new BadRequestException(POC_EXISTED);
    newPoint.username = username;
    const addPoint = plainToInstance(PointsOfCheckin, {
      ...newPoint,
      enabled: true,
    });
    try {
      return await this.pointsOfCheckinRepo.save(addPoint);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(EVENT_NOT_FOUND);
    }
  }

  async getPointsOfCheckinByUsername(userId: number): Promise<PocResDto[]> {
    const pocAccounts = await this.accountsService.getAllPoc(userId);
    const usernames = await Promise.all(
      pocAccounts.map((account) => account.username),
    );
    // Lấy tất cả points of checkin có username trùng với username của list pocAccount (mỗi pocAccount có 1 username)
    const listPointOfCheckin = await this.pointsOfCheckinRepo
      .createQueryBuilder('pointOfCheckin')
      .leftJoinAndSelect('pointOfCheckin.eventCode', 'eventCode')
      .leftJoinAndSelect('pointOfCheckin.username', 'username')
      .where('pointOfCheckin.username IN (:...usernames)', { usernames })
      .getMany();

    if (!listPointOfCheckin) throw new NotFoundException(POC_NOT_FOUND);

    return await Promise.all(
      listPointOfCheckin.map((poc) => this.transformPocToPocResDto(poc)),
    );
  }

  async getPocByUsername(userId: number, username: string): Promise<PocResDto> {
    const pocAccount = await this.accountsService.getPocByUsername(
      userId,
      username,
    );
    if (!pocAccount) throw new NotFoundException(POC_NOT_FOUND);

    const poc = await this.pointsOfCheckinRepo
      .createQueryBuilder('pointOfCheckin')
      .leftJoinAndSelect('pointOfCheckin.eventCode', 'eventCode')
      .leftJoinAndSelect('pointOfCheckin.username', 'username')
      .where('pointOfCheckin.username = :username', { username })
      .getOne();
    if (!poc) throw new NotFoundException(POC_NOT_FOUND);
    return this.transformPocToPocResDto(poc);
  }

  async getPocListByEventCode(eventCode: string): Promise<PocResDto[]> {
    const listPoc = await this.pointsOfCheckinRepo
      .createQueryBuilder('pointOfCheckin')
      .leftJoinAndSelect('pointOfCheckin.eventCode', 'eventCode')
      .leftJoinAndSelect('pointOfCheckin.username', 'username')
      .where('pointOfCheckin.eventCode = :eventCode', { eventCode })
      .getMany();
    if (!listPoc) throw new NotFoundException(POC_NOT_FOUND);
    return await Promise.all(
      listPoc.map(async (poc) => this.transformPocToPocResDto(poc)),
    );
  }

  async getPocListByPoc(userId: number): Promise<PocResDto[]> {
    const pocAccount = await this.accountsRepo.findOne({
      where: { userId: userId },
    });
    const username = pocAccount.username;
    const pocList = await this.pointsOfCheckinRepo
      .createQueryBuilder('pointOfCheckin')
      .leftJoinAndSelect('pointOfCheckin.eventCode', 'eventCode')
      .leftJoinAndSelect('pointOfCheckin.username', 'username')
      .where('pointOfCheckin.username = :username', { username })
      .getMany();
    if (!pocList) throw new NotFoundException(POC_NOT_FOUND);
    return await Promise.all(
      pocList.map(async (poc) => this.transformPocToPocResDto(poc)),
    );
  }

  async getPocDetails(userId: number, pointCode: string): Promise<PocResDto> {
    const pocAccount = await this.accountsRepo.findOne({
      where: { userId: userId },
    });
    const username = pocAccount.username;
    const poc = await this.pointsOfCheckinRepo
      .createQueryBuilder('pointOfCheckin')
      .leftJoinAndSelect('pointOfCheckin.eventCode', 'eventCode')
      .leftJoinAndSelect('pointOfCheckin.username', 'username')
      .where('pointOfCheckin.username = :username', { username })
      .andWhere('pointOfCheckin.pointCode = :pointCode', { pointCode })
      .getOne();
    if (!poc) throw new NotFoundException(POC_NOT_FOUND);
    return this.transformPocToPocResDto(poc);
  }

  async updatePointOfCheckin(
    userId: number,
    pointCode: string,
    pocInfo: Partial<UpdatePocDto>,
  ) {
    const pocAccount = await this.accountsRepo.findOne({
      where: { userId: userId },
    });
    if (!pocAccount) throw new NotFoundException(POC_NOT_FOUND);
    const username = pocAccount.username;
    const poc = await this.pointsOfCheckinRepo
      .createQueryBuilder('pointOfCheckin')
      .where('pointOfCheckin.username = :username', { username })
      .andWhere('pointOfCheckin.pointCode = :pointCode', { pointCode })
      .getOne();
    Object.assign(poc, pocInfo);
    await this.pointsOfCheckinRepo.save(poc);
  }

  async deletePointOfCheckin(userId: number, pointCode: string) {
    const pocAccount = await this.accountsRepo.findOne({
      where: { userId: userId },
    });
    if (!pocAccount) throw new NotFoundException(POC_NOT_FOUND);
    const username = pocAccount.username;
    const poc = await this.pointsOfCheckinRepo
      .createQueryBuilder('pointOfCheckin')
      .where('pointOfCheckin.username = :username', { username })
      .andWhere('pointOfCheckin.pointCode = :pointCode', { pointCode })
      .getOne();
    if (!poc) throw new NotFoundException(POC_NOT_FOUND);
    const guests = this.guestsService.getAllGuestsByPointCode(pointCode);
    if (guests.length > 0) throw new BadRequestException(DELETE_FAILED);
    try {
      await this.pointsOfCheckinRepo.delete(poc.pointId);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(DELETE_FAILED);
    }
  }

  private transformPocToPocResDto(poc: PointsOfCheckin): PocResDto {
    return plainToInstance(PocResDto, {
      ...poc,
      eventCode: poc.eventCode.eventCode,
      username: poc.username.username,
    });
  }
}
