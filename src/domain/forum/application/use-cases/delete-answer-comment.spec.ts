import { makeAnswerComment } from "../../../../../test/factories/make-answer-comment";
import { InMemoryAnswerCommentsRepository } from "../../../../../test/repositories/in-memory-answer-comments-repository";
import { InMemoryStudentsRepository } from "../../../../../test/repositories/in-memory-students-repository";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("DeleteAnswerCommentUseCase", () => {

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository)
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it("should delete a answer comment", async () => {
    const newAnswerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('answerComment-1'))

    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    await sut.execute({
      answerCommentId: 'answerComment-1',
      authorId: 'author-1'
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a answer comment", async () => {
    const newAnswerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('answerComment-1'))

    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    const result = await sut.execute({
      answerCommentId: 'answerComment-1',
      authorId: 'author-2'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1)
  })
})