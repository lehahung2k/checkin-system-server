import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionsRepository } from '../repository/transactions.repsitory';
import { TransactionsDto } from '../dto/transactions.dto';
import { Transactions } from '../entities/transactions.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepo: TransactionsRepository) {}
  async getAllTransactions() {
    return this.transactionRepo.find();
  }
  async getAllByPointCode(pointCode: string) {
    return await this.transactionRepo
      .createQueryBuilder('transactions')
      .where('transactions.pointCode = :pointCode', { pointCode: pointCode })
      .getMany();
  }

  async newTransaction(newTransaction: TransactionsDto): Promise<Transactions> {
    try {
      const addTransaction = plainToInstance(Transactions, {
        ...newTransaction,
        enabled: true,
      });
      return await this.transactionRepo.save(addTransaction);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
