import { Controller, UseGuards, Post, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalEmailAuthGuard } from './guard/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { Public } from '../../common/decorators/public-route.decorator';
import { AuthRequest } from './interfaces';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalEmailAuthGuard)
  @ResponseMessage('Login by email')
  @Post('login')
  loginUser(@Request() req: AuthRequest) {
    return this.authService.loginUser(req.user);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
