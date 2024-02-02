import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { LoginDto } from '../accounts/dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { AddAccountDto } from '../accounts/dto/add-account.dto';
import { AuthService } from './auth.service';
import {
  CREATE_ACCOUNT_SUCCESS,
  LOGIN_SUCCESS,
  UN_RECOGNIZED_TENANT,
  UN_AUTHORED_MESSAGE,
  REGISTER_ACCOUNT_SUCCESS,
} from '../utils/message.utils';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async login(@Body() loginForm: LoginDto, @Req() req: any, @Res() res: any) {
    try {
      const user = await this.authService.login(loginForm);
      const token = await this.authService.generateToken(user);

      const response = {
        accessToken: token,
        user: {
          fullName: user.fullName,
          companyName: user.companyName,
          role: user.role,
        },
      };
      res.header('Authorization', `Bearer ${token}`);
      res
        .status(HttpStatus.OK)
        .json({ message: LOGIN_SUCCESS, payload: response });
    } catch (err) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: UN_AUTHORED_MESSAGE });
    }
  }
  @Post('/register')
  async register(@Body() newAccount: AddAccountDto, @Res() res: any) {
    try {
      await this.authService.createAccount(newAccount);
      res.status(HttpStatus.OK).json({ message: REGISTER_ACCOUNT_SUCCESS });
    } catch (error) {
      let resMsg = error.message;
      if (error.message == UN_RECOGNIZED_TENANT) resMsg = UN_RECOGNIZED_TENANT;
      res.status(HttpStatus.BAD_REQUEST).json({ message: resMsg });
    }
  }

  @Post('/confirm')
  async confirm(@Res() res: any, @Body() body: any) {
    try {
      const confirmMailToken = body.confirmMailToken;
      await this.authService.confirmMail(confirmMailToken);
      res.status(HttpStatus.OK).json({ message: CREATE_ACCOUNT_SUCCESS });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
