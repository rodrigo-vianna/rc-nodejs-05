import { makeQuestion } from "../../../../../test/factories/make-question";
import { InMemoryQuestionAttachmentsRepository } from "../../../../../test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { EditQuestionUseCase } from "./edit-question";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe("EditQuestionUseCase", () => {

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionAttachmentsRepository)
  })

  it("should edit a question", async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
      title: 'Old title',
      content: 'Old content'
    }, new UniqueEntityID('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
      title: 'New title',
      content: 'New content',
      attachmentsIds: []
    })

    expect(inMemoryQuestionsRepository.items[0].title).toBe('New title')
    expect(inMemoryQuestionsRepository.items[0].content).toBe('New content')
  })

  it("should not be able to edit a question", async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
      title: 'Old title',
      content: 'Old content'
    }, new UniqueEntityID('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-2',
      title: 'New title',
      content: 'New content',
      attachmentsIds: []
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryQuestionsRepository.items[0].title).toBe('Old title')
    expect(inMemoryQuestionsRepository.items[0].content).toBe('Old content')
  })
})