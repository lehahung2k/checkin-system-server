import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GuestsRepository } from '../repository/guests.repository';
import { GuestsDto } from '../dto/guests.dto';
import { GuestResponseDto } from '../dto/guest-response.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Guests } from '../entities/guests.entity';
import { TransactionsDto } from '../../transactions/dto/transactions.dto';
import { TransactionsService } from '../../transactions/services/transactions.service';
import { Promise } from 'bluebird';
import { GUESTS_NOT_FOUND, GUEST_EXISTED } from '../../utils/message.utils';
import { TransactionsRepository } from 'src/transactions/repository/transactions.repsitory';

@Injectable()
export class GuestsService {
  constructor(
    private readonly guestsRepo: GuestsRepository,
    private readonly transRepo: TransactionsRepository,
    private readonly transService: TransactionsService,
  ) {}

  async getAllGuests(): Promise<GuestResponseDto[]> {
    const guests = await this.guestsRepo.find();
    return guests.map((guest) =>
      plainToClass(GuestResponseDto, {
        ...guest,
        frontImg: guest.frontImg.toString('utf8'),
        backImg: guest.backImg.toString('utf8'),
      }),
    );
  }

  async getAllGuestsByPointCode(
    pointCode: string,
  ): Promise<GuestResponseDto[]> {
    const listTransactions = await this.transService.getAllByPointCode(
      pointCode,
    );

    if (listTransactions.length === 0)
      throw new NotFoundException(GUESTS_NOT_FOUND);

    const guestCodes = listTransactions.map(
      (transaction) => transaction.guestCode,
    );

    return await Promise.map(
      guestCodes,
      async (guestCode) => {
        const guest = await this.guestsRepo
          .createQueryBuilder('guests')
          .where('guests.guestCode = :guestCode', { guestCode: guestCode })
          .getOne();
        return plainToClass(GuestResponseDto, {
          ...guest,
          frontImg: guest.frontImg.toString('utf8'),
          backImg: guest.backImg.toString('utf8'),
        });
      },
      { concurrency: 10 },
    );
  }

  // async getGuestByCode(guestCode: string): Promise<GuestResponseDto> {
  //   const guest = await this.guestsRepo.findOne({
  //     where: { guestCode: guestCode },
  //   });
  //   const frontImg = Buffer.from(guest.frontImg).toString('utf8');
  //   const backImg = Buffer.from(guest.backImg).toString('utf8');
  //   return plainToInstance(GuestResponseDto, {
  //     ...guest,
  //     frontImg: frontImg,
  //     backImg: backImg,
  //   });
  // }

  async getGuestByCode(
    pointCode: string,
    guestCode: string,
  ): Promise<GuestResponseDto | null> {
    const guestsList = await this.getAllGuestsByPointCode(pointCode);

    const targetGuest = guestsList.find(
      (guest) => guest.guestCode === guestCode,
    );

    return targetGuest || null;
  }

  // check-in
  async createGuest(newGuest: GuestsDto): Promise<Guests> {
    try {
      const guestCode = await this.processGuestCode(
        newGuest.guestCode,
        newGuest.identityType,
      );
      const addGuest = plainToInstance(Guests, {
        ...newGuest,
        guestCode: guestCode,
        enabled: true,
      });

      console.log(addGuest);

      const existedGuest = await this.transRepo.findOne({
        where: { guestCode: newGuest.guestCode },
        relations: ['pointCode'],
      });

      if (
        existedGuest &&
        existedGuest.pointCode &&
        existedGuest.pointCode.pointCode === newGuest.pointCode &&
        existedGuest.guestCode === guestCode
      )
        throw new BadRequestException(GUEST_EXISTED);

      const saveGuest = await this.guestsRepo.save(addGuest);

      const transactionDto: TransactionsDto = {
        guestCode: guestCode,
        note: newGuest.guestDescription,
        createdAt: new Date(),
        pointCode: newGuest.pointCode,
        checkinImg1: newGuest.frontImg,
        checkinImg2: newGuest.backImg,
      };

      await this.transService.newTransaction(transactionDto);

      return saveGuest;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async deleteGuest(guestId: number): Promise<void> {
    const guest = await this.guestsRepo
      .createQueryBuilder('guests')
      .where('guests.guestId = :guestId', { guestId: guestId })
      .getOne();
    if (!guest) throw new NotFoundException(GUESTS_NOT_FOUND);
    await this.guestsRepo.delete(guestId);
    await this.transRepo.delete({ guestCode: guest.guestCode });
  }

  async deleteAllGuests(): Promise<void> {
    await this.guestsRepo.delete({});
  }

  async processGuestCode(guestCode: string, identityType: string) {
    if (identityType === 'citizen_identity_card') {
      const match = guestCode.match(/^\d{12}/);
      if (match) {
        return match[0];
      } else {
        throw new BadRequestException('Invalid guestCode format');
      }
    } else if (identityType === 'student_card') {
      const match = guestCode.match(/\/(\d+)\//);
      if (match && match[1]) {
        return match[1];
      } else {
        throw new BadRequestException('Invalid guestCode format');
      }
    } else {
      return guestCode;
    }
  }
}
