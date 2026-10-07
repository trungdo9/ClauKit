# HR KPI Catalogue — formulas and definitions

Formulas only. **No target values or benchmarks** — targets come from the organisation's plan; an
external benchmark ships only with source, date, industry and size band, else `[NEEDS DATA]`
(hr-rules § 4). Write the inclusion rules (employees? contractors? interns? leave of absence?) next
to every KPI and keep them identical across reports. Aggregate outputs respect the minimum group size
in `plans/hr-context.md` (hr-rules § 3).

Conventions: `avg HC` = (opening headcount + closing headcount) ÷ 2, or the mean of month-end counts
(state which). Rates ×100 for %. Report medians alongside means for durations.

## Workforce size and structure

| KPI | Formula | Notes |
|---|---|---|
| Headcount | Count of active workers on a date | Point-in-time; state worker types included |
| FTE | Σ contracted hours ÷ standard full-time hours | Use for cost and capacity, headcount for people |
| Net headcount change | Hires − exits ± transfers in/out of scope | Reconcile with opening/closing counts |
| Contingent share | Contingent workers ÷ (employees + contingent) | Define contingent (agency, freelance, outsourced) |
| Span of control | Direct reports per people manager | Report median and distribution, not only mean; flag outliers both ends |
| Management layers | Levels from top role to front line | Per function |
| Manager ratio | Non-manager headcount ÷ manager headcount | |
| Vacancy rate | Open approved positions ÷ (filled + open approved positions) | Position-based HRIS only |
| HR ratio | Employee FTE ÷ HR FTE (or HR FTE per 100 employees) | Define who counts as HR (shared services? payroll?) |

## Turnover and retention

| KPI | Formula | Notes |
|---|---|---|
| Turnover rate | Exits in period ÷ avg HC | Always split the components below |
| Voluntary turnover | Employee-initiated exits ÷ avg HC | Exclude retirements or report separately — state which |
| Involuntary turnover | Employer-initiated exits ÷ avg HC | |
| Regretted turnover | Regretted voluntary exits ÷ avg HC | Define "regretted" (critical role, performance, flight-risk talent) **before** the period |
| First-year turnover (cohort) | Hires in cohort who exit within 12 months ÷ hires in cohort | Cohort method; say if using period method instead |
| Retention rate | Employees at period start still employed at period end ÷ headcount at start | Not the same as 1 − turnover (hires excluded) |
| Annualised rate | Period rate × (12 ÷ months in period) | Approximation; volatile for single months |
| Average tenure | Σ tenure of active workers ÷ headcount | Tenure distribution beats the average |
| Exit by reason | Exits in reason code ÷ total exits | Needs standard reason codes |

## Mobility and progression

| KPI | Formula | Notes |
|---|---|---|
| Internal mobility rate | Internal moves (lateral + promotion) ÷ avg HC | Define what counts as a move |
| Promotion rate | Promotions ÷ avg HC | Slice by group only above minimum group size |
| Internal fill rate | Roles filled by internal candidates ÷ total roles filled | |
| Critical-role coverage | Critical roles with ≥1 ready successor ÷ critical roles | Succession data from [[hr-performance]] |

## Hiring

| KPI | Formula | Notes |
|---|---|---|
| Time to fill | Days from requisition approval to offer accepted | Fix start/stop events; median per role family |
| Time to hire | Days from candidate application to offer accepted | Candidate-side speed |
| Time to start | Days from requisition approval to first day | Drives budget phasing |
| Offer acceptance rate | Offers accepted ÷ offers extended | |
| Funnel conversion | Candidates entering stage n+1 ÷ candidates entering stage n | Per stage and source |
| Adverse-impact ratio | Selection rate of a group ÷ selection rate of highest-rate group | Screening check; threshold per jurisdiction `[VERIFY]` — hr-rules § 5 |
| Cost per hire | (External recruiting costs + internal recruiting costs) ÷ hires | Internal = recruiter/interviewer time at fully loaded rate; state what is in each bucket |
| Quality of hire | Composite fixed in advance (e.g. ramp-goal attainment, first-year retention, manager rating) | Weights written down before measuring |
| Requisition days on hold | Σ days requisitions paused ÷ requisitions | Stall signal |

