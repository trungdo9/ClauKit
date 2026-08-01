#!/bin/bash
# guard-destructive.sh — thin delegate to guard-destructive.cjs (single implementation).
exec node "$(dirname "$0")/guard-destructive.cjs"
