import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Access is denied') {
    super(message, HttpStatus.FORBIDDEN);
  }
}
