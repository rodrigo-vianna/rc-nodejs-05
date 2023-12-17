import { makeQuestion } from "../../../../../test/factories/make-question";
import { InMemoryAttachmentsRepository } from "../../../../../test/repositories/in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "../../../../../test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { InMemoryStudentsRepository } from "../../../../../test/repositories/in-memory-students-repository";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe("FetchRecentQuestionsUseCase", () => {

  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it("should be able to fetch recent questions", async () => {
    await inMemoryQuestionsRepository.create(makeQuestion({
      createdAt: new Date(2023, 12, 3)
    }))
    await inMemoryQuestionsRepository.create(makeQuestion({
      createdAt: new Date(2023, 11, 1)
    }))
    await inMemoryQuestionsRepository.create(makeQuestion({
      createdAt: new Date(2023, 12, 4)
    }))

    const result = await sut.execute({
      page: 1
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.isRight() && result.value.questions).toHaveLength(3)
    expect(result.isRight() && result.value.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 12, 4) }),
      expect.objectContaining({ createdAt: new Date(2023, 12, 3) }),
      expect.objectContaining({ createdAt: new Date(2023, 11, 1) })
    ])
  })

  it("should be able to fetch recent questions", async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const result = await sut.execute({
      page: 2
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.isRight() && result.value.questions).toHaveLength(2)
  })
})