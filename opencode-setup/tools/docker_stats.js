import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Get Docker container resource usage",
  args: {},
  async execute(args, context) {
    const result = await Bun.$`docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"`.text()
    return result
  }
})