## Cost and productivity

| KPI | Formula | Notes |
|---|---|---|
| Workforce cost | Σ fully loaded cost (pay, variable, employer contributions, benefits, contingent) | Same components every period |
| Labour cost ratio | Workforce cost ÷ revenue (or ÷ operating expense) | State denominator |
| Revenue per FTE | Revenue ÷ avg FTE | Use FTE, not headcount |
| Workforce cost per FTE | Workforce cost ÷ avg FTE | |
| Human capital return | (Revenue − (operating expense − workforce cost)) ÷ workforce cost | Directional only; sensitive to accounting choices |
| HR cost per employee | HR function cost ÷ avg HC | |
| Overtime ratio | Overtime hours ÷ total hours worked | Per team; a capacity signal |
| Vacancy cost | Daily fully loaded cost of role × days vacant (+ cover premium) | Feeds business cases |
| Attrition cost per exit | Separation + vacancy + recruiting + onboarding/ramp shortfall + training | Build from own data; never a % of salary rule of thumb |
| Budget variance | (Actual − budget) ÷ budget, split by driver | Hiring pace · rate · attrition · mix |

## Learning and capability

| KPI | Formula | Notes |
|---|---|---|
| Training spend per FTE | L&D spend ÷ avg FTE | |
| Learning hours per FTE | Σ learning hours ÷ avg FTE | Activity, not outcome |
| Completion rate | Completions ÷ enrolments | Mandatory vs optional separately |
| Skills coverage | Required skill slots filled at target proficiency ÷ required slots | Needs a validated inventory |

## Attendance and time

| KPI | Formula | Notes |
|---|---|---|
| Absence rate | Unplanned absence days (or hours) ÷ scheduled work days (or hours) | Planned leave excluded; never per-person in shared reports |
| Absence frequency | Absence spells ÷ avg HC | Distinguishes many short vs few long absences |
| Schedule adherence | Time worked as scheduled ÷ scheduled time | Contact-centre style operations |
| Coverage gap | Required staffed hours − staffed hours, per block | From the roster model |
| Shrinkage | (Paid hours − hours available for work) ÷ paid hours | Feeds FTE calc |
| Manual timesheet edits | Manual edits ÷ timesheets | Control signal; audit trail required |

## Engagement, health, compliance (owned elsewhere, often reported here)

| KPI | Formula | Owner |
|---|---|---|
| eNPS | % promoters − % detractors | [[hr-culture]] — survey design and thresholds |
| Survey participation | Respondents ÷ invited | [[hr-culture]] |
| Representation by level | Group headcount at level ÷ total headcount at level | Only where lawful to collect; minimum group size |
| Recordable incident rate | Incidents × normalising hours ÷ hours worked | Normalising constant per local standard `[VERIFY]` |
| ER case cycle time | Days from case open to close | [[hr-employee-relations]] |

## Forecast quality

| KPI | Formula | Notes |
|---|---|---|
| Forecast error | (Forecast − actual) ÷ actual, per function per period | Sign shows bias direction |
| Absolute % error | abs(Forecast − actual) ÷ actual | Average across periods for accuracy |
| Timing error | Hires landed in planned quarter ÷ hires planned for that quarter | Separate from volume error |

## Leading vs lagging — pick both

- **Leading:** manager-change frequency, internal mobility rate, pulse trend, absence frequency, overtime ratio, requisition days on hold, offer acceptance rate.
- **Lagging:** turnover, cost per hire, time to fill, first-year turnover, labour cost ratio.

## KPI definition card (one per KPI in `kpi-set.md`)

```markdown
### <KPI name>
- Formula: <exact formula>
- Includes / excludes: <worker types, events, period>
- Source system(s): <HRIS / payroll / ATS / time>  ·  Refresh: <cadence>
- Owner (role): <role>  ·  Audience: <exec / HRBP / manager>
- Target / threshold: <from plan, or cited benchmark with source+date, or [NEEDS DATA]>
- Action when triggered: <who does what by when>
- Leading or lagging: <…>  ·  Minimum group size applies: <yes/no>
```

Reference definition sets exist (e.g. ISO 30414 human-capital reporting) — adopt one where external
comparability matters `[VERIFY: current edition]`.
