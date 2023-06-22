import { BadRequestException, Injectable } from '@nestjs/common';
import { GuestsRepository } from '../repository/guests.repository';
import { GuestsDto } from '../dto/guests.dto';
import { GuestResponseDto } from '../dto/guest-response.dto';
import { plainToInstance } from 'class-transformer';
import { Guests } from '../entities/guests.entity';

@Injectable()
export class GuestsService {
  constructor(private readonly guestsRepo: GuestsRepository) {}

  async getAllGuests(): Promise<GuestResponseDto[]> {
    const guests = await this.guestsRepo.find();
    return await Promise.all(
      guests.map(async (guest) => {
        const frontImg = Buffer.from(guest.frontImg).toString('utf8');
        const backImg = Buffer.from(guest.backImg).toString('utf8');
        return plainToInstance(GuestResponseDto, {
          ...guest,
          frontImg: frontImg,
          backImg: backImg,
        });
      }),
    );
  }

  async getGuestById(guestId: number): Promise<GuestResponseDto> {
    const guest = await this.guestsRepo.findOne({
      where: { guestId: guestId },
    });
    const frontImg = Buffer.from(guest.frontImg).toString('utf8');
    const backImg = Buffer.from(guest.backImg).toString('utf8');
    return plainToInstance(GuestResponseDto, {
      ...guest,
      frontImg: frontImg,
      backImg: backImg,
    });
  }

  async createGuest(newGuest: GuestsDto): Promise<Guests> {
    try {
      const addGuest = plainToInstance(Guests, {
        ...newGuest,
        enabled: true,
      });
      return await this.guestsRepo.save(addGuest);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
