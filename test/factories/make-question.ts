import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '../../src/domain/forum/enterprise/entities/question'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
): Question {
  const newQuestion = Question.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.words({
        max: 5,
        min: 2,
      }),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
  return newQuestion
}
