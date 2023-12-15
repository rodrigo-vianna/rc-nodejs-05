import { DomainEvents } from '../../../../core/events/domain-events'
import { EventHandler } from '../../../../core/events/event-handler'
import { QuestionsRepository } from '../../../forum/application/repositories/questions-repository'
import { AnswerCreatedEvent } from '../../../forum/enterprise/events/asnwer-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({
    answer,
  }: AnswerCreatedEvent): Promise<void> {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) return

    await this.sendNotification.execute({
      recipientId: question.authorId.toString(),
      title: `New answer for "${question.title
        .substring(0, 20)
        .concat('...')}"`,
      content: answer.excerpt,
    })
  }
}
