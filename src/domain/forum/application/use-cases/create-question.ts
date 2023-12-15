import { Injectable } from '@nestjs/common'
import { Either, right } from '../../../../core/either'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionsRepository } from '../repositories/questions-repository'

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
  unknown,
  {
    question: Question
  }
>

@Injectable()
export class CreateQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  public async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    })

    const attachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: new UniqueEntityID(),
      })
    })
    question.attachments = new QuestionAttachmentList(attachments)

    await this.questionsRepository.create(question)

    return right({
      question,
    })
  }
}
