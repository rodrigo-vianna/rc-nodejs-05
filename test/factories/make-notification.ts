import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '../../src/domain/notification/enterprise/entities/notification'
import { PrismaNotificationMapper } from '../../src/infra/database/prisma/mappers/prisma-notification-mapper'
import { PrismaService } from '../../src/infra/database/prisma/prisma.service'

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

@Injectable()
export class NotificationFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaNotification(
    data: Partial<NotificationProps> = {},
  ): Promise<Notification> {
    const notification = makeNotification(data)

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    })

    return notification
  }
}