import { makeQuestionComment } from "../../../../../test/factories/make-question-comment";
import { InMemoryQuestionCommentsRepository } from "../../../../../test/repositories/in-memory-question-comments-repository";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("DeleteQuestionCommentUseCase", () => {

  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it("should delete a question comment", async () => {
    const newQuestionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('questionComment-1'))

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    await sut.execute({
      questionCommentId: 'questionComment-1',
      authorId: 'author-1'
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a question comment", async () => {
    const newQuestionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('questionComment-1'))

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    const result = await sut.execute({
      questionCommentId: 'questionComment-1',
      authorId: 'author-2'
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1)
  })
})