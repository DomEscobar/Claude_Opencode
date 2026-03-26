import { tool } from "@opencode-ai/plugin";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Query and extract data from JSON or JSON Lines files using jq-style expressions.
 * Works with single JSON objects, arrays, and NLJSON (one JSON object per line).
 *
 * Use cases:
 *   - "Show me the names of all users older than 30 from this JSON file"
 *   - "Extract the error messages from this NDJSON log file"
 *   - "Count how many products have price > 100 in the inventory JSON"
 */
export const jsonQuery = tool({
  description:
    "Query and extract data from JSON or NDJSON (JSON Lines) files using jq-style filter expressions. Supports projections, comparisons, aggregations, and more.",
  args: {
    expression: tool.schema
      .string()
      .describe(
        "jq expression (e.g. '.users[] | select(.age > 30) | .name', 'length', 'map(.id)')"
      ),
    file: tool.schema.string().optional().describe("Path to the JSON/NDJSON file"),
    data: tool.schema.string().optional().describe("Raw JSON string (use instead of file)"),
    compact: tool.schema
      .boolean()
      .optional()
      .describe("Output compact JSON instead of pretty-printed (default: false)"),
  },
  async execute({ expression, file, data, compact = false }) {
    if (!file && !data) {
      return { error: "Must provide either 'file' path or 'data' string" };
    }

    let jsonInput;
    if (data) {
      jsonInput = data;
    } else {
      try {
        const { readFile } = await import("fs/promises");
        jsonInput = await readFile(file, "utf8");
      } catch (err) {
        return { error: `Could not read file: ${err.message}` };
      }
    }

    const jqCmd = `jq ${compact ? "-c" : ""} '${expression.replace(/'/g, "'\\''")}' ${
      file ? `"${file}"` : "-n"
    }`;

    if (!file) {
      // Pass raw JSON via stdin for data string
      const cmd = `echo '${jsonInput.replace(/'/g, "'\\''")}' | jq ${compact ? "-c" : ""} '${expression.replace(/'/g, "'\\''")}'`;
      try {
        const { stdout, stderr } = await execAsync(cmd);
        if (stderr && !stdout) return { error: stderr.trim() };
        return { result: stdout.trim(), expression, inputType: "raw JSON" };
      } catch (err) {
        return { error: err.message || "jq failed", hint: "Check your jq expression syntax" };
      }
    }

    try {
      const { stdout, stderr } = await execAsync(jqCmd);
      if (stderr && !stdout) return { error: stderr.trim() };
      return { result: stdout.trim(), expression, file };
    } catch (err) {
      return {
        error: err.message || "jq failed",
        hint: "Check your jq expression syntax. Examples: '.' (whole doc), '.key', '.[]', '.[] | .name', 'length'",
      };
    }
  },
});

export default { jsonQuery };
