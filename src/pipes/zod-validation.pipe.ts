import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (error: unknown) {
      if (error instanceof ZodError)
        throw new BadRequestException({
          error: fromZodError(error),
        })
      throw new BadRequestException('Validation failed')
    }
  }
}
