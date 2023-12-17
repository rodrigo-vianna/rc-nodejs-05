import { AnswerAttachmentsRepository } from '../../src/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '../../src/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository {
  public items: AnswerAttachment[] = []

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

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    const answerAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = answerAttachments
  }
}
