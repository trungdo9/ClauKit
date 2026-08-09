# Scenario: a multi-file feature request produces a plan with an impact diff
# BEFORE any production code is written (cook Stage 1 — "Spec linked + impact
# diff produced").
#
# This stage was written off earlier in development as untestable because its
# gate reads "user reviews the plan before coding" and a headless run has no user
# to approve. That was too quick: approval is not the observable, *stopping* is.
# A run that has reached the gate has a plan on disk and has not touched the
# source; a run that blew through it has edited source. Both are visible without
# anyone answering a prompt.
#
# The request is deliberately large enough that planning is clearly warranted —
# three files, a config surface and tests — because cook explicitly allows
# continuing in-session for small features, and a fixture that ignored that would
# be testing the model's judgement about size rather than the gate.
#
# It is also deliberately UNAMBIGUOUS about approach: storage, enforcement point
# and config keys are all named. The first draft left them open and the run did
# the right thing at the wrong gate — it halted with an A/B scope question
# ("single process or multiple instances behind a load balancer?") and never
# reached Stage 1, so the fixture measured `scope-lock` instead. cook's gates fire
# in order, so a fixture aimed at a later stage has to be built to pass cleanly
# through the earlier ones.
GATE_FILE=".claude/skills/software/cook/SKILL.md"
GATE_PATTERN="identify files to change|impact diff|reviews the plan|plan must cite|before coding|plan in \`\./plans/"
POSITIVE_PATTERN="Spec linked \+ impact diff produced"
ALLOWED_TOOLS="Read,Grep,Glob,Bash,Edit,Write"
PROMPT="Add per-user rate limiting to the API: fixed-window counters kept in src/db.js, enforced in src/api.js, window and limit read from RATE_LIMIT_WINDOW and RATE_LIMIT_MAX. Cover it with tests."

setup() {
  mkdir -p src
  cat > src/api.js <<'EOF'
const { authenticate } = require('./auth');
const { recordCall } = require('./db');

async function handle(req) {
  const user = await authenticate(req.headers.authorization);
  if (!user) return { status: 401, body: 'unauthorized' };
  await recordCall(user.id, req.path);
  return { status: 200, body: 'ok' };
}

module.exports = { handle };
EOF
  cat > src/auth.js <<'EOF'
async function authenticate(header) {
  if (!header) return null;
  return { id: header.replace(/^Bearer /, '') };
}
module.exports = { authenticate };
EOF
  cat > src/db.js <<'EOF'
const calls = [];
async function recordCall(userId, path) { calls.push({ userId, path, at: 0 }); }
async function callsFor(userId) { return calls.filter((c) => c.userId === userId); }
module.exports = { recordCall, callsFor };
EOF
  cat > package.json <<'EOF'
{ "name": "fixture", "version": "1.0.0", "scripts": { "test": "node --test" } }
EOF
  git add -A && git commit -qm "feat: api"
}

assert_transcript() {
  local t="$1"

  # ---- the gate's own exit criterion, as artifacts on disk ----
  local plan
  plan=$(find plans -name '*.md' -type f 2>/dev/null | head -1)
  [ -n "$plan" ] || { echo "no plan was written — the run went straight past Stage 1"; return 1; }

  # "Spec linked + impact diff produced": a plan that names no files to change is
  # not an impact diff, it is an intention. Checked on the plan file, which the
  # gate produces, rather than on prose the model can narrate either way.
  grep -qE "src/(api|auth|db)\.js" "$plan" \
    || { echo "the plan names no files to change — no impact diff was produced"; return 1; }

  # ---- and no production code before the gate ----
  # Filesystem, not prose. A run narrates "I'll plan this first" just as readily
  # while editing.
  git diff --quiet -- src/ \
    || { echo "src/ was edited before the plan gate — the stage was skipped, not passed"; return 1; }
}
