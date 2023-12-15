import { makeAnswerComment } from "../../../../../test/factories/make-answer-comment";
import { InMemoryAnswerCommentsRepository } from "../../../../../test/repositories/in-memory-answer-comments-repository";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";

let inMemoryCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("FetchAnswerCommentsUseCase", () => {

  beforeEach(() => {
    inMemoryCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryCommentsRepository)
  })

  it("should be able to fetch answer comments by answer id", async () => {
    await inMemoryCommentsRepository.create(makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      createdAt: new Date(2023, 12, 3)
    }))
    await inMemoryCommentsRepository.create(makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      createdAt: new Date(2023, 11, 1)
    }))
    await inMemoryCommentsRepository.create(makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      createdAt: new Date(2023, 12, 4)
    }))
    await inMemoryCommentsRepository.create(makeAnswerComment({
      answerId: new UniqueEntityID('answer-2'),
    }))

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.isRight() && result.value.answerComments).toHaveLength(3)
    expect(result.isRight() && result.value.answerComments).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 12, 4) }),
      expect.objectContaining({ createdAt: new Date(2023, 12, 3) }),
      expect.objectContaining({ createdAt: new Date(2023, 11, 1) })
    ])
  })

  it("should be able to fetch answer comments by answer id", async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryCommentsRepository.create(makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }))
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.isRight() && result.value.answerComments).toHaveLength(2)
  })
})