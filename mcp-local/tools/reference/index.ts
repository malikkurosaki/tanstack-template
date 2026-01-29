import type { MCPTool } from "../../types.js"

/* ------------------------------------------------------------------
 * 📦 TOOL: Mantine Component
 * ------------------------------------------------------------------ */
export const mantineComponent: MCPTool = {
    name: "mantine_component",
    title: "Get Mantine LLM reference",
    description: "Get Mantine LLM reference",
    inputSchema: undefined,
    handler: async () => {
        const res = await fetch("https://mantine.dev/llms.txt")
        const text = await res.text()
        return {
            content: [{ type: "text", text }],
        }
    },
}

export const referenceTools: MCPTool[] = [mantineComponent]