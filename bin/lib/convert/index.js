/**
 * `ck convert <target>` entry point — dispatches to the target's generator.
 * See to-codex.js / to-antigravity.js for what each target actually maps.
 */

const path = require("path");
const { scanClaudeProject } = require("./scan");
const toCodex = require("./to-codex");
const toAntigravity = require("./to-antigravity");

const TARGETS = { codex: toCodex, antigravity: toAntigravity };

function runConvert(target, projectRoot, options = {}) {
  const generator = TARGETS[target];
  if (!generator) {
    throw new Error(`Unknown convert target '${target}'. Supported: ${Object.keys(TARGETS).join(", ")}`);
  }

  const scanned = scanClaudeProject(projectRoot);
  if (!scanned.claudeMd && !scanned.agents.length && !scanned.commands.length && !scanned.skillsSrc) {
    throw new Error("No .claude/ configuration found in this project. Run `ck init` first.");
  }

  const outRoot = options.out ? path.resolve(options.out) : projectRoot;
  return generator.generate(projectRoot, outRoot, scanned, options);
}

module.exports = { runConvert, TARGETS };
