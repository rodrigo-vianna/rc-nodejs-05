import { AggregateRoot } from '../../../../core/entities/aggregate-root'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { Optional } from '../../../../core/types/optional'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'
import { QuestionAttachmentList } from './question-attachment-list'
import { Slug } from './value-objects/slug'

export interface QuestionProps {
  title: string
  content: string
  slug: Slug
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID | null
  attachments: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date | null
}

export class Question extends AggregateRoot<QuestionProps> {
  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const entity = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: props.createdAt ?? new Date(),
        attachments: props.attachments ?? new QuestionAttachmentList(),
      },
      id,
    )
    return entity
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get title(): string {
    return this.props.title
  }

  set title(value: string) {
    this.props.title = value
    this.props.slug = Slug.createFromText(value)
    this.touch()
  }

  get content(): string {
    return this.props.content
  }

  set content(value: string) {
    this.props.content = value
    this.touch()
  }

  get slug(): Slug {
    return this.props.slug
  }

  get authorId(): UniqueEntityID {
    return this.props.authorId
  }

  get bestAnswerId(): UniqueEntityID | undefined | null {
    return this.props.bestAnswerId
  }

  set bestAnswerId(value: UniqueEntityID | undefined | null) {
    if (value && value !== this.props.bestAnswerId) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, value))
    }

    this.props.bestAnswerId = value
    this.touch()
  }

  get attachments(): QuestionAttachmentList {
    return this.props.attachments
  }

  set attachments(value: QuestionAttachmentList) {
    this.props.attachments = value
    this.touch()
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  get excerpt(): string {
    return this.content.slice(0, 120).trimEnd().concat('...')
  }
}
