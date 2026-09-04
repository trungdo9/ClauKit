#!/usr/bin/env bash
# backup-workspace-config.sh — snapshot the UNTRACKED workspace-root configuration.
#
# WHY. A workspace root that is a plain folder (not a git repo) has no history and no
# remote for its own `.claude/`, `docs/` and instruction files: one `rm -rf`, one forced
# kit reinstall, one bad scripted edit and they are gone. When keeping that tree local is
# a deliberate choice, a dated snapshot outside the workspace is the mitigation that
# remains.
#
# WHAT IT DOES NOT COVER. `plans/` (run scratch, deliberately excluded — it is usually the
# largest thing here by far) and the repo checkouts themselves, which are git-backed with
# remotes. Restoring a repo is `git clone`; restoring this tree is only ever this archive.
#
# The archive contains live credentials (`.claude/.env`, `wiki/devops/`), so it is written
# 0600 into the user's home and must never be copied into a git-tracked folder or shared.
#
# WHERE TO WIRE IT. A SessionStart hook at a workspace root, with `--if-stale 7`: the
# no-op path is a single `find` (~6 ms) and a real snapshot takes well under a second.
# It exits immediately when the root is a git repo, so it is safe anywhere.
#
# Usage:
#   backup-workspace-config.sh                # always snapshot
#   backup-workspace-config.sh --if-stale 7   # snapshot only if the newest is >7 days old
#   BACKUP_DIR=/elsewhere backup-workspace-config.sh   # override the destination
set -uo pipefail

WORKSPACE="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
NAME="$(basename "$WORKSPACE")"
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/$NAME-workspace-config}"
KEEP="${KEEP:-10}"

stale_days=""
if [ "${1:-}" = "--if-stale" ]; then stale_days="${2:-7}"; fi

# A repo checkout is git-backed; this script is for the root only.
if [ -e "$WORKSPACE/.git" ]; then
  echo "backup-workspace-config: $WORKSPACE is a git repo — nothing to do." >&2
  exit 0
fi

mkdir -p "$BACKUP_DIR" || exit 0
chmod 700 "$BACKUP_DIR" 2>/dev/null

if [ -n "$stale_days" ]; then
  newest=$(find "$BACKUP_DIR" -maxdepth 1 -name "$NAME-config-*.tar.gz" -mtime "-$stale_days" -print -quit 2>/dev/null)
  if [ -n "$newest" ]; then exit 0; fi   # a recent snapshot exists: silent no-op
fi

stamp=$(date +%Y%m%d-%H%M)
out="$BACKUP_DIR/$NAME-config-$stamp.tar.gz"

# Paths worth their weight: every one of them is unrecoverable if lost.
targets=()
for p in .claude docs wiki CLAUDE.md AGENTS.md README.md; do
  [ -e "$WORKSPACE/$p" ] && targets+=("$p")
done
[ ${#targets[@]} -eq 0 ] && exit 0

if ! tar -czf "$out.part" -C "$WORKSPACE" "${targets[@]}" 2>/dev/null; then
  rm -f "$out.part"
  echo "backup-workspace-config: FAILED to write $out" >&2
  exit 1
fi
mv "$out.part" "$out"
chmod 600 "$out"

# Keep the newest $KEEP, drop the rest.
ls -1t "$BACKUP_DIR"/"$NAME"-config-*.tar.gz 2>/dev/null | tail -n +$((KEEP + 1)) | while read -r old; do rm -f "$old"; done

size=$(du -h "$out" | cut -f1)
count=$(ls -1 "$BACKUP_DIR"/"$NAME"-config-*.tar.gz 2>/dev/null | wc -l)
echo "backup-workspace-config: $out ($size) — $count snapshot(s) kept, covering: ${targets[*]}"
