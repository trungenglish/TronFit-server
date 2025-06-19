import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class TrimStringPipe implements PipeTransform {
  transform(value: string): string {
    return value.trim();
  }
}
