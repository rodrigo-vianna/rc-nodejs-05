import { makeQuestionComment } from "../../../../../test/factories/make-question-comment";
import { InMemoryQuestionCommentsRepository } from "../../../../../test/repositories/in-memory-question-comments-repository";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";

let inMemoryCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("FetchQuestionCommentsUseCase", () => {

  beforeEach(() => {
    inMemoryCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryCommentsRepository)
  })

  it("should be able to fetch question comments by question id", async () => {
    await inMemoryCommentsRepository.create(makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      createdAt: new Date(2023, 12, 3)
    }))
    await inMemoryCommentsRepository.create(makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      createdAt: new Date(2023, 11, 1)
    }))
    await inMemoryCommentsRepository.create(makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      createdAt: new Date(2023, 12, 4)
    }))
    await inMemoryCommentsRepository.create(makeQuestionComment({
      questionId: new UniqueEntityID('question-2'),
    }))

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.isRight() && result.value.questionComments).toHaveLength(3)
    expect(result.isRight() && result.value.questionComments).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 12, 4) }),
      expect.objectContaining({ createdAt: new Date(2023, 12, 3) }),
      expect.objectContaining({ createdAt: new Date(2023, 11, 1) })
    ])
  })

  it("should be able to fetch question comments by question id", async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryCommentsRepository.create(makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }))
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.isRight() && result.value.questionComments).toHaveLength(2)
  })
})