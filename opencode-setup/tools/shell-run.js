import { tool } from "@opencode-ai/plugin";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Run a shell/PowerShell command and return structured output including
 * stdout, stderr, exit code, and execution time. Great for automation
 * and running sequences of commands.
 *
 * Use cases:
 *   - "Run 'npm test' and show me the output"
 *   - "Execute this series of docker commands and show me all results"
 *   - "Check if a service is running by running 'pgrep'"
 */
export const shellRun = tool({
  description:
    "Execute a shell command and return structured output: stdout, stderr, exit code, and execution time. Supports chaining via '&&' or ';'.",
  args: {
    command: tool.schema
      .string()
      .describe("The shell command to execute (supports pipes, &&, ;, etc.)"),
    cwd: tool.schema.string().optional().describe("Working directory for the command"),
    timeout: tool.schema
      .number()
      .optional()
      .describe("Timeout in seconds (default: 60, max: 300)"),
    envVars: tool.schema
      .record(tool.schema.string(), tool.schema.string())
      .optional()
      .describe("Additional environment variables to set"),
    shell: tool.schema
      .enum(["bash", "sh", "pwsh", "cmd"])
      .optional()
      .describe("Shell to use (default: bash on Unix, pwsh on Windows)"),
  },
  async execute({ command, cwd, timeout = 60, envVars, shell = "bash" }) {
    if (timeout > 300) {
      return { error: "Timeout cannot exceed 300 seconds" };
    }

    // Safety: block some dangerous commands
    const dangerous = [
      /^\s*rm\s+-rf\s+\/\s*$/,
      /^shutdown/i,
      /^dd\s+if=.*of=\/dev\//,
    ];
    for (const pattern of dangerous) {
      if (pattern.test(command.trim())) {
        return { error: "Command blocked for safety" };
      }
    }

    const startTime = Date.now();
    const env = { ...process.env, ...envVars };
    const shellCmd = shell === "bash" || shell === "sh" ? "/bin/sh" : shell;

    try {
      const { stdout, stderr, exitCode } = await execAsync(command, {
        cwd: cwd || process.cwd(),
        env,
        timeout: timeout * 1000,
        shell: shellCmd,
      });

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      return {
        command,
        exitCode,
        stdout: stdout || "(no stdout)",
        stderr: stderr || "(no stderr)",
        duration: `${duration}s`,
        success: exitCode === 0,
      };
    } catch (err) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      const partial = err.stdout || "";
      const partialErr = err.stderr || "";
      return {
        command,
        exitCode: err.exitCode || 1,
        stdout: partial || "(no stdout)",
        stderr: partialErr || err.message,
        duration: `${duration}s`,
        success: false,
        timedOut: err.message?.includes("timed out"),
      };
    }
  },
});

export default { shellRun };
