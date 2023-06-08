import { Controller, Get, UseGuards } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/role.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('transactions')
@ApiTags('Transactions')
@UseGuards(RoleGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('')
  @Role('admin', 'tenant', 'poc')
  @ApiBearerAuth()
  async getAllTransactions() {
    return this.transactionsService.getAllTransactions();
  }

  @Get('/point')
  @Role('tenant', 'poc')
  @ApiBearerAuth()
  async getAllTransactionsByPointCode() {
    return this.transactionsService.getAllByPointCode('pointCode');
  }
}
