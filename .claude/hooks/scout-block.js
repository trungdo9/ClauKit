#!/usr/bin/env node

/**
 * scout-block.js - PreToolUse guard for heavy-directory traversal
 *
 * Blocks commands that ACCESS/TRAVERSE heavy directories:
 *   node_modules, __pycache__, .git/, dist/, build/
 *
 * Precision rules (fixes the substring false-positive bug — G6):
 * - Blocked dirs match only as path segments of a command argument,
 *   never as substrings of the whole command line.
 * - Exclusion contexts are whitelisted: `grep -v node_modules`,
 *   `--exclude`/`--exclude-dir`/`--ignore`, `!pattern` globs,
 *   `find -path ... -prune`, `-not -path`.
 * - `dist`/`build`/`.git` require a slash (`dist/…`) — `npm run build` passes.
 *
 * This file holds the ONE implementation. scout-block.sh / scout-block.ps1
 * delegate here so the three entry points cannot drift apart again.
 *
 * Exit codes: 0 = allowed · 2 = blocked or error
 */

const fs = require('fs');

// Segment-matched dirs: a bare mention as an argument is already traversal.
const HEAVY_DIRS = /(^|\/)(node_modules|__pycache__)(\/|$)/;
// Slash-required dirs: common English words / legit non-path uses exist.
const SLASH_DIRS = /(^|\/)(\.git|dist|build)\//;

// Flags whose FOLLOWING token is an exclusion pattern, per command family.
const GREP_FAMILY = new Set(['grep', 'egrep', 'fgrep', 'rg', 'ag', 'ack']);
const GREP_EXCLUDE_FLAGS = new Set(['-v', '--invert-match', '--exclude', '--exclude-dir', '--ignore', '--ignore-dir', '-g', '--glob', '--iglob']);
const FIND_EXCLUDE_FLAGS = new Set(['-path', '-ipath', '-name', '-iname', '-not']);
// Inline `--flag=value` prefixes that mark the value as an exclusion (any command).
const INLINE_EXCLUDE_PREFIX = /^(--exclude(-dir|-from)?|--ignore(-dir|-pattern)?|--glob|--iglob|-g)=/;

function stripQuotes(tok) {
  return tok.replace(/^['"]+|['"]+$/g, '');
}

function isBlockedPath(tok) {
  return HEAVY_DIRS.test(tok) || SLASH_DIRS.test(tok);
}

/** Returns a blocked path token, or null if the command is clean. */
function findViolation(command) {
  // Evaluate each pipeline/compound segment with its own command word.
  const segments = command.split(/\||&&|;/);
  for (const segment of segments) {
    const rawToks = segment.trim().split(/\s+/).filter(Boolean);
    if (rawToks.length === 0) continue;
    const bin = stripQuotes(rawToks[0]).split('/').pop();
    const isGrep = GREP_FAMILY.has(bin);
    const isFind = bin === 'find' || bin === 'fd';
    const hasPrune = rawToks.includes('-prune');

    for (let i = 0; i < rawToks.length; i++) {
      const tok = stripQuotes(rawToks[i]);
      if (!isBlockedPath(tok)) continue;

      // Exclusion contexts — the blocked name is being EXCLUDED, not traversed.
      if (tok.startsWith('!')) continue;                       // negated glob
      if (INLINE_EXCLUDE_PREFIX.test(rawToks[i])) continue;    // --exclude-dir=node_modules
      const prev = i > 0 ? stripQuotes(rawToks[i - 1]) : '';
      if (isGrep && GREP_EXCLUDE_FLAGS.has(prev)) continue;    // grep -v node_modules
      if (!isGrep && !isFind && (prev === '--exclude' || prev === '--ignore')) continue; // tar --exclude node_modules
      if (isFind && FIND_EXCLUDE_FLAGS.has(prev) && (hasPrune || segment.includes('-not'))) continue; // find -path … -prune

      return tok;
    }
  }
  return null;
}

// ---- entry point (skipped when required as a module, e.g. from tests) ----
if (require.main === module) {
  try {
    const hookInput = fs.readFileSync(0, 'utf-8');

    if (!hookInput || hookInput.trim().length === 0) {
      console.error('ERROR: Empty input');
      process.exit(2);
    }

    let data;
    try {
      data = JSON.parse(hookInput);
    } catch (parseError) {
      console.error('ERROR: JSON parse failed:', parseError.message);
      process.exit(2);
    }
    if (!data.tool_input || typeof data.tool_input.command !== 'string') {
      console.error('ERROR: Invalid JSON structure');
      process.exit(2);
    }
    const command = data.tool_input.command;
    if (command.trim().length === 0) {
      console.error('ERROR: Empty command');
      process.exit(2);
    }

    const violation = findViolation(command);
    if (violation) {
      console.error(`ERROR: Blocked directory pattern — '${violation}' traverses a heavy directory (node_modules/__pycache__/.git/dist/build). Excluding it (--exclude-dir, grep -v, -prune) is allowed; reading inside it is not.`);
      process.exit(2);
    }
    process.exit(0);
  } catch (error) {
    if (error.message) console.error('ERROR:', error.message);
    process.exit(error.status || 2);
  }
}

module.exports = { findViolation };
