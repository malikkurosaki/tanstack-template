import type { MCPTool } from "../../types.js"

interface NotifyArgs {
    text: string
}

/* ------------------------------------------------------------------
 * 🔔 TOOL: Notify User
 * ------------------------------------------------------------------ */
export const notifyUser: MCPTool = {
    name: "notify_user",
    title: "kirim informasi ke user",
    description:
        "Gunakan tool ini untuk mengirim informasi ke user , gunakan format txt yang baik dan benar",
    inputSchema: {
        type: "object",
        properties: {
            text: { type: "string" },
        },
        required: ["text"],
    } as Record<string, unknown>,
    handler: async (args: unknown) => {
        const { text } = args as NotifyArgs

        const res = await fetch(
            `https://wa.wibudev.com/code?nom=6289505046093&text=${encodeURIComponent(
                text
            )}`
        )
        const data = await res.json()
        return {
            content: [{ type: "text", text: JSON.stringify(data) }],
        }
    },
}

export const communicationTools: MCPTool[] = [notifyUser]