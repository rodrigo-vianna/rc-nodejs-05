import { makeQuestion } from "../../../../../test/factories/make-question";
import { InMemoryQuestionAttachmentsRepository } from "../../../../../test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe("GetQuestionBySlugUseCase", () => {

	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
	})

	it("should be get a question by slug", async () => {
		const newQuestion = makeQuestion({
			slug: Slug.create("example-question")
		})

		await inMemoryQuestionsRepository.create(newQuestion)

		const result = await sut.execute({
			slug: "example-question"
		})

		expect(result.isRight()).toBeTruthy()
		expect(inMemoryQuestionsRepository.items[0].id).toEqual(result.isRight() && result.value.question.id)
	})
})