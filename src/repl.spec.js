import { expect } from "expect"
import { it } from "mocha"
import { Annotation, SearchParams, SearchResult } from "./decoders.js"

const { HYPOTHESIS_USER, HYPOTHESIS_TOKEN } = process.env

it("gets a single annotation", async () => {
  const id = "XARfeErKEe2WSa8An3b-XA"
  const url = `https://api.hypothes.is/api/annotations/${id}`

  const headers = new Headers({
    Authorization: `Bearer ${HYPOTHESIS_TOKEN}`,
  })

  const data = await fetch(url, { headers })
    .then(result => result.json())
    .then(Annotation.parse)

  expect(data.target[0].selector.filter(s => s.type === "TextQuoteSelector"))
    .toHaveLength(1)
})

it("searches hypothesis", async () => {
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
