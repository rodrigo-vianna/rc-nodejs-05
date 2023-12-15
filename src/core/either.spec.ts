import { Either, left, right } from "./either"

const doSomething = (shouldSuccess: boolean): Either<string, number> => shouldSuccess ? right(32) : left("fail")

describe("Either", () => {

	it("should be success result ", async () => {
		const result = doSomething(true)
		expect(result.isRight()).toBe(true)
	})

	it("should be success result ", async () => {
		const result = doSomething(false)
		expect(result.isLeft()).toBe(true)
	})

})