// Git Tools
export * from "./git"

// Prisma Tools
export * from "./prisma"

// File Tools
export * from "./file"

// Communication Tools
export * from "./communication"

// Reference Tools
export * from "./reference"

// Export all tools as a combined array
import { gitTools } from "./git"
import { prismaTools } from "./prisma"
import { fileTools } from "./file"
import { communicationTools } from "./communication"
import { referenceTools } from "./reference"
import type { MCPTool } from "../types.js"

export const allTools = [
    ...gitTools,
    ...prismaTools,
    ...fileTools,
    ...communicationTools,
    ...referenceTools,
]