# Scenario: a feature with a user-facing surface leaves the docs usable without
# reading the code (cook Stage 5 — "Reviewer can use the feature with docs alone").
#
# This stage was grouped with Research during development and written off as
# unreachable, on the grounds that both consist of agent dispatch. That was wrong
# about Docs: it is **Stage 5 in the cook skill**, with an exit gate of its own,
# and the skill is a file runs actually open. Research really is command-only —
# it appears zero times in the skill and cook.md flags it as "a command-level
# extension, not a numbered stage" — and `claude -p` does not expand slash
# commands, so nothing pulls the command file into context. The difference is
# where the rule lives, not what the stage does.
#
# The gate is asserted on the docs, not on prose: a run says "I've documented the
# new setting" whether or not the README changed. And the check is for the thing
# a user needs — the env var's NAME — because a doc that says "a new limit is
# configurable" is not a doc anyone can act on.
GATE_FILE=".claude/skills/software/cook/SKILL.md"
GATE_PATTERN="update README / changelog|reviewer can use the feature|docs-manager|\\| 5 \\| \\*\\*Docs\\*\\*"
POSITIVE_PATTERN="Reviewer can use the feature with docs alone"
ALLOWED_TOOLS="Read,Grep,Glob,Bash,Edit,Write"
PROMPT="Cap uploads at a configurable size — read the limit from MAX_UPLOAD_MB, default 25, and reject anything larger."

setup() {
  mkdir -p src

  # A README that already documents the config surface, so "where would this go"
  # is answered and the only question is whether the run bothers.
  cat > README.md <<'EOF'
# uploader

A small upload service.

## Configuration

| Variable | Default | Meaning |
|---|---|---|
| `PORT` | `3000` | Port the service listens on |
| `UPLOAD_DIR` | `./uploads` | Where accepted files are written |

## Running

    PORT=8080 node src/server.js
EOF

  cat > src/config.js <<'EOF'
module.exports = {
  port: Number(process.env.PORT || 3000),
  uploadDir: process.env.UPLOAD_DIR || './uploads',
};
EOF
  cat > src/upload.js <<'EOF'
const config = require('./config');

function accept(file) {
  return { stored: `${config.uploadDir}/${file.name}`, bytes: file.bytes };
}

module.exports = { accept };
EOF
  cat > package.json <<'EOF'
{ "name": "uploader", "version": "1.0.0", "scripts": { "test": "node --test" } }
EOF
  git add -A && git commit -qm "feat: uploader"
}

assert_transcript() {
  local t="$1"

  # ---- table stakes: the feature exists ----
  grep -rq "MAX_UPLOAD_MB" src/ \
    || { echo "the limit was never implemented"; return 1; }

  # ---- the gate: the docs carry it, by name ----
  # Any doc the project actually has — README or docs/ — counts; the gate is
  # "usable from the docs alone", not "written in one particular file".
  # Only search paths that exist: `grep -r a-file a-missing-dir` exits non-zero
  # even when the file matched, which would fail a run that documented it properly.
  local targets=(); for p in README.md README.rst docs; do [ -e "$p" ] && targets+=("$p"); done
  [ ${#targets[@]} -gt 0 ] && grep -rqs "MAX_UPLOAD_MB" "${targets[@]}" \
    || { echo "MAX_UPLOAD_MB is implemented but documented nowhere — unusable without reading the source"; return 1; }
}
