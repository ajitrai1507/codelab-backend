import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';



@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findAllUsers({
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number;
    search?: string;
  }) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.user.count({
        where,
      }),
    ]);

    return {
      users,
      total,
    };
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async updateUser(
    id: string,
    data: UpdateUserDto,
  ) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async updateUserAvatar(
    userId: string,
    avatar: string,
  ) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        avatar,
      },
    });
  }
}