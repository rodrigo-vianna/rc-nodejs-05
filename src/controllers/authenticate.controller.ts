import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { PrismaService } from '../prisma/prisma.service'

const authenticateSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateInput = z.infer<typeof authenticateSchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateSchema))
  async handle(@Body() body: AuthenticateInput) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user || !compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials')

    const accessToken = this.jwt.sign({ sub: user.id })

    return { access_token: accessToken }
  }
}
