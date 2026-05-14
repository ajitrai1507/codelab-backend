import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { AuthRepository } from './repositories/auth.repository';
import { v4 as uuidv4 } from 'uuid';

import { MailService } from '../mail/services/mail.service';

import { ForgotPasswordDto } from './dto/forgot-password.dto';

import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  async login(loginDto: LoginDto) {
    const user = await this.authRepository.findUserByEmail(
      loginDto.email,
    );

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user,
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ) {
    const user =
      await this.authRepository.findUserByEmail(
        forgotPasswordDto.email,
      );

    if (!user) {
      throw new BadRequestException(
        'User not found',
      );
    }

    const resetToken = uuidv4();

    const expires = new Date(
      Date.now() + 1000 * 60 * 15,
    );

    await this.authRepository.updateResetPasswordToken(
      user.id,

      resetToken,

      expires,
    );

    await this.mailService.sendResetPasswordEmail(
      user.email,

      resetToken,
    );

    return {
      message:
        'Reset password email sent successfully',
    };
  }


  async resetPassword(
    token: string,

    resetPasswordDto: ResetPasswordDto,
  ) {
    const user =
      await this.authRepository.findUserByResetToken(
        token,
      );

    if (!user) {
      throw new BadRequestException(
        'Invalid reset token',
      );
    }

    if (
      !user.resetPasswordExpires ||

      user.resetPasswordExpires <
      new Date()
    ) {
      throw new BadRequestException(
        'Reset token expired',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        resetPasswordDto.password,
        10,
      );

    await this.authRepository.updatePassword(
      user.id,

      hashedPassword,
    );

    return {
      message:
        'Password reset successfully',
    };
  }
}