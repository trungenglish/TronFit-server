import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { UserWithAuthProviders } from '../users/types';
import { jwtConfig } from '../../config/jwt.config';
import { ConfigService } from '@nestjs/config';

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

  loginUser(user: UserWithAuthProviders) {
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

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token,
      user: {
        id,
        email,
        nickname,
        role,
      },
    };
  }

  loginAdmin(user: UserWithAuthProviders) {
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
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });
    return refreshToken;
  }
}
