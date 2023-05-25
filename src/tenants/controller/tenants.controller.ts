import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TenantsService } from '../tenants.service';
import { RoleGuard } from '../../auth/role.guard';
import { Role } from '../../auth/role.decorator';
import { AddTenantDto } from '../dto/add-tenant.dto';
import {
  BAD_REQUEST_RES,
  ERROR_RESPONSE,
  SUCCESS_RESPONSE,
} from '../../utils/message.utils';

@Controller('api/tenants')
@ApiTags('Tenants')
@UseGuards(RoleGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @Role('admin')
  @ApiBearerAuth()
  async getTenants(@Res() res: any): Promise<void> {
    try {
      const payload = await this.tenantsService.getAllTenants();
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: payload });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_RESPONSE, payload: null });
    }
  }

  @Post('/create')
  @Role('admin', 'tenant')
  @ApiBearerAuth()
  async createNewTenant(@Body() newTenant: AddTenantDto, @Res() res) {
    try {
      const response = await this.tenantsService.addTenant(newTenant);
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: response });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: BAD_REQUEST_RES });
    }
  }
}
