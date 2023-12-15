import { makeAnswer } from "../../../../../test/factories/make-answer";
import { makeQuestion } from "../../../../../test/factories/make-question";
import { InMemoryAnswerAttachmentsRepository } from "../../../../../test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";
import { InMemoryQuestionAttachmentsRepository } from "../../../../../test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("ChooseQuestionBestAnswerUseCase", () => {

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    sut = new ChooseQuestionBestAnswerUseCase(inMemoryQuestionsRepository, inMemoryAnswersRepository)
  })

  it("should be able to choose the question best answer", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.value
    })

    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toBe(answer.id)
  })

  it("should not be able to choose another user quesiton best answer", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      authorId: new UniqueEntityID('author-1'),
      questionId: question.id
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2'
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toBeFalsy()
  })
})