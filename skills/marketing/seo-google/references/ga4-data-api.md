# GA4 Data API v1beta Reference

## Overview

The Google Analytics Data API v1beta provides programmatic access to GA4 report data. For SEO, the primary use case is organic traffic analysis. For simple, single-report reads, `skills/automation/mcp-ga4/SKILL.md`'s `mcp__ga4__runReport` tool (when configured) is the lighter-weight path — reach for the raw calls below when that MCP wrapper isn't configured, or the ask needs a shape it doesn't expose (e.g. `batchRunReports`, `checkCompatibility`).

**Base URL:** `https://analyticsdata.googleapis.com/v1beta`

## Key Methods

| Method | Description |
|--------|-------------|
| `properties.runReport` | Run a standard report |
| `properties.batchRunReports` | Up to 5 reports in one call |
| `properties.runRealtimeReport` | Last 30 minutes of data |
| `properties.getMetadata` | Available dimensions and metrics |
| `properties.checkCompatibility` | Verify dimension/metric combinations |

## runReport Request

```json
{
  "property": "properties/123456789",
  "dimensions": [
    { "name": "date" },
    { "name": "landingPage" }
  ],
  "metrics": [
    { "name": "sessions" },
    { "name": "totalUsers" }
  ],
  "dateRanges": [
    { "startDate": "28daysAgo", "endDate": "yesterday" }
  ],
  "dimensionFilter": {
    "filter": {
      "fieldName": "sessionDefaultChannelGroup",
      "stringFilter": {
        "matchType": "EXACT",
        "value": "Organic Search"
      }
    }
  },
  "orderBys": [
    { "metric": { "metricName": "sessions" }, "desc": true }
  ],
  "limit": 100,
  "returnPropertyQuota": true
}
```

## SEO-Relevant Dimensions

| Dimension | Description |
|-----------|-------------|
| `date` | Date in YYYYMMDD format |
| `pagePath` | Page path (e.g., `/blog/post`) |
| `landingPage` | Entry page path |
| `landingPagePlusQueryString` | Entry page with query params |
| `fullPageUrl` | Full page URL |
| `pageTitle` | Page title |
| `sessionSource` | Traffic source (e.g., `google`) |
| `sessionMedium` | Traffic medium (e.g., `organic`) |
| `sessionDefaultChannelGroup` | Channel grouping (e.g., `Organic Search`) |
| `country` | User country |
| `deviceCategory` | `desktop`, `mobile`, `tablet` |
| `hostName` | Domain name |
| `pageReferrer` | Referrer URL |

## SEO-Relevant Metrics

| Metric | Description |
|--------|-------------|
| `sessions` | Number of sessions |
| `totalUsers` | Total unique users |
| `newUsers` | First-time users |
| `activeUsers` | Users with engagement |
| `screenPageViews` | Page views |
| `bounceRate` | Bounce rate (0-1, multiply by 100 for %) |
| `averageSessionDuration` | Avg duration in seconds |
| `engagementRate` | Engaged session rate (0-1) |
| `keyEvents` | Key events (replaced deprecated `conversions`) |
| `eventCount` | Total event count |

## Filter Expressions

### String Filter

```json
{
  "filter": {
    "fieldName": "sessionDefaultChannelGroup",
    "stringFilter": {
      "matchType": "EXACT",
      "value": "Organic Search"
    }
  }
}
```

Match types: `EXACT`, `BEGINS_WITH`, `ENDS_WITH`, `CONTAINS`, `FULL_REGEXP`, `PARTIAL_REGEXP`

### Combining Filters

```json
{
  "andGroup": {
    "expressions": [
      { "filter": { "fieldName": "country", "stringFilter": { "matchType": "EXACT", "value": "US" }}},
      { "filter": { "fieldName": "deviceCategory", "stringFilter": { "matchType": "EXACT", "value": "mobile" }}}
    ]
  }
}
```

Also supports `orGroup` and `notExpression`.

## Date Range Shortcuts

| Value | Meaning |
|-------|---------|
| `today` | Current day |
| `yesterday` | Previous day |
| `NdaysAgo` | N days ago (e.g., `28daysAgo`) |
| `YYYY-MM-DD` | Specific date |

Up to 4 date ranges per request (for period-over-period comparison).

## Token-Based Quotas

| Quota | Limit | Scope |
|-------|-------|-------|
| Daily tokens | 25,000 | Per property per project |
| Hourly tokens | 5,000 | Per property per project |
| Concurrent requests | 10 | Per property per project |
| Hourly tokens (project-wide) | 1,250 | Per project per property per hour |

Set `returnPropertyQuota: true` to monitor consumption. Simple reports cost ~1-10 tokens; complex ones up to ~100.

## Bash example (curl, service-account bearer token)

```bash
curl -s -X POST \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  "https://analyticsdata.googleapis.com/v1beta/properties/123456789:runReport" \
  -d '{
    "dimensions": [{"name": "landingPage"}],
    "metrics": [{"name": "sessions"}, {"name": "totalUsers"}],
    "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
    "dimensionFilter": {"filter": {"fieldName": "sessionDefaultChannelGroup", "stringFilter": {"matchType": "EXACT", "value": "Organic Search"}}},
    "orderBys": [{"metric": {"metricName": "sessions"}, "desc": true}],
    "limit": 50,
    "returnPropertyQuota": true
  }'
```

`$ACCESS_TOKEN` is a short-lived OAuth token minted from the service-account JSON (e.g. via `gcloud auth print-access-token` after `gcloud auth activate-service-account --key-file=...`, or any equivalent JWT-exchange step) — never paste the service-account private key itself into a request.

## Authentication
- **Scope:** `https://www.googleapis.com/auth/analytics.readonly`
- Service account must have **Viewer** role in GA4 property
- Add via GA4 Admin > Property Access Management
