import type { AnySchema, ZodRawShapeCompat } from "./node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-compat.js"

export interface MCPToolContent {
    type: "text"
    text: string
    annotations?: {
        audience?: ("user" | "assistant")[]
        priority?: number
        lastModified?: string
    }
}

export interface MCPToolResponse {
    content: MCPToolContent[]
    _meta?: Record<string, unknown>
    structuredContent?: Record<string, unknown>
    isError?: boolean
}

export interface MCPTool {
    name: string
    title: string
    description: string
    inputSchema?: undefined | ZodRawShapeCompat | AnySchema
    handler: (...args: unknown[]) => Promise<MCPToolResponse>
}

export type { AnySchema, ZodRawShapeCompat }