import { Injectable } from '@nestjs/common';
import { GuestsRepository } from '../repository/guests.repository';

@Injectable()
export class GuestsService {
  constructor(private readonly guestsRepo: GuestsRepository) {}
}
