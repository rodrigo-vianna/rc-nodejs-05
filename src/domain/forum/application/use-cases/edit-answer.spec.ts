import { makeAnswer } from "../../../../../test/factories/make-answer";
import { InMemoryAnswerAttachmentsRepository } from "../../../../../test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { EditAnswerUseCase } from "./edit-answer";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("EditAnswerUseCase", () => {

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  it("should edit a answer", async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1'),
      content: 'Old content'
    }, new UniqueEntityID('answer-1'))

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
      content: 'New content'
    })

    expect(inMemoryAnswersRepository.items[0].content).toBe('New content')
  })

  it("should not be able to edit a answer", async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1'),
      content: 'Old content'
    }, new UniqueEntityID('answer-1'))

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-2',
      content: 'New content'
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryAnswersRepository.items[0].content).toBe('Old content')
  })
})