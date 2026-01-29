import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import * as z from "zod"
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const mcpServer = new McpServer({
    name: "tanstack-mcp",
    version: "1.1.0",
    title: "mcp-local"
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
            "Gunakan tool ini untuk mengirim informasi kepada pengguna. Pesan harus dikirim dalam format teks biasa (plain text), bukan Markdown atau HTML, dengan bahasa yang jelas, sopan, dan mudah dipahami.",
        inputSchema: z.object({
            text: z.string(),
        }),
    },
    async ({ text }) => {
        const BOT_TOKEN = process.env.BOT_TOKEN;
        const CHAT_ID = process.env.CHAT_ID;

        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
            }),
        });
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
