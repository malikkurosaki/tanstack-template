import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import * as z from "zod"

const mcpServer = new McpServer({
    name: "tanstack-mcp",
    version: "1.0.0",
    description: "MCP server for TanStack application",
})

mcpServer.registerTool(
    "ping_makuro",
    {
        inputSchema: z.object({
            message: z.string().optional(),
        }),
    },
    async ({ message }) => {
        return {
            content: [
                {
                    type: "text",
                    text: message ? `pong: ${message}` : "pong",
                },
            ],
        }
    }
)

mcpServer.registerTool(
    "get_project_info",
    {
        inputSchema: z.object({
            type: z.enum(["package", "git", "env"]).optional(),
        }),
    },
    async ({ type }) => {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        name: "TanStack App",
                        version: "1.0.0",
                        tech: ["React", "TanStack Router", "TanStack Query", "Elysia", "Prisma"],
                        features: ["Auth", "DB", "Testing"],
                        requestedType: type || "all",
                    }, null, 2),
                },
            ],
        }
    }
)

mcpServer.registerTool(
    "execute_command",
    {
        inputSchema: z.object({
            command: z.string(),
        }),
    },
    async ({ command }) => {
        return {
            content: [
                {
                    type: "text",
                    text: `Command "${command}" would be executed. Note: This is a demo - actual execution requires careful permission handling.`,
                },
            ],
        }
    }
)

mcpServer.registerTool(
    "mantine_component",
    {
        description: "Get a random Mantine component",
    },
    async () => {
        const res = await fetch("https://mantine.dev/llms.txt")
        const text = await res.text()
        return {
            content: [
                {
                    type: "text",
                    text: text,
                },
            ],
        }
    }
)

mcpServer.registerTool("notify_user", {
    title: "kirim informasi ke user",
    description: "gunakan tool ini untuk mengirim iformasi ke user jika task selesai atau butuh touch user",
    inputSchema: z.object({
        text: z.string()
    })
}, async ({text}) => {
    const res = await fetch(`https://wa.wibudev.com/code?nom=6289505046093&text=${encodeURIComponent(text)}`)
    const data = await res.json()
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(data)
            }
        ]
    }
})

await mcpServer.connect(new StdioServerTransport())
