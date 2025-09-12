import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodType, ZodError, z } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError)
        throw new BadRequestException(
          `Validation failed: ${z.prettifyError(error)}`,
        );
    }
  }
}
