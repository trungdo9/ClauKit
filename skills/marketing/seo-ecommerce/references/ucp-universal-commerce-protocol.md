# UCP — Universal Commerce Protocol

UCP is a Google-initiated open standard, co-developed with Shopify, Etsy,
Wayfair, Target, and Walmart (20+ endorsers), plus payment partners (Stripe,
Visa, Mastercard, Adyen, Amex). Its purpose: let **AI agents discover,
negotiate, and transact with merchants without one-off integrations**. It is
interoperable with **A2A** (Agent2Agent), **AP2** (Agent Payments Protocol),
and **MCP**.

For commerce sites, UCP sits next to **Google Merchant Center feeds** and
**Google Business Profile** as a third leg of agent-era discovery. Google
confirms a first reference implementation for conversational buying in AI Mode
in Search; broader "Universal Cart" rollout details are reported from Google
I/O 2026 keynote coverage — not confirmed on a Google-owned source, so treat
that part as hedged context.

**Primary sources (canonical, revalidate before treating as a hard rule):**
- Google merchant developer guide: `developers.google.com/merchant/ucp`
  (and `/merchant/ucp/guides/ucp-profile`)
- Spec / overview: `ucp.dev`. It lists **2026-04-08** as the latest release
  in its **date-based versioning** scheme (`YYYY-MM-DD`) — check for a newer
  dated release before auditing against this one.

## What UCP is and isn't

| What it is | What it isn't |
|---|---|
| A capability-declaration + negotiation protocol | A new payment processor |
| Transport-agnostic (REST, MCP, A2A) | A replacement for Merchant Center feeds |
| Compatible with AP2 for cryptographic proof of user consent on autonomous purchases | A way to skip being merchant of record |
| Google's reference implementation for conversational buying in AI Mode in Search | A confirmed Google ranking factor |

Merchants stay **Merchant of Record** under UCP — they keep the customer
relationship and post-purchase ownership.

## How a merchant declares a UCP profile

Publish a profile at `/.well-known/ucp` describing capabilities and versions.
General shape (consult the live spec for exact field names before treating
this as authoritative):

```jsonc
{
  "version": "2026-04-08",
  "capabilities": [
    {
      "id": "dev.ucp.shopping.checkout",
      "version": "2026-04-08",
      "endpoint": "https://api.example.com/ucp/checkout"
    },
    {
      "id": "dev.ucp.shopping.fulfillment",
      "version": "2026-04-08",
      "endpoint": "https://api.example.com/ucp/fulfillment"
    },
    {
      "id": "dev.ucp.shopping.discount",
      "version": "2026-04-08",
      "endpoint": "https://api.example.com/ucp/discount"
    }
  ],
  "merchant": {
    "name": "Example Co.",
    "id": "merchant-center-id-here"
  }
}
```

UCP uses **date-based versioning** (`YYYY-MM-DD`) — a literal `"1.0"` does not
match any real UCP release and fails the spec's version negotiation.
Platforms (AI Mode in Search, Gemini, and eventually others) are meant to
auto-discover the profile and negotiate from it.

### Integration paths

- **Native checkout** (default) — full agentic potential; the recommended path.
- **Embedded checkout** (optional, iframe-based) — for specific Google-approved
  merchants with complex/bespoke checkout flows.

Merchants join a waitlist and must be Google-approved before going live.

## Common capabilities to declare

| Capability ID (shape) | Purpose |
|---|---|
| `dev.ucp.shopping.checkout` | Initiate checkout, return totals + payment intent |
| `dev.ucp.shopping.fulfillment` | Quote shipping options and delivery windows |
| `dev.ucp.shopping.discount` | Apply promo codes / loyalty discounts at quote time |
| `dev.ucp.shopping.cart` | Add / remove / update items in agent-managed carts |

The namespace pattern is `dev.ucp.<domain>.<verb>`; exact identifiers and
version values are governed by the live spec — treat this table as a shape,
not a locked enum.

## What this skill audits

For a given site, check:

1. **Presence** — does `/.well-known/ucp` resolve to a valid JSON document?
   (`WebFetch` the URL; a 404 or non-JSON body means "not declared", which is
   an opportunity, not a failure.)
2. **Capability coverage** — which capabilities are declared? Flag missing
   checkout / fulfillment / discount as opportunities (the protocol and
   merchant adoption are both still early).
3. **Endpoint reachability** — are declared endpoints HTTPS, valid TLS, not
   returning 5xx? A `WebFetch` per declared endpoint is enough for a
   reachability signal; this is not full negotiation testing.
4. **Version coherence** — is the declared `version` a valid **date-based**
   (`YYYY-MM-DD`) release? Flag a literal `"1.0"` or any non-date string as
   invalid.
5. **Integration path** — does the profile imply Native (default) or Embedded
   (approved-merchant) checkout?

Never score the absence of UCP as a critical failure — frame it as an
opportunity, especially for merchants already on Google Merchant Center.
(UCP itself is live; what's early is broad merchant adoption.)

## How UCP interacts with existing surfaces

| Existing surface | Relationship to UCP |
|---|---|
| Google Merchant Center feed | Required upstream — UCP capabilities reference Merchant Center products by ID |
| Google Business Profile | Independent — UCP is product/order; GBP is store/location |
| Product schema (`hasMerchantReturnPolicy`, `shippingDetails`) | Complementary — UCP exposes the same data at the API layer; schema exposes it at the page layer |
| AP2 (Agent Payments Protocol) | Pairs with UCP: UCP handles discovery + checkout structure, AP2 handles cryptographic proof of user consent. Treat FIDO-governance and version details as secondary-source context, not canonical audit guidance, until a primary source confirms them. |

A merchant that already has clean Merchant Center feeds, complete Product
schema, and a checkout API can typically declare a UCP profile in a sprint.

## Audit posture by tier

- **Tier 1 (e-commerce sites already on Merchant Center):** recommend
  declaring a UCP profile as a forward-looking opportunity.
- **Tier 2 (DTC sites not on Merchant Center):** don't recommend UCP yet —
  Merchant Center is the prerequisite to most flows.
- **Tier 3 (informational / B2B sites):** ignore UCP — but don't blanket-
  exclude hospitality/restaurant sites: UCP is expanding into **Lodging and
  Food** verticals (hotel booking in AI Mode, food delivery via Google Maps).

## Landscape notes (treat as time-sensitive; revalidate)

- "Universal Cart" rollout beyond AI Mode in Search (Gemini app, YouTube/Gmail,
  country expansion, retailer lists) is reported from keynote coverage, not a
  Google-owned source — hedge it accordingly. The confirmed audit guidance
  stays: Merchant Center eligibility, clean product data, and
  `/.well-known/ucp` readiness for AI Mode in Search.
- UCP is one of several agentic-checkout protocols emerging alongside OpenAI's
  Agentic Commerce Protocol and Microsoft Copilot's Shopify-based checkout —
  keep those as secondary-sourced context, not audit criteria for this skill.

## Re-check triggers

Re-verify this reference when:
- A newer dated UCP spec supersedes the one cited above.
- AP2 advances past the version/governance milestones cited above.
- UCP expands to new verticals or surfaces beyond Search/Gemini/YouTube/Gmail.
