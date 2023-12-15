import { AggregateRoot } from '../../../../core/entities/aggregate-root'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

export interface AttachmentProps {
  title: string
  link: string
}

export class Attachment extends AggregateRoot<AttachmentProps> {
  static create(props: AttachmentProps, id?: UniqueEntityID) {
    const entity = new Attachment(
      {
        ...props,
      },
      id,
    )
    return entity
  }

  get title(): string {
    return this.props.title
  }

  set title(value: string) {
    this.props.title = value
  }
}
