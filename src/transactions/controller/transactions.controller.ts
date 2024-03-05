import { Controller, Get, UseGuards } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {RoleGuard} from "../../auth/role.guard";
import {Role} from "../../auth/role.decorator";

@Controller('api/transactions')
@ApiTags('Transactions')
@UseGuards(RoleGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('')
  @Role('admin')
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
