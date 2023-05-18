import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { LoginDto } from '../accounts/dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { AddAccountDto } from '../accounts/dto/add-account.dto';

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
  @Post('/login')
  async login(@Body() loginForm: LoginDto, @Req() req: any) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Login success',
      data: req.user,
    };
  }
  @Post('/register')
  async register(@Body() newAccount: AddAccountDto) {
    try {
      if (newAccount.username === 'hunglh') return 'fail';
      else
        return {
          statusCode: HttpStatus.OK,
          message: 'Register success!',
        };
    } catch (e) {
      return { statusCode: HttpStatus.UNAUTHORIZED, message: 'Register fail' };
    }
  }
}
