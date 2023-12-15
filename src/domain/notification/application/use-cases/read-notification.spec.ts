import { makeNotification } from "../../../../../test/factories/make-notification";
import { InMemoryNotificationsRepository } from "../../../../../test/repositories/in-memory-notifications-repository";
import { NotAllowedError } from "../../../forum/application/use-cases/errors/not-allowed-error";
import { ReadNotificationUseCase } from "./read-notification";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe("ReadNotificationUseCase", () => {

	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
		sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
	})

	it("should be able to read a notification", async () => {
		const newNotification = makeNotification()

		await inMemoryNotificationsRepository.create(newNotification)

		const result = await sut.execute({
			recipientId: newNotification.recipientId.value,
			notificationId: newNotification.id.value
		})

		expect(result.isRight()).toBeTruthy()
		expect(inMemoryNotificationsRepository.items[0].readAt).toBeDefined()
	})

	it("should not be able to read a notification from another user", async () => {
		const newNotification = makeNotification()

		await inMemoryNotificationsRepository.create(newNotification)

		const result = await sut.execute({
			recipientId: 'another-user',
			notificationId: newNotification.id.value
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(NotAllowedError)
		expect(inMemoryNotificationsRepository.items[0].readAt).toBeUndefined()
	})
})