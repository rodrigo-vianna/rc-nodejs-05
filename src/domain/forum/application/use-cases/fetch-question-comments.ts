import { Injectable } from '@nestjs/common'
import { Either, right } from '../../../../core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<
  unknown,
  { questionComments: QuestionComment[] }
>

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(
    private readonly questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  public async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      })
    return right({ questionComments })
  }
}
