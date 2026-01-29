import { execSync } from "node:child_process"
import type { MCPTool } from "../../types.js"

type PrismaAction = "generate" | "push" | "migrate" | "studio" | "seed" | "query" | "status"

interface PrismaArgs {
    action: PrismaAction
    query?: string
    schema?: string
}

/* ------------------------------------------------------------------
 * 🗄️ TOOL: Prisma Database
 * ------------------------------------------------------------------ */
export const prismaDatabase: MCPTool = {
    name: "prisma_database",
    title: "prisma database operations",
    description:
        "Operasi database Prisma: generate client, push schema, migrate, studio, seed, atau query data",
    inputSchema: {
        type: "object",
        properties: {
            action: {
                type: "string",
                enum: ["generate", "push", "migrate", "studio", "seed", "query", "status"],
            },
            query: { type: "string" },
            schema: { type: "string" },
        },
        required: ["action"],
    } as Record<string, unknown>,
    handler: async (args: unknown) => {
        const { action, query } = args as PrismaArgs

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
    },
}

export const prismaTools: MCPTool[] = [prismaDatabase]