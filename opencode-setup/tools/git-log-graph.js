import { tool } from "@opencode-ai/plugin";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Show a visual git commit graph with branch/merge structure.
 * Much easier to read than plain git log for understanding repo history.
 *
 * Use cases:
 *   - "Show me the git graph for the last 20 commits"
 *   - "Visualize the feature branch and how it diverged from main"
 *   - "See all branches and their relationships"
 */
export const gitLogGraph = tool({
  description:
    "Render a pretty ASCII git commit graph showing branch structure, merges, tags, and commit messages. Easier to parse than plain git log.",
  args: {
    count: tool.schema
      .number()
      .optional()
      .describe("Number of commits to show (default: 20, max: 100)"),
    branch: tool.schema.string().optional().describe("Show only commits reachable from this branch"),
    author: tool.schema.string().optional().describe("Filter by author name/email"),
    since: tool.schema
      .string()
      .optional()
      .describe("Show commits since this date (e.g. '2 weeks ago', '2024-01-01')"),
    path: tool.schema
      .string()
      .optional()
      .describe("Only show commits affecting this path/file"),
    all: tool.schema.boolean().optional().describe("Show all branches (default: false)"),
  },
  async execute({ count = 20, branch, author, since, path, all = false }) {
    const args = [
      "log",
      `--graph`,
      `--abbrev-commit`,
      `--decorate`,
      `--format=%C(bold yellow)%h%C(reset) %C(bold green)(%ar)%C(reset) %C(bold blue)%d%C(reset) %s %C(dim)%an%C(reset)%C(bold red)%?%?`,
      `--date=relative`,
    ];

    if (all) {
      args.push("--all");
    }
    if (branch) {
      args.push(branch);
    }
    if (author) {
      args.push(`--author=${author}`);
    }
    if (since) {
      args.push(`--since="${since}"`);
    }
    if (path) {
      args.push("--");
      args.push(path);
    }
    args.push(`-n ${Math.min(count, 100)}`);

    const cmd = `git ${args.join(" ")}`;
    try {
      const { stdout } = await execAsync(cmd, {
        cwd: process.env.GIT_DIR || process.cwd(),
      });

      // Also get branch name + status summary
      const { stdout: branchStdout } = await execAsync("git branch --porcelain -u HEAD 2>/dev/null || git branch --show-current 2>/dev/null");
      const { stdout: statusStdout } = await execAsync(
        "git status --porcelain 2>/dev/null | head -5"
      );

      return {
        graph: stdout || "(no commits found)",
        currentBranch: branchStdout.trim() || "detached",
        changes: statusStdout.trim()
          ? `${statusStdout.trim().split("\n").length} changed file(s)`
          : "clean",
      };
    } catch (err) {
      return {
        error: err.message.includes("not a git repository")
          ? "Not a git repository"
          : err.message,
        hint: "Run this from inside a git repository",
      };
    }
  },
});

export default { gitLogGraph };
