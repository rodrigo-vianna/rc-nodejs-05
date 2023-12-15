import { Injectable } from '@nestjs/common'
import { Either, left, right } from '../../../../core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteAnswerCommentUseCaseRequest {
  answerCommentId: string
  authorId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  unknown
>

@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(
    private readonly answercommentsRepository: AnswerCommentsRepository,
  ) {}

  public async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answercommentsRepository.findById(answerCommentId)
    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }
    if (answerComment.authorId.value !== authorId) {
      return left(new NotAllowedError())
    }
    await this.answercommentsRepository.delete(answerComment)
    return right({})
  }
}
