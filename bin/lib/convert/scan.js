/**
 * Reads a project's installed `.claude/` tree into a plain data shape that
 * every `to-*.js` target generator consumes. Scans the CURRENT install
 * (whatever `ck init` actually put on disk / the user edited since), not a
 * kit manifest — "convert what's here", per the feature request.
 */

const fs = require("fs");
const path = require("path");
const { parseFrontmatter } = require("./frontmatter");

function walkMd(dir) {
  let out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walkMd(full));
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

function scanClaudeProject(projectRoot) {
  const claudeDir = path.join(projectRoot, ".claude");

  const claudeMdPath = path.join(projectRoot, "CLAUDE.md");
  const claudeMd = fs.existsSync(claudeMdPath) ? fs.readFileSync(claudeMdPath, "utf-8") : null;

  const workflowsDir = path.join(claudeDir, "workflows");
  const workflows = fs.existsSync(workflowsDir)
    ? fs
        .readdirSync(workflowsDir)
        .filter((f) => f.endsWith(".md"))
        .sort()
        .map((f) => ({
          file: f,
          name: f.replace(/\.md$/, ""),
          content: fs.readFileSync(path.join(workflowsDir, f), "utf-8"),
        }))
    : [];

  const agentsDir = path.join(claudeDir, "agents");
  const agents = walkMd(agentsDir)
    .sort()
    .map((full) => {
      const { data, body } = parseFrontmatter(fs.readFileSync(full, "utf-8"));
      return {
        file: full,
        group: path.basename(path.dirname(full)),
        name: data.name || path.basename(full, ".md"),
        data,
        body,
      };
    });

  const commandsDir = path.join(claudeDir, "commands");
  const commands = walkMd(commandsDir)
    .sort()
    .map((full) => {
      const { data, body } = parseFrontmatter(fs.readFileSync(full, "utf-8"));
      return {
        file: full,
        ns: path.basename(path.dirname(full)), // "ck" | "mk"
        name: path.basename(full, ".md"),
        data,
        body,
      };
    });

  let skillsSrc = null;
  const skillsLink = path.join(claudeDir, "skills");
  if (fs.existsSync(skillsLink)) {
    try {
      skillsSrc = fs.realpathSync(skillsLink);
    } catch {
      skillsSrc = skillsLink;
    }
  }

  let mcpServers = null;
  const mcpPath = path.join(claudeDir, "mcp.json");
  if (fs.existsSync(mcpPath)) {
    try {
      mcpServers = JSON.parse(fs.readFileSync(mcpPath, "utf-8")).mcpServers || null;
    } catch {
      mcpServers = null;
    }
  }

  return { claudeMd, workflows, agents, commands, skillsSrc, mcpServers };
}

module.exports = { scanClaudeProject, walkMd };
