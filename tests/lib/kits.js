/**
 * The kit list, derived rather than declared.
 *
 * Four loops carried the literal three-name kit list — packaging:165,
 * :275, :341 and claude-md:179 — so a fourth in-package kit would have been
 * invisible to every guard that exists to catch exactly its class of defect.
 * Deriving from `.claude/kits/*.json` closes that permanently: a new manifest
 * enters all four loops by existing. Out-of-tree kits are covered by
 * external-kit.test.js instead, because by construction they are not here.
 */

const { listKits, getKitPaths } = require('../../bin/lib/kit-resolver.js');

function packagedKits() {
  return listKits().map(k => k.manifest.name).sort();
}

function shipsCkScripts(manifest) {
  return getKitPaths(manifest).some(p => p.startsWith('.claude/scripts/ck/'));
}

module.exports = {
  packagedKits,
  shipsCkScripts,
};
