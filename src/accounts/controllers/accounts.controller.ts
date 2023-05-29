import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { AccountsService } from '../services/accounts.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../../auth/role.guard';
import { Role } from '../../auth/role.decorator';
import { ERROR_RESPONSE, SUCCESS_RESPONSE } from '../../utils/message.utils';

@Controller('/api/accounts')
@ApiTags('Accounts')
@UseGuards(RoleGuard)
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @Get()
  @Role('admin')
  @ApiBearerAuth()
  async getAll(@Res() res: any): Promise<void> {
    try {
      const accounts = await this.accountService.getAll();
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: accounts });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_RESPONSE, payload: null });
    }
  }

  @Get('/poc')
  @Role('admin')
  @ApiBearerAuth()
  async getAllPoc(@Res() res: any): Promise<void> {
    try {
      const pocAccounts = await this.accountService.getAllPoc();
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: pocAccounts });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_RESPONSE, payload: null });
    }
  }

  @Get('/tenant')
  @Role('admin')
  @ApiBearerAuth()
  async getAccountTenant(@Res() res: any): Promise<void> {
    try {
      const tenantAccount = await this.accountService.getAllAccountTenant();
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: tenantAccount });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_RESPONSE, payload: null });
    }
  }
}
