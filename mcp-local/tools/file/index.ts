import fs from "node:fs"
import path from "node:path"
import type { MCPTool, AnySchema, ZodRawShapeCompat } from "../../types.js"

interface FileArgs {
    filePath: string
}

/* ------------------------------------------------------------------
 * 🗑️ TOOL: Safe Delete (Soft Delete)
 * ------------------------------------------------------------------ */
export const safeDelete: MCPTool = {
    name: "safe_delete",
    title: "hapus file dengan aman",
    description:
        "Memindahkan file ke .opencode-trash agar bisa dikembalikan",
    inputSchema: {
        type: "object",
        properties: {
            filePath: { type: "string" },
        },
        required: ["filePath"],
    } as unknown as undefined | ZodRawShapeCompat | AnySchema,
    handler: async (args: unknown) => {
        const { filePath } = args as FileArgs

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
    },
}

export const fileTools: MCPTool[] = [safeDelete]