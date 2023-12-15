import { QuestionAttachmentsRepository } from '../../src/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '../../src/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public readonly items: QuestionAttachment[] = []

  public async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    return this.items.filter((item) => item.questionId.value === questionId)
  }

  public async deleteManyByQuestionId(questionId: string): Promise<void> {
    const itens = this.items.filter(
      (item) => item.questionId.value === questionId,
    )
    itens.forEach((item) => {
      const index = this.items.findIndex((i) => i.id.value === item.id.value)
      this.items.splice(index, 1)
    })
  }
}
