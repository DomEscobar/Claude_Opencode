import { tool } from "@opencode-ai/plugin";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Show detailed Docker container status including CPU%, memory%, port mappings,
 * and health checks — far more useful than plain `docker ps`.
 *
 * Use cases:
 *   - "Show me all running containers with their CPU and memory usage"
 *   - "Which containers are mapping port 5432?"
 *   - "Check if my web container is healthy"
 */
export const dockerPsVerbose = tool({
  description:
    "List Docker containers with resource usage (CPU%, MEM%), port mappings, status, and health info. Shows more than plain docker ps.",
  args: {
    all: tool.schema
      .boolean()
      .optional()
      .describe("Include stopped containers (default: false — show only running)"),
    format: tool.schema
      .enum(["table", "json"])
      .optional()
      .describe("Output format (default: table)"),
    name: tool.schema.string().optional().describe("Filter by container name substring"),
  },
  async execute({ all = false, format = "table", name }) {
    // First get container list
    const psCmd = `docker ps ${all ? "-a" : ""} --format "{{.ID}}|{{.Names}}|{{.Image}}|{{.Status}}|{{.Ports}}|{{.State}}"`;
    try {
      const { stdout: psStdout } = await execAsync(psCmd);

      if (!psStdout.trim()) {
        return { containers: [], summary: all ? "No containers" : "No running containers" };
      }

      const containers = psStdout.trim().split("\n").filter(Boolean).map((line) => {
        const [id, names, image, status, ports, state] = line.split("|");
        return { id, names, image, status, ports, state };
      });

      // Filter by name if provided
      const filtered = name
        ? containers.filter((c) => c.names.includes(name))
        : containers;

      if (filtered.length === 0) {
        return { containers: [], summary: `No containers matching '${name}'` };
      }

      // Get stats for running containers
      const running = filtered.filter((c) => c.state === "running");
      const statsMap = {};

      if (running.length > 0) {
        const { stdout: statsStdout } = await execAsync(
          `docker stats --no-stream --format "{{.Name}}|{{.CPUPerc}}|{{.MemPerc}}|{{.MemUsage}}" ${running
            .map((c) => c.names)
            .join(" ")}`
        );

        for (const line of statsStdout.trim().split("\n").filter(Boolean)) {
          const [n, cpu, mem, memUsage] = line.split("|");
          statsMap[n] = { cpu, mem, memUsage };
        }
      }

      // Get inspect info for health checks
      const withHealth = await Promise.all(
        filtered.map(async (c) => {
          try {
            const { stdout: inspectStdout } = await execAsync(
              `docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' ${c.id}`
            );
            return { ...c, health: inspectStdout.trim() };
          } catch {
            return { ...c, health: "unknown" };
          }
        })
      );

      if (format === "json") {
        return { containers: withHealth.map((c) => ({ ...c, ...statsMap[c.names] })) };
      }

      // Human-readable table
      const rows = withHealth.map((c) => {
        const stats = statsMap[c.names] || { cpu: "-", mem: "-", memUsage: "-" };
        return {
          name: c.names.slice(0, 20),
          image: c.image.replace(/^[^/]+\//, "").slice(0, 20),
          status: c.status.slice(0, 25),
          cpu: stats.cpu,
          mem: stats.mem,
          health: c.health === "none" ? "—" : c.health,
          ports: c.ports ? c.ports.slice(0, 40) : "—",
        };
      });

      return { containers: rows, summary: `${rows.length} container(s)` };
    } catch (err) {
      return {
        error: err.message,
        hint: "Make sure Docker is running and you have permission to access it",
      };
    }
  },
});

export default { dockerPsVerbose };
