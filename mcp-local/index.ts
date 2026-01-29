import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import * as z from "zod"
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const mcpServer = new McpServer({
    name: "tanstack-mcp",
    version: "1.1.0",
    description: "MCP server for TanStack application with safety guard",
})

/* ------------------------------------------------------------------
 * 📦 TOOL: Mantine Component
 * ------------------------------------------------------------------ */
mcpServer.registerTool(
    "mantine_component",
    {
        description: "Get Mantine LLM reference",
    },
    async () => {
        const res = await fetch("https://mantine.dev/llms.txt")
        const text = await res.text()
        return {
            content: [{ type: "text", text }],
        }
    }
)

/* ------------------------------------------------------------------
 * 🔔 TOOL: Notify User
 * ------------------------------------------------------------------ */
mcpServer.registerTool(
    "notify_user",
    {
        title: "kirim informasi ke user",
        description:
            "Gunakan tool ini untuk mengirim informasi ke user , gunakan format txt yang baik dan benar",
        inputSchema: z.object({
            text: z.string(),
        }),
    },
    async ({ text }) => {
        const res = await fetch(
            `https://wa.wibudev.com/code?nom=6289505046093&text=${encodeURIComponent(
                text
            )}`
        )
        const data = await res.json()
        return {
            content: [{ type: "text", text: JSON.stringify(data) }],
        }
    }
)

/* ------------------------------------------------------------------
 * 🛡️ TOOL: Git Snapshot (Auto Safety Net)
 * ------------------------------------------------------------------ */
mcpServer.registerTool(
    "git_snapshot",
    {
        title: "buat snapshot git",
        description:
            "WAJIB dipanggil sebelum menghapus, menimpa, atau memodifikasi banyak file",
    },
    async () => {
        try {
            execSync("git add -A", { stdio: "ignore" })
            execSync(
                `git commit -m "opencode snapshot: ${new Date().toISOString()}"`,
                { stdio: "ignore" }
            )
            return {
                content: [{ type: "text", text: "Git snapshot created" }],
            }
        } catch {
            return {
                content: [
                    {
                        type: "text",
                        text: "Snapshot skipped (no changes or git not initialized)",
                    },
                ],
            }
        }
    }
)

/* ------------------------------------------------------------------
 * 🔄 TOOL: Git Rollback
 * ------------------------------------------------------------------ */
mcpServer.registerTool(
    "git_rollback",
    {
        title: "rollback perubahan terakhir",
        description:
            "Gunakan jika terjadi kesalahan atau hasil tidak sesuai",
    },
    async () => {
        execSync("git reset --hard HEAD~1", { stdio: "ignore" })
        return {
            content: [{ type: "text", text: "Rollback to previous snapshot done" }],
        }
    }
)

/* ------------------------------------------------------------------
 * 🗄️ TOOL: Prisma Database
 * ------------------------------------------------------------------ */
mcpServer.registerTool(
    "prisma_database",
    {
        title: "prisma database operations",
        description:
            "Operasi database Prisma: generate client, push schema, migrate, studio, seed, atau query data",
        inputSchema: z.object({
            action: z.enum([
                "generate",
                "push",
                "migrate",
                "studio",
                "seed",
                "query",
                "status",
            ]),
            query: z.string().optional(),
            schema: z.string().optional(),
        }),
    },
    async ({ action, query, schema }) => {
        try {
            switch (action) {
                case "generate":
                    execSync("pnpm db:generate", { stdio: "inherit" })
                    return {
                        content: [
                            {
                                type: "text",
                                text: "Prisma client generated successfully",
                            },
                        ],
                    }
                case "push":
                    execSync("pnpm db:push", { stdio: "inherit" })
                    return {
                        content: [
                            {
                                type: "text",
                                text: "Schema pushed to database successfully",
                            },
                        ],
                    }
                case "migrate":
                    execSync("pnpm db:migrate", { stdio: "inherit" })
                    return {
                        content: [
                            {
                                type: "text",
                                text: "Database migration completed",
                            },
                        ],
                    }
                case "studio":
                    execSync("pnpm db:studio", { stdio: "inherit" })
                    return {
                        content: [
                            {
                                type: "text",
                                text: "Prisma Studio opened",
                            },
                        ],
                    }
                case "seed":
                    execSync("pnpm db:seed", { stdio: "inherit" })
                    return {
                        content: [
                            {
                                type: "text",
                                text: "Database seeding completed",
                            },
                        ],
                    }
                case "query":
                    if (!query) {
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: "Query is required for 'query' action",
                                },
                            ],
                        }
                    }
                    // Execute query using npx prisma query
                    const queryResult = execSync(
                        `npx prisma execute-query "${query.replace(/"/g, '\\"')}"`,
                        { encoding: "utf-8" }
                    )
                    return {
                        content: [
                            {
                                type: "text",
                                text: queryResult,
                            },
                        ],
                    }
                case "status":
                    const statusResult = execSync(
                        "npx prisma status",
                        { encoding: "utf-8" }
                    )
                    return {
                        content: [
                            {
                                type: "text",
                                text: statusResult,
                            },
                        ],
                    }
                default:
                    return {
                        content: [
                            {
                                type: "text",
                                text: "Unknown action",
                            },
                        ],
                    }
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            }
        }
    }
)

/* ------------------------------------------------------------------
 * 🗑️ TOOL: Safe Delete (Soft Delete)
 * ------------------------------------------------------------------ */
mcpServer.registerTool(
    "safe_delete",
    {
        title: "hapus file dengan aman",
        description:
            "Memindahkan file ke .opencode-trash agar bisa dikembalikan",
        inputSchema: z.object({
            filePath: z.string(),
        }),
    },
    async ({ filePath }) => {
        const trashDir = ".opencode-trash"
        if (!fs.existsSync(trashDir)) {
            fs.mkdirSync(trashDir)
        }

        const base = path.basename(filePath)
        const target = path.join(
            trashDir,
            `${base}.${Date.now()}.bak`
        )

        fs.renameSync(filePath, target)

        return {
            content: [
                {
                    type: "text",
                    text: `File moved to ${target}`,
                },
            ],
        }
    }
)

/* ------------------------------------------------------------------
 * 🚀 CONNECT
 * ------------------------------------------------------------------ */
await mcpServer.connect(new StdioServerTransport())
