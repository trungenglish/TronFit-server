import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_ACCESS_TOKEN,
  expiresIn: process.env.JWT_ACCESS_EXPIRE || '1h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
}));
