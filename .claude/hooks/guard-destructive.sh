#!/bin/bash
# guard-destructive.sh — thin delegate to guard-destructive.js (single implementation).
exec node "$(dirname "$0")/guard-destructive.js"
