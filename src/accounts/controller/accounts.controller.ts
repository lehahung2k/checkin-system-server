import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccountsService } from '../accounts.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../../auth/role.guard';
import { Role } from '../../auth/role.decorator';

@Controller('/api/accounts')
@ApiTags('accounts')
@UseGuards(RoleGuard)
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @Get()
  @Role('admin')
  @ApiResponse({ status: 200, description: 'Get all accounts' })
  @ApiBearerAuth()
  async getAll() {
    return this.accountService.getAll();
  }
}
