# Marketplace data reference — Google Shopping & Amazon

Field reference for when a DataForSEO Merchant API MCP (or an equivalent
provider) is wired up via `/ck:use-mcp`. Absent that, fall back to a manual
`WebSearch`/`WebFetch` spot-check of the Shopping tab or the Amazon listing
page and label the result `[marketplace data unverified]` — never invent
these fields.

## Google Shopping — product search

Typical parameters: `keyword` (required); `location_code` / `language_code`
(market targeting); `price_min` / `price_max` (filter); `sort_by`
(`relevance`, `price_low_to_high`, `price_high_to_low`, `rating`); `depth`
(result count, commonly defaulted to 100).

Response fields to extract:

| Field | Meaning |
|---|---|
| `title` | product listing title |
| `price` | numeric price |
| `currency` | currency code (USD, EUR, ...) |
| `seller` | merchant name |
| `rating` | product rating, float 0–5 |
| `reviews_count` | number of reviews |
| `url` | product listing URL |
| `image_url` | product image URL |
| `availability` | `in_stock` / `out_of_stock` / `preorder` |
| `delivery_info` | shipping details text |
| `product_id` | Google Shopping product ID |

## Google Shopping — seller search

Same parameters as product search. Response fields: `seller_name`,
`seller_rating`, `seller_reviews_count`, `price` (as offered by this seller),
`delivery_info`, `url`.

## Amazon — product search

Typical parameters: `keyword` (required); `location_code` / `language_code`;
`depth`; `sort_by` (`relevance`, `price_low_to_high`, `price_high_to_low`,
`avg_customer_review`).

Response fields to extract:

| Field | Meaning |
|---|---|
| `title` | product title |
| `price` | numeric price |
| `currency` | currency code |
| `seller` | seller/brand name |
| `rating` | star rating, float 0–5 |
| `reviews_count` | review count |
| `url` | Amazon product URL |
| `image_url` | product image |
| `availability` | stock status |
| `asin` | Amazon Standard Identification Number |
| `is_prime` | Prime eligibility (boolean) |
| `is_best_seller` | Best Seller badge (boolean) |

Amazon endpoints are typically gated behind an explicit cost-approval step by
any DataForSEO-style provider — treat them as "always confirm with the user
before spending" regardless of provider.

## Task/poll pattern

Most Merchant-style APIs are async: POST a task with parameters, poll for
results with exponential backoff (2s, 4s, 8s, capped around 60s), then GET
the completed result by task ID. This is materially cheaper than a
synchronous "live" call on providers that price the two differently.

## Rate limits

Provider-dependent; a common ceiling on standard plans is on the order of a
few thousand tasks/minute and tens of thousands/day. Back off on HTTP 429
(wait ~60s, retry) rather than hammering the endpoint.

## Data normalization

Whatever the raw response shape, normalize before analysis:

| Field | Raw | Normalized |
|---|---|---|
| Price | String `"$29.99"` or float | Float `29.99` |
| Currency | Mixed formats | ISO 4217 code (USD, EUR, GBP) |
| Availability | Various strings | Enum: `in_stock`, `out_of_stock`, `preorder`, `unknown` |
| Rating | Integer or float | Float rounded to 1 decimal |
| Reviews | String or int | Integer |

## Cost reference

Provider pricing changes over time — check the current rate card for whatever
Merchant API MCP is configured before a bulk run, and route quota/budget
guardrails through [[seo-dataforseo]] rather than assuming a fixed
per-call cost here.
