import { makeAnswer } from "../../../../../test/factories/make-answer";
import { InMemoryAnswerAttachmentsRepository } from "../../../../../test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswerCommentsRepository } from "../../../../../test/repositories/in-memory-answer-comments-repository";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";
import { CommentOnAnswerUseCase } from "./comment-on-answer";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerUseCase;

describe("CommentOnAnswerUseCase", () => {

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository
    )
  })

  it("should be able to comment on answer", async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.value,
      authorId: "author-1",
      content: "Content",
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAnswerCommentsRepository.items[0].id).toEqual(result.isRight() && result.value.answerComment.id)
  })

  it("should not be able to comment on answer that doesn't exist", async () => {
    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: "author-1",
      content: "Content",
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

})