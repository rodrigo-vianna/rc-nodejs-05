import { NotificationsRepository } from '../../src/domain/notification/application/repositories/notifications-repository'
import { Notification } from '../../src/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public readonly items: Notification[] = []

  constructor() {}

  public async create(notification: Notification): Promise<void> {
    this.items.push(notification)
  }

  public async findById(id: string): Promise<Notification | null> {
    const item = this.items.find((item) => item.id.toString() === id)

    return item ?? null
  }

  public async save(notification: Notification): Promise<void> {
    const index = this.items.findIndex((item) => item.id === notification.id)

    this.items[index] = notification
  }
}
