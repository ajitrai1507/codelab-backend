import { Body, Controller, Post } from '@nestjs/common';
import { Param } from '@nestjs/common';

import { ForgotPasswordDto } from './dto/forgot-password.dto';

import { ResetPasswordDto } from './dto/reset-password.dto';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiResponse } from 'common/utils/api-response.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);

    return new ApiResponse({
      success: true,
      message: 'Login successful',
      data,
    });
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body()
    forgotPasswordDto: ForgotPasswordDto,
  ) {
    const data =
      await this.authService.forgotPassword(
        forgotPasswordDto,
      );

    return new ApiResponse({
      success: true,
      message:
        'Reset password email sent successfully',
      data,
    });
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,

    @Body()
    resetPasswordDto: ResetPasswordDto,
  ) {
    const data =
      await this.authService.resetPassword(
        token,
        resetPasswordDto,
      );

    return new ApiResponse({
      success: true,
      message:
        'Password reset successfully',
      data,
    });
  }
}