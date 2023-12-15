import { makeQuestion } from "../../../../../test/factories/make-question";
import { InMemoryQuestionAttachmentsRepository } from "../../../../../test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionCommentsRepository } from "../../../../../test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe("CommentOnQuestionUseCase", () => {

	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
		sut = new CommentOnQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionCommentsRepository
		)
	})

	it("should be able to comment on question", async () => {
		const question = makeQuestion()

		await inMemoryQuestionsRepository.create(question)

		const result = await sut.execute({
			questionId: question.id.value,
			authorId: "author-1",
			content: "Content",
		})

		expect(result.isRight()).toBeTruthy()
		expect(inMemoryQuestionCommentsRepository.items[0].id).toEqual(result.isRight() && result.value.questionComment.id)
	})

	it("should not be able to comment on question that doesn't exist", async () => {
		const result = await sut.execute({
			questionId: 'question-1',
			authorId: "author-1",
			content: "Content",
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
	})

})