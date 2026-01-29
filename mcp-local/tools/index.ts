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
import { communicationTools } from "./communication"
import { fileTools } from "./file"
import { gitTools } from "./git"
import { prismaTools } from "./prisma"
import { referenceTools } from "./reference"

export const allTools = [
    ...gitTools,
    ...prismaTools,
    ...fileTools,
    ...communicationTools,
    ...referenceTools,
]