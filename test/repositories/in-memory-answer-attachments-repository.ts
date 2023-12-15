import { AnswerAttachmentsRepository } from '../../src/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '../../src/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public readonly items: AnswerAttachment[] = []

  public async findManyByAnswerId(
    answerId: string,
  ): Promise<AnswerAttachment[]> {
    return this.items.filter((item) => item.answerId.value === answerId)
  }

  public async deleteManyByAnswerId(answerId: string): Promise<void> {
    const itens = this.items.filter((item) => item.answerId.value === answerId)
    itens.forEach((item) => {
      const index = this.items.findIndex((i) => i.id.value === item.id.value)
      this.items.splice(index, 1)
    })
  }
}
