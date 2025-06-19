import { HttpException, HttpStatus } from '@nestjs/common';


export class ConflictException extends HttpException {
  constructor(message: string = 'Conflict detected') {
    super(message, HttpStatus.CONFLICT);
  }
}
