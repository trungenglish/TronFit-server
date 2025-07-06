import { Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserWithAuthProviders } from './types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // createUserToRole(createUserDto: CreateUserDto) {

  //   return 'This action adds a new user';
  // }

  findAllUser() {
    return `This action returns all users`;
  }

  async findUserByEmail(email: string): Promise<UserWithAuthProviders | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        authProviders: true,
      },
    });
  }

  async findAdminByUsername(
    username: string,
  ): Promise<UserWithAuthProviders | null> {
    return this.prisma.user.findUnique({
      where: { username },
      include: {
        authProviders: true,
      },
    });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
