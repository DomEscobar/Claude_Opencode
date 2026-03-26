import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Show the current git status of the project",
  args: {},
  async execute(args, context) {
    const status = await Bun.$`git status --porcelain`.text()
    const branch = await Bun.$`git branch --show-current`.text()
    const ahead = await Bun.$`git log origin/$(git branch --show-current)..HEAD --oneline 2>/dev/null | wc -l`.text()
    const behind = await Bun.$`git log HEAD..origin/$(git branch --show-current) --oneline 2>/dev/null | wc -l`.text()
    return {
      branch: branch.trim(),
      ahead: parseInt(ahead.trim()),
      behind: parseInt(behind.trim()),
      changes: status.trim().split("\n").filter(Boolean),
    }
  }
})
