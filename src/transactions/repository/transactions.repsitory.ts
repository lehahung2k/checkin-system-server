import { DataSource, Repository } from 'typeorm';
import { Transactions } from '../entities/transactions.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsRepository extends Repository<Transactions> {
  constructor(private readonly dataSource: DataSource) {
    super(Transactions, dataSource.createEntityManager());
  }
}
