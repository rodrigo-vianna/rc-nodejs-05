import { DomainEvents } from '../../src/core/events/domain-events'
import { PaginationParams } from '../../src/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '../../src/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '../../src/domain/forum/application/repositories/questions-repository'
import { Question } from '../../src/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public readonly items: Question[] = []

  constructor(
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  public async findById(id: string): Promise<Question | null> {
    return this.items.find((question) => question.id.value === id) ?? null
  }

  public async findBySlug(slug: string): Promise<Question | null> {
    return this.items.find((question) => question.slug.value === slug) ?? null
  }

  public async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
    return questions
  }

  public async create(question: Question): Promise<void> {
    this.items.push(question)

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  public async save(question: Question): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.value === question.id.value,
    )
    this.items[index] = question

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  public async delete(question: Question): Promise<void> {
    await this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.value,
    )
    const index = this.items.findIndex(
      (item) => item.id.value === question.id.value,
    )
    this.items.splice(index, 1)
  }
}
