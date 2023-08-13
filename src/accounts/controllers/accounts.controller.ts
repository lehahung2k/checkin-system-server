import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from '../services/accounts.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleGuard } from '../../auth/role.guard';
import { Role } from '../../auth/role.decorator';
import {
  CHANGE_PASSWORD_SUCCESS,
  DELETE_ACCOUNT_SUCCESS,
  ERROR_RESPONSE,
  SUCCESS_RESPONSE,
  UPDATE_INFO_SUCCESS,
  USER_NOT_FOUND_MESSAGE,
} from '../../utils/message.utils';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Controller('/api/accounts')
@ApiTags('Accounts')
@UseGuards(RoleGuard)
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @Get()
  @Role('admin')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy toàn bộ danh sách account với quyền admin',
  })
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

  @Get('/details')
  @Role('admin', 'tenant', 'poc')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Xem thông tin chi tiết của 1 account với userId được truyền vào trong header',
  })
  async getUserById(@Res() res: any, @Req() req: any) {
    try {
      const userId = parseInt(req.userId);
      const account = await this.accountService.getAccountById(userId);
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: account });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('/poc')
  @Role('tenant')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Xem danh sách toàn bộ poc đã tham gia với mã doanh nghiệp được cấp',
  })
  async getAllPoc(@Res() res: any, @Req() req: any): Promise<void> {
    try {
      const userId = parseInt(req.userId);
      const pocAccounts = await this.accountService.getAllPoc(userId);
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: pocAccounts });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_RESPONSE, payload: null });
    }
  }

  @Get('/poc/view')
  @Role('tenant')
  @ApiBearerAuth()
  @ApiParam({
    name: 'username',
    description: 'Xem thông tin của 1 tài khoản poc với username',
    type: 'string',
  })
  async getPocByUsername(
    @Res() res: any,
    @Req() req: any,
    @Query('username') username: string,
  ): Promise<void> {
    try {
      const userId = parseInt(req.userId);
      const poc = await this.accountService.getPocByUsername(userId, username);
      res
        .status(HttpStatus.OK)
        .json({ message: SUCCESS_RESPONSE, payload: poc });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: USER_NOT_FOUND_MESSAGE });
    }
  }

  @Get('/tenant')
  @Role('admin')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xem danh sách toàn bộ tài khoản tenant bằng quyền admin',
  })
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

  @Patch('/update-profile')
  @Role('admin', 'tenant', 'poc')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật thông tin của account với các tham số ở body',
  }) // Mô tả cho endpoint
  async updateProfile(
    @Res() res: any,
    @Req() req: any,
    @Body() updateProfileDto: Partial<UpdateProfileDto>,
  ) {
    try {
      const userId = parseInt(req.userId);
      await this.accountService.updateProfile(userId, updateProfileDto);
      res.status(HttpStatus.OK).json({ message: UPDATE_INFO_SUCCESS });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Put('/change-password')
  @Role('admin', 'tenant', 'poc')
  @ApiBearerAuth()
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Thay đổi mật khẩu của account',
  })
  async changePassword(
    @Res() res,
    @Req() req,
    @Body() changePassword: ChangePasswordDto,
  ): Promise<void> {
    try {
      const userId = parseInt(req.userId);
      await this.accountService.changePassword(
        userId,
        changePassword.oldPassword,
        changePassword.newPassword,
      );
      res.status(HttpStatus.OK).json({ message: CHANGE_PASSWORD_SUCCESS });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Delete('/delete-by-admin')
  @Role('admin')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Xóa tài khoản đối tác bằng quyền admin với userId được truyền vào trong query, trạng thái enable của tài khoản sẽ chuyển thành false',
  })
  async deleteAccountByAdmin(@Res() res: any, @Query('userId') userId: number) {
    try {
      await this.accountService.deleteAccount(userId);
      res.status(HttpStatus.OK).json({ message: DELETE_ACCOUNT_SUCCESS });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete('/delete-by-tenant')
  @Role('tenant')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Xóa tài khoản poc với quyền tenant theo userId, trạng thái enable của tài khoản sẽ chuyển thành false',
  })
  async deleteAccountByTenant(
    @Res() res: any,
    @Req() req: any,
    @Query('userId') pocAccId: number,
  ) {
    try {
      const tenantAccId = parseInt(req.userId);
      await this.accountService.deletePocAccount(tenantAccId, pocAccId);
      res.status(HttpStatus.OK).json({ message: DELETE_ACCOUNT_SUCCESS });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete('/delete-own-account')
  @Role('tenant', 'poc')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa tài khoản của chính mình',
  })
  async deleteOwnAccount(@Res() res: any, @Req() req: any) {
    try {
      const userId = parseInt(req.userId);
      await this.accountService.deleteOwnAccount(userId);
      res.status(HttpStatus.OK).json({ message: DELETE_ACCOUNT_SUCCESS });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
