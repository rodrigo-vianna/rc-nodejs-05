import { describe, expect, it } from "vitest"
import { Slug } from "./slug"

describe("Slug", () => {
  it("should be able to create a new slug from text", async () => {
		const slug = Slug.createFromText("  Example question with 'some_title'-  ")
		expect(slug.value).toEqual("example-question-with-some-title")
  })
})