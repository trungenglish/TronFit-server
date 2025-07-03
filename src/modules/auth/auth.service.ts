import { Injectable } from '@nestjs/common';
import { UsersService, UserWithAuthProviders } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserWithAuthProviders | null> {
    const user = await this.usersService.findUserByEmail(email);
    console.log('user', user);
    if (user && user.authProviders.length > 0) {
      const authProvider = user.authProviders[0];
      if (authProvider.password) {
        const isValid = this.isValidPassword(pass, authProvider.password);
        if (isValid) {
          return user;
        }
      }
    }
    return null;
  }

  login(user: any) {
    console.log(user);
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);
    return this.prisma.user.create({
      data: {
        email: registerDto.email,
        authProviders: {
          create: {
            provider: 'EMAIL',
            password: hashedPassword,
          },
        },
      },
    });
  }

  isValidPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
