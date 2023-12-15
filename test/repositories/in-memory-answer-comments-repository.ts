import { PaginationParams } from '../../src/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '../../src/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '../../src/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public readonly items: AnswerComment[] = []

  public async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find(
      (answerComment) => answerComment.id.value === id,
    )
    return answerComment ?? null
  }

  public async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    return this.items
      .filter((item) => item.answerId.value === answerId)
      .slice((page - 1) * 20, page * 20)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  public async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment)
  }

  public async delete(answerComment: AnswerComment): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.value === answerComment.id.value,
    )
    this.items.splice(index, 1)
  }
}
