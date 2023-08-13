import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TenantsService } from '../services/tenants.service';
import { RoleGuard } from '../../auth/role.guard';
import { Role } from '../../auth/role.decorator';
import { AddTenantDto } from '../dto/add-tenant.dto';
import {
  ADD_SUCCESS,
  BAD_REQUEST_RES,
  ERROR_RESPONSE,
  SUCCESS_RESPONSE,
  TENANT_NOT_FOUND,
  UPDATE_INFO_SUCCESS,
} from '../../utils/message.utils';
import { UpdateTenantDto } from '../dto/update-tenant.dto';

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
  @Role('tenant')
  @ApiBearerAuth()
  async createNewTenant(
    @Body() newTenant: AddTenantDto,
    @Res() res,
    @Req() request,
  ) {
    try {
      const userId = parseInt(request.userId);
      const response = await this.tenantsService.addTenant(newTenant, userId);
      res
        .status(HttpStatus.OK)
        .json({ message: ADD_SUCCESS, payload: response });
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.BAD_REQUEST).json({ message: BAD_REQUEST_RES });
    }
  }

  // Lấy thông tin tenant theo id của user
  @Get('/get-tenant')
  @Role('tenant')
  @ApiBearerAuth()
  async getTenantByName(@Res() res, @Req() req) {
    try {
      const userId = parseInt(req.userId);
      const response = await this.tenantsService.checkTenantByUser(userId);
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: response });
    } catch (err) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: TENANT_NOT_FOUND, payload: null });
    }
  }

  @Patch('/update')
  @Role('tenant')
  @ApiBearerAuth()
  async updateTenant(
    @Body() updateTenant: Partial<UpdateTenantDto>,
    @Res() res,
    @Req() req,
  ) {
    const userId = parseInt(req.userId);
    try {
      await this.tenantsService.updateTenant(userId, updateTenant);
      res.status(HttpStatus.OK).json({ message: UPDATE_INFO_SUCCESS });
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }
}
