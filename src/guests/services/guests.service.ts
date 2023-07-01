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
import { GUESTS_NOT_FOUND } from '../../utils/message.utils';

@Injectable()
export class GuestsService {
  constructor(
    private readonly guestsRepo: GuestsRepository,
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

  async getGuestByCode(guestCode: string): Promise<GuestResponseDto> {
    const guest = await this.guestsRepo.findOne({
      where: { guestCode: guestCode },
    });
    const frontImg = Buffer.from(guest.frontImg).toString('utf8');
    const backImg = Buffer.from(guest.backImg).toString('utf8');
    return plainToInstance(GuestResponseDto, {
      ...guest,
      frontImg: frontImg,
      backImg: backImg,
    });
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

  async createGuest(newGuest: GuestsDto): Promise<Guests> {
    try {
      const addGuest = plainToInstance(Guests, {
        ...newGuest,
        enabled: true,
      });
      const saveGuest = await this.guestsRepo.save(addGuest);
      const transactionDto: TransactionsDto = {
        guestCode: newGuest.guestCode,
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
}
