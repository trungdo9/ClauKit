/**
 * CLI argument parsing for ck.js.
 *
 * Supported flags:
 *   --force                  Overwrite existing files
 *   --kit <name|list|file>   Install a specific kit
 *   --out <dir>              (convert) write output elsewhere instead of the project root
 */

const COMMANDS = {
  init: "Initialize Claude configuration in current project",
  update: "Check for the latest version on GitHub",
  convert: "Convert .claude/ config for another agent tool (antigravity | codex)",
  help: "Show help information"
};

/**
 * Parse argv into { options, commandArgs }.
 * options: { force, path, kit, out }
 * commandArgs: positional args (the command + extras)
 */
function parseArgs(args) {
  const options = { force: false, kit: null, out: null };
  const commandArgs = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--force") {
      options.force = true;
    } else if (arg === "--kit") {
      const next = args[i + 1];
      if (!next || next.startsWith("-")) {
        options.kit = "engineer"; // --kit with no value → default
      } else {
        options.kit = next;
        i++;
      }
    } else if (arg === "--out") {
      const next = args[i + 1];
      if (next && !next.startsWith("-")) {
        options.out = next;
        i++;
      }
    } else if (arg.startsWith("-")) {
      console.warn(`⚠️  Unknown option: ${arg}`);
    } else {
      commandArgs.push(arg);
    }
  }

  return { options, commandArgs };
}

/**
 * Print help text.
 */
function showHelp(packageJson) {
  console.log(`
KitForge v${packageJson.version}   ·   package @trungdo9/ClauKit   ·   cli: ck | claukit
${packageJson.description}

Usage:
  npx @trungdo9/ClauKit <command>
  ck <command>
  claukit <command>

Commands:
  init      ${COMMANDS.init}
  update    ${COMMANDS.update}
  convert   ${COMMANDS.convert}
  help      Show this help

Options for 'init':
  --kit <name>    Install a specific kit (engineer|marketing|both|<custom.json>)
  --kit list      List available kits
  --force         Overwrite existing files

Options for 'convert':
  --out <dir>     Write output under <dir> instead of the project root
  --force         Overwrite previously converted files

Examples:
  ck init                              # Default: engineer kit
  ck init --kit list                   # List all kits
  ck init --kit marketing              # Marketing + automation
  ck init --kit both                   # Engineer + marketing
  ck init --kit /path/to/custom.json   # Custom manifest
  ck init --force                      # Overwrite existing
  ck update                            # Check for updates
  ck convert antigravity               # Generate .agents/ (Google Antigravity)
  ck convert codex                     # Generate .codex/ + AGENTS.md (OpenAI Codex CLI)
  ck convert codex --out /tmp/preview  # Preview the conversion elsewhere first
  npx @trungdo9/ClauKit init --kit marketing
`);
}

module.exports = { COMMANDS, parseArgs, showHelp };
