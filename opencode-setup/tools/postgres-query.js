import { tool } from "@opencode-ai/plugin";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Execute a SQL query against PostgreSQL.
 * Requires `psql` CLI and a valid PostgreSQL connection string.
 *
 * Use cases:
 *   - "Show me all rows in the users table"
 *   - "Count orders created in the last 24 hours"
 *   - "Check what indexes exist on the events table"
 */
export const postgresQuery = tool({
  description:
    "Execute a read-only SQL query against a PostgreSQL database using psql. Returns formatted tabular output. Use only SELECT statements — no INSERT/UPDATE/DELETE.",
  args: {
    query: tool.schema.string().describe("The SQL SELECT query to execute"),
    connectionString: tool.schema
      .string()
      .optional()
      .describe(
        "PostgreSQL connection string (e.g. postgresql://user:pass@host:5432/db). Falls back to PG* env vars if omitted."
      ),
    timeout: tool.schema
      .number()
      .optional()
      .describe("Query timeout in seconds (default: 30)"),
  },
  async execute({ query, connectionString, timeout = 30 }) {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed.startsWith("select")) {
      return { error: "Only SELECT queries are allowed for safety." };
    }

    const env = { ...process.env };
    if (connectionString) {
      env.PGCONNECTSTRING = connectionString;
    }

    const timeoutArg = `--set=statement_timeout=${timeout * 1000}`;
    const cmd = `psql ${timeoutArg} -t -A -F $'\\t' ${
      connectionString ? `"${connectionString}"` : ""
    } -c "${query.replace(/"/g, '\\"')}"`;

    try {
      const { stdout, stderr } = await execAsync(cmd, {
        env,
        timeout: (timeout + 5) * 1000,
      });
      if (stderr && !stdout) return { error: stderr.trim() };
      return {
        rows: stdout
          .trim()
          .split("\n")
          .map((line) => line.split("\t")),
        columns: stdout
          .trim()
          .split("\n")[0]
          ?.split("\t")
          .map((_, i) => `col_${i}`),
        count: stdout.trim().split("\n").length,
      };
    } catch (err) {
      return {
        error: err.message || "Query failed",
        hint: "Make sure psql is installed and credentials are correct",
      };
    }
  },
});

export default { postgresQuery };
