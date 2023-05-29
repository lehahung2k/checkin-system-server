import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Guests } from '../entities/guests.entity';

@Injectable()
export class GuestsRepository extends Repository<Guests> {
  constructor(private readonly dataSource: DataSource) {
    super(Guests, dataSource.createEntityManager());
  }
}
