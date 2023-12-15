import { InMemoryNotificationsRepository } from "../../../../../test/repositories/in-memory-notifications-repository";
import { SendNotificationUseCase } from "./send-notification";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe("SendNotificationUseCase", () => {

	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
		sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
	})

	it("should be able to send a notification", async () => {
		const result = await sut.execute({
			recipientId: "2",
			title: "My Title",
			content: "Content",
		})

		expect(result.isRight()).toBeTruthy()
		expect(inMemoryNotificationsRepository.items[0].id).toEqual(result.isRight() && result.value.notification.id)
	})
})