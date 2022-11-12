import { expect } from "expect"
import fm from "fetch-mock"
import { it } from "mocha"

const fetch = fm.sandbox().mock("https://example.com", { hello: "world" })

it("does something", async () => {
  const result = await fetch("https://example.com").then(r => r.json())
  expect(result).toMatchObject({ hello: "world" })
})
