import { InMemoryAnswerAttachmentsRepository } from "../../../../../test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";
import { AnswerQuestionUseCase } from "./answer-question";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("AnswerQuestionUseCase", () => {

	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
		sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
	})

	it("should answer a question", async () => {
		const result = await sut.execute({
			questionId: "2",
			instructorId: "1",
			content: "Answer content",
			attachmentsIds: []
		})

		expect(result.isRight()).toBeTruthy()
		expect(inMemoryAnswersRepository.items[0].id).toEqual(result.isRight() && result.value.answer.id)
	})
})