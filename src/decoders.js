import { z } from "zod"

/**
 * @typedef {z.infer<typeof AnnotationSelector>} AnnotationSelector
 * @typedef {z.infer<typeof Annotation>} Annotation
 * @typedef {z.infer<typeof SearchParams>} SearchParams
 * @typedef {z.infer<typeof SearchResult>} SearchResult
 */

/**
 * An **incomplete** decoder of a web annotation selector.
 * https://www.w3.org/TR/annotation-model/
 */
export const AnnotationSelector = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("TextQuoteSelector"),
    exact: z.string(),
    prefix: z.string(),
    suffix: z.string(),
  }),
  z.object({ type: z.literal("FragmentSelector") }),
  z.object({ type: z.literal("CSSSelector") }),
  z.object({ type: z.literal("XPathSelector") }),
  z.object({ type: z.literal("TextPositionSelector") }),
  z.object({ type: z.literal("DataPositionSelector") }),
  z.object({ type: z.literal("SVGSelector") }),
  z.object({ type: z.literal("RangeSelector") }),
])

/**
 * An **incomplete** decoder of the Hypothes.is API annotation  type.
 * https://h.readthedocs.io/en/latest/api-reference/#tag/annotations/paths/~1search/get
 */
export const Annotation = z.object({
  id: z.string(),

  /** ISO 8601 date */
  created: z.string(),
  /** ISO 8601 date */
  updated: z.string(),

  /** URI to which the annotation applies */
  uri: z.string().url(),

  /** The user text content associated with this annotation (i.e. notes) */
  text: z.string(),
  tags: z.array(z.string()),

  /** The user account ID in the format `acct:<username>@<authority>` */
  user: z.string(),
  /** The unique identifier for the annotation's group */
  group: z.string(),

  /** An object containing hypermedia links for this annotation */
  links: z.object({
    html: z.string().url(),
    incontext: z.string().url(),
    json: z.string().url(),
  }),

  /** ⚠️ **WARNING:** Not mentioned in the API docs for some reason... */
  document: z.union([
    z.object({ title: z.array(z.string()) }),
    z.object({}),
  ]),

  target: z.array(
    z.object({
      /** The target URI for the annotation */
      source: z.string().url(),
      /** An array of selectors that refine this annotation's target */
      selector: z.array(AnnotationSelector),
    }),
  ),
})

/**
 * An **incomplete** decoder of the Hypothes.is API search params.
 * https://h.readthedocs.io/en/latest/api-reference/#tag/annotations/paths/~1search/get
 */
export const SearchParams = z.object({
  /** The maximum number of annotations to return (default: 20) */
  limit: z.string().optional(),

  /** The order in which the results should be sorted (default: "desc") */
  order: z.union([z.literal("asc"), z.literal("desc")]).optional(),

  /** The field by which annotations should be sorted (default: "updated") */
  sort: z.union([
    z.literal("created"),
    z.literal("group"),
    z.literal("id"),
    z.literal("updated"),
    z.literal("user"),
  ]).optional(),

  /** Start point for the (sorted) page of results (depending on sort field) */
  search_after: z.string().optional(),

  /**
   * Limit to results matching a specific URI, or equivalent URIs, e.g.:
   *
   *  - `http://example.com/articles/01/name` (URL)
   *  - `doi:10.1.1/1234` (DOI)
   *  - `urn:x-pdf:1234` (PDF fingerprint)
   */
  uri: z.string().url().optional(),

  /**
   * Limit the results to annotations containing the given keyword (tokenized
   * chunk) in the URI. The value must exactly match an individual URI keyword.
   *
   * URIs are split on characters `#+/:=?.-` into their keywords.
   */
  "uri.parts": z.string().optional(),

  /**
   * ⚠️ **WARNING:** This feature is experimental and the API may change.
   *
   * Limit the results to annotations whose URIs match the wildcard pattern.
   *
   * `*` will match any character sequence (including an empty one), and a `_`
   * will match any single character. Wildcards are only permitted within the
   * path and query parts of the URI. Escaping wildcards is not supported.
   *
   * Examples of valid values:
   *   - `http://foo.com/*`
   *   - `urn:x-pdf:*`
   *   - `file://localhost/_bc.pdf`
   *
   * Examples of invalid values (not within path or query parts of URI):
   *   - `*foo.com`
   *   - `u_n:*`
   *   - `file://*`
   *   - `http://foo.com*`
   */
  wildcard_uri: z.string().url().optional(),

  /**
   * Limit the results to annotations made by the specified user.
   *
   * Example: `acct:username@hypothes.is`
   */
  user: z.string().optional(),

  /**
   * Limit the results to annotations made in the specified group (by group ID).
   *
   * Example: `8JmD3iz1`
   */
  group: z.string().optional(),

  /**
   * Limit the results to annotations tagged with the specified value.
   *
   * For example: `artificial intelligence` will find all annotations whose tags
   * contain both `artificial` AND `intelligence`.
   */
  tag: z.string().optional(),

  /**
   * Similar to tag but allows a comma-separated list of multiple tags.
   *
   * For example: `intelligence,artificial` will find all annotations whose
   * tags contain both `artificial` AND `intelligence`.
   */
  tags: z.string().optional(),

  /**
   * Limit the results to annotations who contain the indicated keyword in any
   * of the following fields:
   * - `quote`
   * - `tags`
   * - `text`
   * - `url`
   */
  any: z.string().optional(),

  /**
   * Limit the results to annotations that contain this text inside the text
   * that was annotated.
   *
   * For example: `unicorn helmets` would return all annotations containing
   * `unicorn` OR `helmets` in their quoted (i.e. annotated) text.
   */
  quote: z.string().optional(),

  /**
   * Returns annotations that are replies to this parent annotation ID.
   */
  references: z.string().optional(),

  /**
   * Limit the results to annotations that contain this text in their textual
   * body.
   *
   * For example: `penguin strength` would return all annotations containing
   * `penguin` OR `strength` in their text (body) content.
   */
  text: z.string().optional(),
})

/**
 * An **incomplete** decoder of the Hypothes.is API search response.
 * https://h.readthedocs.io/en/latest/api-reference/#tag/annotations/paths/~1search/get
 */
export const SearchResult = z.object({
  total: z.number().int(),
  rows: z.array(Annotation),
})
