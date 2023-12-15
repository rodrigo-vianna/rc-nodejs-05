import { AggregateRoot } from '../../../../core/entities/aggregate-root'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

export interface QuestionAttachmentProps {
  questionId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class QuestionAttachment extends AggregateRoot<QuestionAttachmentProps> {
  static create(props: QuestionAttachmentProps, id?: UniqueEntityID) {
    const entity = new QuestionAttachment(
      {
        ...props,
      },
      id,
    )
    return entity
  }

  get questionId(): UniqueEntityID {
    return this.props.questionId
  }

  get attachmentId(): UniqueEntityID {
    return this.props.attachmentId
  }
}
