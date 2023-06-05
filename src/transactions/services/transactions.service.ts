import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from '../repository/transactions.repsitory';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepo: TransactionsRepository) {}
  getAllByPointCode(pointCode: string) {
    return `${pointCode} This action returns all transactions`;
  }
  getAllTransactions() {
    return this.transactionRepo.find();
  }
}
