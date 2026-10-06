# Forecasting Outcomes · Predictive Planning

Quantify uncertainty in plan timelines, complexity, and risk using metrics and historical data instead of intuition. Pair with the rest of the planning workflow — design *then* forecast.

## When to forecast

- Estimating ETA for a feature given team velocity
- Risk-scoring an architectural decision before committing
- Identifying likely bottlenecks from a dependency graph
- Forecasting test-coverage impact of a refactor

**Skip forecasting when**: the project is novel, data is thin, or the prediction would mislead more than guide.

## Models worth knowing

### 1. Velocity extrapolation

Compute story-points-per-sprint over the last N sprints. Project forward. Confidence interval from the standard deviation.

```
Velocity (mean ± stdev) over last 6 sprints: 32 ± 7 pts
Backlog: 120 pts
ETA: 120 / 32 = 3.75 sprints
Bounds: 120 / (32+7) ≈ 3.1, 120 / (32-7) ≈ 4.8
```

Communicate the **range**, never the point estimate.

### 2. Monte Carlo simulation

For multi-step plans where each step has a probabilistic duration:

1. Each step: distribution of past durations (or expert P10/P50/P90).
2. Simulate the plan 10,000 times, summing step durations.
3. Report the P50 and P90 of total duration.

Free spreadsheet implementations exist; libraries like `numpy.random` make it 20 lines of Python.

### 3. Risk scoring

For each plan item, score:

- **Impact** (1–5): blast radius if it fails.
- **Likelihood** (1–5): chance it fails based on similarity to past failures.

Risk = Impact × Likelihood. Sort plans by risk; mitigate the top 20%.

### 4. Bottleneck prediction from dependency graph

Build the dependency graph — across plans from what each plan says it waits on, inside one plan from `[[to-tickets]]`' blocking edges. Nodes with highest in-degree are bottlenecks: many plans wait on them. Prioritize their delivery to unlock flow.

## Data inputs (DORA + agile metrics)

- **Lead time** — idea to production. The headline flow metric.
- **Cycle time** — start to done. Shorter is better; bounded by WIP.
- **Deploy frequency** — proxy for batch size. High frequency = small batches = better forecastability.
- **Change failure rate** — % of deploys that cause incidents. Inflates time estimates if ignored.
- **Defect rate by component** — predicts which areas of the codebase eat time.

## Pitfalls

- **Garbage in, garbage out**: forecasts built on noisy velocity data mislead. Throw out outlier sprints (vacation, incidents).
- **Single-point estimates**: "this will take 3 weeks" is wrong by construction. Use ranges.
- **Black swans**: most useful for routine work; useless for novel work. Don't pretend it's the latter.
- **Forecast theater**: producing pretty charts no one acts on. The output should change a decision; if it doesn't, skip the forecast.

## References

- Flow Metrics: Lead Time & Cycle Time — DigitalOcean blog on DORA research.
- Atlassian Insights: Forecasting Sprint Completion — burndown extrapolation patterns.
- Johari Window for risk classification — known/unknown matrix.
