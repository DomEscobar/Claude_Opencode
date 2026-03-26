import { tool } from "@opencode-ai/plugin";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Scan files or directories for accidentally committed secrets:
 * API keys, tokens, private keys, database passwords, AWS credentials, etc.
 * Useful as a pre-commit safety check.
 *
 * Use cases:
 *   - "Scan the current repo for any exposed secrets"
 *   - "Check if this file contains any API keys or tokens"
 *   - "Audit for AWS access keys before pushing"
 */
export const secretScan = tool({
  description:
    "Scan files or a git repository for accidentally committed secrets: API keys, tokens, private keys, database passwords, AWS credentials, and other sensitive data.",
  args: {
    path: tool.schema.string().optional().describe("Path to scan (default: current directory)"),
    scanGit: tool.schema
      .boolean()
      .optional()
      .describe("Also scan git history (default: true)"),
    patterns: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe("Additional regex patterns to match (as JSON strings)"),
    exclude: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe("Paths/patterns to exclude (e.g. ['node_modules', '*.test.js'])"),
    severity: tool.schema
      .enum(["all", "high", "medium"])
      .optional()
      .describe("Minimum severity to report (default: all)"),
  },
  async execute({ path = ".", scanGit = true, patterns, exclude, severity = "all" }) {
    // Build grep patterns for common secrets
    const defaultPatterns = [
      { pattern: "AKIA[0-9A-Z]{16}", type: "AWS Access Key ID", severity: "high" },
      { pattern: "(?i)aws_secret_access_key\\s*[=:]\\s*['\"]?\\w+", type: "AWS Secret Key", severity: "high" },
      { pattern: "(?i)(api[_-]?key|apikey)\\s*[=:]['\"]?[a-zA-Z0-9]{20,}", type: "API Key", severity: "high" },
      { pattern: "(?i)bearer\\s+[a-zA-Z0-9\\-_\\.]{20,}", type: "Bearer Token", severity: "high" },
      { pattern: "(?i)ghp_[a-zA-Z0-9]{36}", type: "GitHub Personal Access Token", severity: "high" },
      { pattern: "(?i)gho_[a-zA-Z0-9]{36}", type: "GitHub OAuth Token", severity: "high" },
      { pattern: "(?i)sk-[a-zA-Z0-9]{48}", type: "OpenAI API Key", severity: "high" },
      { pattern: "(?i)sk_live_[a-zA-Z0-9]{24,}", type: "Stripe Live Key", severity: "high" },
      { pattern: "(?i)sk_test_[a-zA-Z0-9]{24,}", type: "Stripe Test Key", severity: "medium" },
      { pattern: "(?i)password\\s*[=:]['\"]?[^\\s'\"]{8,}", type: "Hardcoded Password", severity: "high" },
      { pattern: "(?i)(db_password|dbpass|database_password)\\s*[=:]\\s*['\"]?\\w+", type: "Database Password", severity: "high" },
      { pattern: "(?i)postgres(ql)?://[^:]+:[^@]+@", type: "Database Connection String with Password", severity: "high" },
      { pattern: "-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----", type: "Private Key", severity: "high" },
      { pattern: "(?i)slack_token\\s*[=:]['\"]?xox[baprs]-[0-9\\-]{10,}", type: "Slack Token", severity: "high" },
      { pattern: "(?i)twilio_(account_sid|auth_token)\\s*[=:]\\s*['\"]?\\w+", type: "Twilio Credential", severity: "high" },
      { pattern: "(?i)google_api_key\\s*[=:]['\"]?[a-zA-Z0-9\\-_]{20,}", type: "Google API Key", severity: "high" },
      { pattern: "(?i)jwt[_-]?secret\\s*[=:]['\"]?\\w+", type: "JWT Secret", severity: "high" },
      { pattern: "(?i)(secret|token|key)\\s*[=:]['\"]?['\"]?[a-zA-Z0-9\\-_]{32,}['\"]?", type: "Generic Secret", severity: "medium" },
    ];

    const allPatterns = patterns
      ? [...defaultPatterns, ...patterns.map((p) => ({ pattern: p, type: "Custom", severity: "medium" }))]
      : defaultPatterns;

    const results = [];
    const excludeArgs = exclude ? exclude.flatMap((e) => ["--exclude", e]) : ["--exclude=*.min.js", "--exclude=node_modules", "--exclude=.git/objects"];

    for (const { pattern, type, severity: sev } of allPatterns) {
      if (severity === "high" && sev === "medium") continue;
      const cmd = [
        "grep",
        "-rnP",
        `--exclude-dir=${["node_modules", ".git"].join(",")}`,
        "-E",
        `"${pattern}"`,
        `"${path}"`,
      ].join(" ");

      try {
        const { stdout } = await execAsync(cmd, { timeout: 30000 });
        for (const line of stdout.trim().split("\n").filter(Boolean)) {
          const colon2 = line.indexOf(":");
          const colon3 = line.indexOf(":", colon2 + 1);
          const filePath = line.slice(0, colon2);
          const lineNum = line.slice(colon2 + 1, colon3);
          const match = line.slice(colon3 + 1);

          // Mask the secret in output
          const masked = maskSecret(match, pattern);

          results.push({
            file: filePath,
            line: parseInt(lineNum, 10),
            type,
            severity: sev,
            match: masked,
            pattern,
          });
        }
      } catch {
        // grep returns non-zero when no matches found — that's fine
      }
    }

    // Deduplicate
    const seen = new Set();
    const unique = results.filter((r) => {
      const key = `${r.file}:${r.line}:${r.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const high = unique.filter((r) => r.severity === "high");
    const medium = unique.filter((r) => r.severity === "medium");

    return {
      total: unique.length,
      high: high.length,
      medium: medium.length,
      findings: unique.slice(0, 50),
      summary: unique.length === 0
        ? "✅ No secrets detected"
        : `⚠️  Found ${unique.length} secret(s) — ${high.length} high, ${medium.length} medium`,
    };
  },
});

function maskSecret(line, pattern) {
  // Replace the actual secret portion while keeping context
  return line.replace(/(["']?)([a-zA-Z0-9_\-]{20,})\1/, (_, q, secret) => {
    return `${q}${secret.slice(0, 4)}${"•".repeat(Math.min(secret.length - 8, 20))}${secret.slice(-4)}${q}`;
  });
}

export default { secretScan };
