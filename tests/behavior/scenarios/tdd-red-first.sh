# Scenario: tdd produces a red test with pasted failure output before touching source (T2.2).
GATE_FILE=".claude/skills/software/tdd/SKILL.md"
ALLOWED_TOOLS="Read,Grep,Glob,Bash,Edit,Write"
PROMPT="Bug report: add(2,2) returns 5 in src/math.js. Fix it following this project's tdd skill exactly (test-first, red before green; use plain node for the test, no frameworks). Show the failing test output before changing any source."

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
  # a test file must now exist and the bug must be fixed
  node -e "const{add}=require('./src/math');process.exit(add(2,2)===4?0:1)" || { echo "bug not fixed"; return 1; }
  ls ./*test* >/dev/null 2>&1 || ls test/ >/dev/null 2>&1 || { echo "no test artifact created"; return 1; }
  # transcript must show a FAILURE before the fix (red first) — look for a failure marker
  grep -qiE "fail|AssertionError|expected.*4" "$t" || { echo "no red-test failure output in transcript"; return 1; }
}
