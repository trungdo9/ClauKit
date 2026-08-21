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
GATE_FILE=".claude/commands/ck/cook.md"
# The dispatch-tier table also names the stage and its two agents, so it has to
# go too — an ablation that leaves `| Research | `researcher` · `scout` |` standing
# tells the model exactly what the removed stage was.
GATE_PATTERN="researcher. agent|spawn .*researcher|reports → .plans|consolidate findings|scout. agent in parallel|^\\| Research \\|"
POSITIVE_PATTERN="reports → .plans/<plan>/reports/"
# `Task` is granted here and nowhere else: it is the tool this stage IS.
ALLOWED_TOOLS="Read,Grep,Glob,Bash,Edit,Write,Task"
# The prompt INVOKES the command, which the other scenarios deliberately avoid.
# The harness rule is that a prompt may not dictate the gate's behaviour — the
# original sin was "following this project's tdd skill exactly (test-first, red
# before green)". Naming the command is a different act: it selects a pipeline
# and says nothing about how any stage behaves. Research is orchestration that
# only exists inside `/ck:cook`, not a safety rule that must fire everywhere, so
# a bare prompt is out of its scope by design — the first draft used one and the
# run never opened the command file at all.
PROMPT="/ck:cook Add support for a second payment provider alongside the existing one. Follow whatever pattern the codebase already uses."

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
