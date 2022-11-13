import { expect } from "expect"
import { it } from "mocha"
import { SearchParams, SearchResult } from "./decoders.js"

const { HYPOTHESIS_USER, HYPOTHESIS_TOKEN } = process.env

it("calls hypothesis", async () => {
  /** @type {SearchParams} */
  const params = {
    user: `acct:${HYPOTHESIS_USER}`,
  }

  const url = "https://api.hypothes.is/api/search?"
    + new URLSearchParams(SearchParams.parse(params))

  const headers = new Headers({
    Authorization: `Bearer ${HYPOTHESIS_TOKEN}`,
  })

  const data = await fetch(url, { headers })
    .then(result => result.json())
    .then(SearchResult.parse)

  expect(data.total).toBeGreaterThan(0)
})
