import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '../../src/domain/notification/enterprise/entities/notification'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
): Notification {
  const newNotification = Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
  return newNotification
}
