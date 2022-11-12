import { expect } from "expect"
import fm from "fetch-mock"
import { it } from "mocha"

const {
  HYPOTHESIS_USER: USER,
  HYPOTHESIS_TOKEN: TOKEN,
} = process.env

const fetch = fm.sandbox().mock("https://example.com", { hello: "world" })

it("mocks fetch", async () => {
  const result = await fetch("https://example.com").then(r => r.json())
  expect(result).toMatchObject({ hello: "world" })
})

it("reads variables from .env", async () => {
  expect(USER).toMatch(/.+@hypothes\.is$/)
  expect(TOKEN).not.toBeUndefined()
})
