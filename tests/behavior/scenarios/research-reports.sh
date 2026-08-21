# Scenario: a feature that needs investigation dispatches research agents and
# files their reports where the rest of the pipeline reads them (cook Research).
#
# This stage was twice called "outside the instrument" during development, on the
# grounds that it consists solely of subagent dispatch and no scenario grants the
# tool that would dispatch one. The second half of that was a description of my
# own choices, not a limit: `ALLOWED_TOOLS` goes straight to `--allowedTools`, so
# a scenario can ask for `Task` whenever the stage under test needs it. Nothing
# structural was in the way.
#
# Research has no gate — cook.md flags it as "a command-level extension, not a
# numbered stage" — so what is checked is its *contract*: reports land in
# `plans/<plan>/reports/`, which is the path Plan, Implement and Review all read
# from. A stage that investigates and keeps the findings in its own head has done
# half the job; the next stage gets nothing.
# STATUS 2026-08-21: still OUT of ALL_SET, but for a NEW reason — the two the
# README recorded are now fixed and expired, and neither was ever the real one.
#   1. FIXED (instrument): the grant. See ALLOWED_TOOLS below.
#   2. FIXED (instrument): the prompt named no provider, so cook's Stage-0
#      Exact-Requirements Gate halted the run with a blocking question and the
#      stage under test was never entered. See PROMPT below.
#   3. OPEN, and it is not an instrument bug: with both fixed, the run reaches
#      Research and still dispatches NOTHING — 25 tool calls, 0 `Agent`, plan +
#      implement + test all inline, `reports/` created (step 12) and left empty.
#      The fixture is THREE FILES; the model read all of them in one `cat` and
#      correctly judged that delegating an investigation of 30 lines buys nothing.
#      cook.md itself calls Research "a command-level extension, not a numbered
#      stage", so declining it here is not a violation.
# So the assertion is sound and the fixture is too small to demand the behaviour.
# Making this scenario pass needs a codebase big enough that inline reading is
# impractical — NOT a sterner prompt, which is the mistake `fan-out-concurrency`
# already paid for twice. Do not restore to ALL_SET until such a fixture exists
# and a run confirms it; a scenario that cannot pass is noise in a sweep.
GATE_FILE=".claude/commands/ck/cook.md"
# The dispatch-tier table also names the stage and its two agents, so it has to
# go too — an ablation that leaves `| Research | `researcher` · `scout` |` standing
# tells the model exactly what the removed stage was.
GATE_PATTERN="researcher. agent|spawn .*researcher|reports → .plans|consolidate findings|scout. agent in parallel|^\\| Research \\|"
POSITIVE_PATTERN="reports → .plans/<plan>/reports/"
# The dispatch tool is granted here and nowhere else: it is the tool this stage IS.
# BOTH names, because the CLI renamed it — on 2.1.238 the tool is `Agent` and `Task`
# does not exist. Granting only `Task` is why the first confirming run dispatched
# nothing and researched inline: the assertion had been widened to `(Agent|Task)`
# without widening the grant, so the model was asked for a tool it was never given.
# Same defect class as `scope-lock`'s own note above — an ALLOWED_TOOLS omission
# makes the assertion unprovable rather than false.
ALLOWED_TOOLS="Read,Grep,Glob,Bash,Edit,Write,Agent,Task"
# The prompt INVOKES the command, which the other scenarios deliberately avoid.
# The harness rule is that a prompt may not dictate the gate's behaviour — the
# original sin was "following this project's tdd skill exactly (test-first, red
# before green)". Naming the command is a different act: it selects a pipeline
# and says nothing about how any stage behaves. Research is orchestration that
# only exists inside `/ck:cook`, not a safety rule that must fire everywhere, so
# a bare prompt is out of its scope by design — the first draft used one and the
# run never opened the command file at all.
#
# The provider is NAMED, and that is a fix rather than a hint. Unnamed, the run
# never reached Research at all: cook's Stage-0 Exact-Requirements Gate fired
# first and correctly halted on a blocking question ("which provider? the name is
# the filename, the registry key and the `via:` value"), so 13 tool calls went by
# and the stage under test was never entered. A scenario that trips a DIFFERENT
# gate measures that other gate. Naming the provider says nothing about how
# Research behaves — the pattern it has to find is still stated nowhere.
PROMPT="/ck:cook Add support for a PayPal payment provider alongside the existing one. Follow whatever pattern the codebase already uses."

setup() {
  mkdir -p src/providers src/core plans

  # The pattern is real but not stated anywhere: providers register themselves
  # through a registry the core reads at boot. Finding that is the research.
  cat > src/core/registry.js <<'EOF'
const providers = new Map();
function register(name, impl) { providers.set(name, impl); }
function get(name) { return providers.get(name); }
module.exports = { register, get };
EOF
  cat > src/providers/stripe.js <<'EOF'
const { register } = require('../core/registry');

async function charge(amountCents, token) {
  if (!token) throw new Error('missing token');
  return { ok: true, cents: amountCents, via: 'stripe' };
}

register('stripe', { charge });
module.exports = { charge };
EOF
  cat > src/core/boot.js <<'EOF'
require('../providers/stripe');
const { get } = require('./registry');
module.exports = { providerFor: (name) => get(name) };
EOF
  cat > package.json <<'EOF'
{ "name": "fixture", "version": "1.0.0", "scripts": { "test": "node --test" } }
EOF
  git add -A && git commit -qm "feat: payments"
}

assert_transcript() {
  local t="$1"

  # ---- the stage's own contract: findings leave the session ----
  local report
  report=$(find plans -path '*/reports/*' -name '*.md' -type f 2>/dev/null | head -1)
  [ -n "$report" ] || {
    echo "no report under plans/<plan>/reports/ — findings never left the session"; return 1; }

  # A report that names nothing the investigation could only have learned by
  # looking is a summary of the prompt, not research. The registry indirection is
  # stated in no comment and no doc; it is only visible by reading the code.
  grep -qiE "registry|register\(" "$report" \
    || { echo "the report does not mention the registry pattern — nothing was actually found"; return 1; }

  # ---- and it was delegated, which is what the stage says to do ----
  # Read off the tool sequence: a session that investigated inline and then wrote
  # a report produces the same file, and the point of the stage is that the main
  # context stays clean.
  node "$HARNESS_DIR/tool-sequence.cjs" "$EVENTS" \
    | grep -qE "^[0-9]+\t(Agent|Task)\t" \
    || { echo "no agent was dispatched — the stage was inlined, not run"; return 1; }
}
