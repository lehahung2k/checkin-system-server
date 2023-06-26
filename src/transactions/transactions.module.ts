import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './entities/transactions.entity';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './controller/transactions.controller';
import { TransactionsRepository } from './repository/transactions.repsitory';

@Module({
  imports: [TypeOrmModule.forFeature([Transactions])],
  providers: [TransactionsService, TransactionsRepository],
  controllers: [TransactionsController],
  exports: [TransactionsRepository, TransactionsService],
})
export class TransactionsModule {}
