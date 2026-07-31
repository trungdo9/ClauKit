#!/bin/bash
# scout-block.sh — thin delegate to scout-block.js (the single implementation).
# Kept so shell-wired setups keep working; logic lives in ONE place to
# prevent the substring-matching drift that caused false positives (G6).
exec node "$(dirname "$0")/scout-block.js"
