import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class AuthRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async updateResetPasswordToken(
    userId: string,

    token: string,

    expires: Date,
  ) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        resetPasswordToken: token,

        resetPasswordExpires: expires,
      },
    });
  }

  async findUserByResetToken(token: string) {
    return this.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
      },
    });
  }

  async updatePassword(
    userId: string,

    password: string,
  ) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        password,

        resetPasswordToken: null,

        resetPasswordExpires: null,
      },
    });
  }
}