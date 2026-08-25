/**
 * CLI argument parsing for ck.js.
 *
 * Supported flags:
 *   --force                  Overwrite existing files
 *   --kit <name|list|file>   Install a specific kit
 */

const COMMANDS = {
  init: "Initialize Claude configuration in current project",
  update: "Check for the latest version on GitHub",
  help: "Show help information"
};

/**
 * Parse argv into { options, commandArgs }.
 * options: { force, path, kit }
 * commandArgs: positional args (the command + extras)
 */
function parseArgs(args) {
  const options = { force: false, kit: null };
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
  init    ${COMMANDS.init}
  update  ${COMMANDS.update}
  help    Show this help

Options for 'init':
  --kit <name>    Install a specific kit (engineer|marketing|both|<custom.json>)
  --kit list      List available kits
  --force         Overwrite existing files

Examples:
  ck init                              # Default: engineer kit
  ck init --kit list                   # List all kits
  ck init --kit marketing              # Marketing + automation
  ck init --kit both                   # Engineer + marketing
  ck init --kit /path/to/custom.json   # Custom manifest
  ck init --force                      # Overwrite existing
  ck update                            # Check for updates
  npx @trungdo9/ClauKit init --kit marketing
`);
}

module.exports = { COMMANDS, parseArgs, showHelp };
