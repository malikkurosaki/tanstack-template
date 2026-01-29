import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { allTools } from "./tools/index.js"

const mcpServer = new McpServer({
    name: "tanstack-mcp",
    version: "1.2.0",
    description: "MCP server for TanStack application with safety guard",
})

// Register all tools from separated modules
allTools.forEach((tool) => {
    mcpServer.registerTool(
        tool.name,
        {
            title: tool.title,
            description: tool.description,
            inputSchema: tool.inputSchema,
        },
        tool.handler
    )
})

/* ------------------------------------------------------------------
 * 🚀 CONNECT
 * ------------------------------------------------------------------ */
await mcpServer.connect(new StdioServerTransport())