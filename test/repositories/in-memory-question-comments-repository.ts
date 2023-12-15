import { PaginationParams } from '../../src/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '../../src/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '../../src/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public readonly items: QuestionComment[] = []

  public async findById(id: string): Promise<QuestionComment | null> {
    return this.items.find((item) => item.id.value === id) ?? null
  }

  public async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    return this.items
      .filter((item) => item.questionId.value === questionId)
      .slice((page - 1) * 20, page * 20)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  public async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment)
  }

  public async delete(questionComment: QuestionComment): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.value === questionComment.id.value,
    )
    this.items.splice(index, 1)
  }
}
