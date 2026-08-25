# Cost Tracking Reference

> Load this on-demand when the user asks about costs or before batch operations. The `cost_tracker.py` commands below are the source project's own ledger tool — ClauKit doesn't ship it. If it isn't installed, keep a running total by hand in the campaign's plan file instead (date, model, resolution, count, estimated cost).

## Pricing Table

| Model | Resolution | Cost/Image | Notes |
|-------|-----------|-----------|-------|
| Connected MCP's model | Any | Verify before use | Check https://ai.google.dev/gemini-api/docs/pricing and the installed MCP config |
| Batch API | Any | Verify before use | Confirm availability and discount before quoting |

Do not quote fixed prices unless they've been verified at https://ai.google.dev/gemini-api/docs/pricing.

## Free Tier Limits

- ~10 requests per minute (RPM)
- ~500 requests per day (RPD)
- Per Google Cloud project, resets midnight Pacific

## Cost Tracker Commands (if the source project's tool is installed)

```bash
# Log a generation
cost_tracker.py log --model gemini-3.1-flash-image-preview --resolution 1K --prompt "coffee shop hero"

# View summary (total + last 7 days)
cost_tracker.py summary

# Today's usage
cost_tracker.py today

# Estimate before batch
cost_tracker.py estimate --model gemini-3.1-flash-image-preview --resolution 1K --count 10

# Reset ledger
cost_tracker.py reset --confirm
```

## Storage

The source tool's ledger is stored at `~/.banana/costs.json`, created automatically on first use. Without that tool installed, track usage manually in the relevant `plans/marketing/<campaign>/` file instead — a simple date/model/resolution/count/cost table is enough to keep batch generation honest.
