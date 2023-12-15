import { AggregateRoot } from '../../../../core/entities/aggregate-root'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

export interface AnswerAttachmentProps {
  answerId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class AnswerAttachment extends AggregateRoot<AnswerAttachmentProps> {
  static create(props: AnswerAttachmentProps, id?: UniqueEntityID) {
    const entity = new AnswerAttachment(
      {
        ...props,
      },
      id,
    )
    return entity
  }

  get answerId(): UniqueEntityID {
    return this.props.answerId
  }

  get attachmentId(): UniqueEntityID {
    return this.props.attachmentId
  }
}
