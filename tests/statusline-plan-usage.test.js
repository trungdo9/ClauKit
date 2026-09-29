'use strict';
// statusline-context-meter — planUsage(): the % of the subscription rate-limit windows that replaces
// the raw token count. `rate_limits` is absent for API-key users and before the first response, and
// each window can be absent on its own, so "no data" must render nothing rather than "0 %".

const { test } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { spawnSync } = require('child_process');

const METER = path.resolve(__dirname, '..', '.claude/scripts/ck/statusline-context-meter.cjs');
const { planUsage, WARN_PLAN_PCT, ALERT_PLAN_PCT } = require(METER);

const limits = (five, seven) => ({
  rate_limits: {
    ...(five === undefined ? {} : { five_hour: { used_percentage: five, resets_at: 1738425600 } }),
    ...(seven === undefined ? {} : { seven_day: { used_percentage: seven, resets_at: 1738857600 } }),
  },
});

test('no rate_limits → null, never 0 %', () => {
  assert.strictEqual(planUsage({}), null);
  assert.strictEqual(planUsage(undefined), null);
  assert.strictEqual(planUsage({ rate_limits: {} }), null);
  assert.strictEqual(planUsage(limits(null, '41')), null);
});

test('both windows render rounded, 5h first', () => {
  assert.deepStrictEqual(planUsage(limits(23.5, 41.2)), { text: '5h 24% · 7d 41%', level: 'ok' });
});

test('a single window renders alone', () => {
  assert.deepStrictEqual(planUsage(limits(undefined, 12)), { text: '7d 12%', level: 'ok' });
  assert.deepStrictEqual(planUsage(limits(0, undefined)), { text: '5h 0%', level: 'ok' });
});

test('level follows the worse window at the documented thresholds', () => {
  assert.strictEqual(planUsage(limits(WARN_PLAN_PCT - 0.1, 10)).level, 'ok');
  assert.strictEqual(planUsage(limits(10, WARN_PLAN_PCT)).level, 'warn');
  assert.strictEqual(planUsage(limits(ALERT_PLAN_PCT, 10)).level, 'alert');
  assert.strictEqual(planUsage(limits(10, 100)).level, 'alert');
});

test('standalone statusline prints the plan usage, and nothing on empty input', () => {
  const run = (input) => spawnSync(process.execPath, [METER], { input, encoding: 'utf8' });
  const withPlan = run(JSON.stringify({ ...limits(23.5, 91.2), transcript_path: '/nonexistent' }));
  assert.strictEqual(withPlan.status, 0);
  assert.match(withPlan.stdout, /📊 5h 24% · 7d 91%/);
  assert.match(withPlan.stdout, /\x1b\[31m📊/, 'worst window at 91 % colours the segment red');
  const empty = run('');
  assert.strictEqual(empty.status, 0);
  assert.strictEqual(empty.stdout, '');
});
