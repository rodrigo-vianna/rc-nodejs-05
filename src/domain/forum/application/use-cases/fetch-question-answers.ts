import { Injectable } from '@nestjs/common'
import { Either, right } from '../../../../core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface FetchQuestionAnswersUseCaseRequest {
  page: number
  questionId: string
}

type FetchQuestionAnswersUseCaseResponse = Either<
  unknown,
  { answers: Answer[] }
>

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  public async execute({
    questionId,
    page,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    )
    return right({ answers })
  }
}
