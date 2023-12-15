import { makeAnswer } from "../../../../../test/factories/make-answer";
import { InMemoryAnswerAttachmentsRepository } from "../../../../../test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe("FetchQuestionAnswersUseCase", () => {

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it("should be able to fetch recent answers", async () => {
    await inMemoryAnswersRepository.create(makeAnswer({
      questionId: new UniqueEntityID('question-1'),
      createdAt: new Date(2023, 12, 3)
    }))
    await inMemoryAnswersRepository.create(makeAnswer({
      questionId: new UniqueEntityID('question-1'),
      createdAt: new Date(2023, 11, 1)
    }))
    await inMemoryAnswersRepository.create(makeAnswer({
      questionId: new UniqueEntityID('question-1'),
      createdAt: new Date(2023, 12, 4)
    }))
    await inMemoryAnswersRepository.create(makeAnswer({
      questionId: new UniqueEntityID('question-2'),
    }))

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.isRight() && result.value.answers).toHaveLength(3)
  })

  it("should be able to fetch recent answers", async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryAnswersRepository.create(makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }))
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.isRight() && result.value.answers).toHaveLength(2)
  })
})