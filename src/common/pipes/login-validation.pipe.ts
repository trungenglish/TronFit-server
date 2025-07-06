import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { LoginDto } from '../../modules/auth/dto/login.dto';

@Injectable()
export class LoginValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    // Kiểm tra nếu value không phải object
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Invalid input data');
    }

    const dto = new LoginDto();

    // Sử dụng Object.assign để gán an toàn
    Object.assign(dto, value);

    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((error) => Object.values(error.constraints || {})).flat(),
      );
    }
    return value;
  }
}