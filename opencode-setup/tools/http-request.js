import { tool } from "@opencode-ai/plugin";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Make an HTTP request — supports GET, POST, PUT, DELETE, PATCH.
 * Returns status, headers, and body (auto-detects JSON for pretty-print).
 *
 * Use cases:
 *   - "GET the current weather for Berlin from the API"
 *   - "POST this payload to the webhook endpoint and show me the response"
 *   - "Check what headers the website example.com returns"
 */
export const httpRequest = tool({
  description:
    "Make an HTTP request to any URL. Supports all methods, custom headers, and request bodies. Auto-parses JSON responses.",
  args: {
    url: tool.schema.string().describe("The full URL to request"),
    method: tool.schema
      .enum(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"])
      .optional()
      .describe("HTTP method (default: GET)"),
    headers: tool.schema
      .record(tool.schema.string(), tool.schema.string())
      .optional()
      .describe("Custom headers as key-value pairs"),
    body: tool.schema.string().optional().describe("Request body (for POST/PUT/PATCH)"),
    timeout: tool.schema.number().optional().describe("Request timeout in ms (default: 15000)"),
    followRedirects: tool.schema.boolean().optional().describe("Follow redirects (default: true)"),
  },
  async execute({ url, method = "GET", headers, body, timeout = 15000, followRedirects = true }) {
    const curlCmd = ["curl", "-s", "-w", "\\n%{http_code}|%{content_type}|%{time_total}"];
    curlCmd.push(ifTrue(followRedirects, "-L"));
    curlCmd.push(`-m ${Math.ceil(timeout / 1000)}`);

    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        curlCmd.push(`-H "${k}: ${v}"`);
      }
    }

    const methodsWithoutBody = ["GET", "HEAD", "OPTIONS"];
    if (body && !methodsWithoutBody.includes(method)) {
      const escaped = body.replace(/"/g, '\\"').replace(/\n/g, "\\n");
      curlCmd.push(`-d "${escaped}"`);
      curlCmd.push("-H 'Content-Type: application/json'");
    }

    curlCmd.push(`-X ${method}`);
    curlCmd.push(`"${url}"`);

    const cmd = curlCmd.join(" ");
    try {
      const { stdout } = await execAsync(cmd, { timeout: timeout + 5000 });
      const lastNewline = stdout.lastIndexOf("\n");
      const [statusLine, responseBody] = [
        stdout.slice(lastNewline + 1),
        stdout.slice(0, lastNewline),
      ];
      const [status, contentType, timeTotal] = statusLine.split("|");

      let parsed;
      let formattedBody;
      if (contentType?.includes("json")) {
        try {
          parsed = JSON.parse(responseBody);
          formattedBody = JSON.stringify(parsed, null, 2);
        } catch {
          formattedBody = responseBody;
        }
      } else {
        formattedBody = responseBody;
      }

      return {
        status: parseInt(status, 10),
        contentType,
        timeTotal: `${timeTotal}s`,
        body: formattedBody,
        raw: responseBody.length > 2000 ? responseBody.slice(0, 2000) + "..." : responseBody,
      };
    } catch (err) {
      return { error: err.message || "Request failed", hint: "Check the URL and network" };
    }
  },
});

function ifTrue(condition, value) {
  return condition ? value : "";
}

export default { httpRequest };
