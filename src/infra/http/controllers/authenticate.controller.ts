import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes
} from '@nestjs/common'
import { z } from 'zod'
import { AuthenticateStudentUseCase } from '../../../domain/forum/application/use-cases/authenticate-student'
import { WrongCredentialsError } from '../../../domain/forum/application/use-cases/errors/wrong-credentials-error'
import { Public } from '../../auth/public'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const authenticateSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateInput = z.infer<typeof authenticateSchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private readonly authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateSchema))
  async handle(@Body() body: AuthenticateInput) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
