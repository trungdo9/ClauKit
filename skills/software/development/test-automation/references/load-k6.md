# Load Testing with k6

The four-step method (write with thresholds → run → scale gradually → compare to
a baseline) is in [../SKILL.md](../SKILL.md) § Load Testing. This file holds the
script and the numbers.

## Script

Thresholds are the pass/fail gate: k6 exits non-zero when one fails, so the same
script gates CI without anyone reading the output.

```javascript
// load-test.js — run: k6 run -e USERS=50 -e RAMP_UP=5m load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

const USERS = Number(__ENV.USERS || 10);
const RAMP_UP = __ENV.RAMP_UP || '1m';
const BASE_URL = __ENV.BASE_URL || 'https://api.example.com';

export const options = {
  stages: [
    { duration: RAMP_UP, target: USERS }, // ramp up
    { duration: '5m', target: USERS },    // steady state — this is what you measure
    { duration: '1m', target: 0 },        // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/users`);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

For a quick smoke run, replace `stages` with `vus: 10, duration: '30s'`.

## Threshold Targets

Starting points — replace them with the SLA when there is one.

| Metric | Target |
|---|---|
| Response time | p95 < 500 ms, p99 < 1 s |
| Error rate | < 1% (`http_req_failed: rate<0.01`) |
| Throughput | from the SLA (e.g. 1000+ req/s) — read `http_reqs` rate |
| Concurrency | test at 2× the expected peak |

## Baselines

Save each run's summary so the next one has something to compare to:

```bash
k6 run --summary-export=perf/baseline-$(date +%y%m%d).json load-test.js
```

A p95 that moved 30% between two runs on the same hardware is a regression even
if both runs passed their thresholds.

## In CI

Run against a deployed staging environment, never production. Without a local
k6 install, the official image works anywhere Docker does:

```bash
docker run --rm -i -e BASE_URL="$STAGING_URL" grafana/k6 run - < load-test.js
```

Docs: https://grafana.com/docs/k6/latest/
