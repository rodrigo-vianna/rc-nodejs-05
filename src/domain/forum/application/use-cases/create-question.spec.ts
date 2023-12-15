import { InMemoryQuestionAttachmentsRepository } from "../../../../../test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { CreateQuestionUseCase } from "./create-question";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe("CreateQuestionUseCase", () => {

	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
		sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
	})

	it("should create a question", async () => {
		const result = await sut.execute({
			authorId: "2",
			title: "My Title",
			content: "Content",
			attachmentsIds: [],
		})

		expect(result.isRight()).toBeTruthy()
		expect(inMemoryQuestionsRepository.items[0].id).toEqual(result.isRight() && result.value.question.id)
	})

	it("should create a question with attachments", async () => {
		const result = await sut.execute({
			authorId: "2",
			title: "My Title",
			content: "Content",
			attachmentsIds: ['1', '2'],
		})

		expect(result.isRight()).toBeTruthy()
		expect(inMemoryQuestionsRepository.items[0].id).toEqual(result.isRight() && result.value.question.id)
		expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
	})
})