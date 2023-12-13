import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { CurrentUser } from '../auth/current-user.decorator'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UserPayload } from '../auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { PrismaService } from '../prisma/prisma.service'

const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionInput = z.infer<typeof createQuestionSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createQuestionSchema))
    body: CreateQuestionInput,
  ) {
    const { title, content } = body

    const userId = user.sub
    const slug = this.convertToSlug(title)

    await this.prisma.question.create({
      data: {
        title,
        authorId: userId,
        slug,
        content,
      },
    })
  }

  private convertToSlug(text: string) {
    return text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')
  }
}
