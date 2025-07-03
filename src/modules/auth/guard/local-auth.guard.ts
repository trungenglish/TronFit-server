import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalEmailAuthGuard extends AuthGuard('local-email') {}

@Injectable()
export class LocalUsernameAuthGuard extends AuthGuard('local-username') {}
