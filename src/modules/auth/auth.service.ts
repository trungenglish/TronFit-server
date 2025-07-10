import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { UserWithAuthProviders } from '../users/types';
import { jwtConfig } from '../../config/jwt.config';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY) private jwtConf: any,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserWithAuthProviders | null> {
    const user = await this.usersService.findUserByEmail(email);
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

  async loginUser(user: UserWithAuthProviders, response: Response) {
    const { id, email, role, nickname } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      id,
      email,
      nickname,
      role,
    };
    const refresh_token = this.createRefreshToken(payload);

    await this.usersService.updateUserToken(refresh_token, id);

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(
        (this.configService.get<string>(
          'JWT_REFRESH_EXPIRE',
        ) as ms.StringValue) || '1d',
      ),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id,
        email,
        nickname,
        role,
      },
    };
  }

  async loginAdmin(user: UserWithAuthProviders) {
    const { id, username, role, nickname } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      id,
      username,
      nickname,
      role,
    };
    const refresh_token = this.createRefreshToken(payload);
    await this.usersService.updateUserToken(refresh_token, id);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token,
      user: {
        id,
        username,
        nickname,
        role,
      },
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

  createRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });
  }
}
