import type { AnySchema, ZodRawShapeCompat } from "@modelcontextprotocol/sdk/dist/esm/server/zod-compat.js"
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/dist/esm/shared/protocol.js"
import type { ServerRequest, ServerNotification, CallToolResult } from "@modelcontextprotocol/sdk/dist/esm/types.js"

export interface MCPToolContent {
    type: "text"
    text: string
    annotations?: {
        audience?: ("user" | "assistant")[]
        priority?: number
        lastModified?: string
    }
    _meta?: Record<string, unknown>
}

export type MCPToolHandler = (
    args: unknown,
    extra: RequestHandlerExtra<ServerRequest, ServerNotification>
) => CallToolResult | Promise<CallToolResult>

export interface MCPTool {
    name: string
    title: string
    description: string
    inputSchema?: undefined | ZodRawShapeCompat | AnySchema
    handler: MCPToolHandler
}

export type { AnySchema, ZodRawShapeCompat }