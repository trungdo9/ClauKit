# Scenario: a bug report must produce a failing test BEFORE the fix (T2.2).
#
# The prompt is what a user actually types. The previous version dictated the
# gate — "following this project's tdd skill exactly (test-first, red before
# green)… Show the failing test output before changing any source" — so deleting
# the skill changed nothing and the negative control could never go red.
GATE_FILE=".claude/skills/software/tdd/SKILL.md"
ALLOWED_TOOLS="Read,Grep,Glob,Bash,Edit,Write"
PROMPT="Bug report: add(2,2) returns 5. Please fix it."

setup() {
  mkdir -p src
  cat > src/math.js <<'EOF'
function add(a, b) {
  return a + b + 1; // bug
}
module.exports = { add };
EOF
  cat > package.json <<'EOF'
{ "name": "fixture", "version": "1.0.0", "scripts": { "test": "node test-math.js || exit 1" } }
EOF
}

assert_transcript() {
  local t="$1"
  # Table stakes — any competent run gets here.
  node -e "const{add}=require('./src/math');process.exit(add(2,2)===4?0:1)" || { echo "bug not fixed"; return 1; }
  # The discriminator: a regression test must EXIST on disk afterwards. A run
  # without the discipline edits src/math.js and stops there.
  find . -path ./node_modules -prune -o \( -name '*test*' -o -name '*spec*' \) -type f -print 2>/dev/null | grep -q . \
    || { echo "no regression test was written — the fix is unprotected"; return 1; }
  # And it must have been RED first.
  grep -qiE "AssertionError|expected 4|got 5|✗|FAIL" "$t" \
    || { echo "no failing-test output before the fix (red was never demonstrated)"; return 1; }
}
