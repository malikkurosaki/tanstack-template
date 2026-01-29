import { execSync } from "node:child_process"
import type { MCPTool } from "../../types.js"

/* ------------------------------------------------------------------
 * 🛡️ TOOL: Git Snapshot (Auto Safety Net)
 * ------------------------------------------------------------------ */
export const gitSnapshot: MCPTool = {
    name: "git_snapshot",
    title: "buat snapshot git",
    description:
        "WAJIB dipanggil sebelum menghapus, menimpa, atau memodifikasi banyak file",
    inputSchema: undefined,
    handler: async () => {
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
    },
}

/* ------------------------------------------------------------------
 * 🔄 TOOL: Git Rollback
 * ------------------------------------------------------------------ */
export const gitRollback: MCPTool = {
    name: "git_rollback",
    title: "rollback perubahan terakhir",
    description:
        "Gunakan jika terjadi kesalahan atau hasil tidak sesuai",
    inputSchema: undefined,
    handler: async () => {
        execSync("git reset --hard HEAD~1", { stdio: "ignore" })
        return {
            content: [{ type: "text", text: "Rollback to previous snapshot done" }],
        }
    },
}

export const gitTools: MCPTool[] = [gitSnapshot, gitRollback]