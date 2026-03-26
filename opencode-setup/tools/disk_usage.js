import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Get current disk usage for mounted filesystems",
  args: {},
  async execute(args, context) {
    const result = await Bun.$`df -h --output=source,size,used,avail,pcent,target -x tmpfs -x devtmpfs -x squashfs`.text()
    return result
  }
})
