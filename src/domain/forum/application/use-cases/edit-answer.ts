import { Injectable } from '@nestjs/common'
import { Either, left, right } from '../../../../core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditAnswerUseCaseRequest {
  answerId: string
  authorId: string
  content: string
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  unknown
>

@Injectable()
export class EditAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  public async execute({
    authorId,
    answerId,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      return left(new ResourceNotFoundError())
    }
    if (answer.authorId.value !== authorId) {
      return left(new NotAllowedError())
    }

    answer.content = content

    await this.answersRepository.save(answer)
    return right({})
  }
}
