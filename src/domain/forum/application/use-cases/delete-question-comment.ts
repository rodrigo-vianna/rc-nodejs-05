import { Injectable } from '@nestjs/common'
import { Either, left, right } from '../../../../core/either'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteQuestionCommentUseCaseRequest {
  questionCommentId: string
  authorId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  unknown
>

@Injectable()
export class DeleteQuestionCommentUseCase {
  constructor(
    private readonly questioncommentsRepository: QuestionCommentsRepository,
  ) {}

  public async execute({
    questionCommentId,
    authorId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questioncommentsRepository.findById(questionCommentId)
    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }
    if (questionComment.authorId.value !== authorId) {
      return left(new NotAllowedError())
    }
    await this.questioncommentsRepository.delete(questionComment)
    return right({})
  }
}
