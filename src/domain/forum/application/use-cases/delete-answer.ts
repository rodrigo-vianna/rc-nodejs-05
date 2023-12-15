import { Injectable } from '@nestjs/common'
import { Either, left, right } from '../../../../core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  unknown
>

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  public async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      return left(new ResourceNotFoundError())
    }
    if (answer.authorId.value !== authorId) {
      return left(new NotAllowedError())
    }
    await this.answersRepository.delete(answer)
    return right({})
  }
}
