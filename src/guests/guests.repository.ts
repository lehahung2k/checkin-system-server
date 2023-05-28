import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Guests } from './guests.entity';

@Injectable()
export class GuestsRepository extends Repository<Guests> {
  constructor(private readonly dataSource: DataSource) {
    super(Guests, dataSource.createEntityManager());
  }
}
