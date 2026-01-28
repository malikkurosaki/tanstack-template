# Agent Guidelines

## Development Commands

```bash
# Development
pnpm dev                  # Start dev server on port 3000
pnpm build               # Build for production
pnpm preview             # Preview production build

# Code Quality
pnpm lint                 # Run Biome linter
pnpm format               # Format code with Biome
pnpm check                # Run both lint and format checks

# Testing
pnpm test                 # Run all tests with Vitest
pnpm test <pattern>       # Run tests matching pattern (e.g., pnpm test User)

# Database
pnpm db:generate          # Generate Prisma client
pnpm db:push              # Push schema changes to database
pnpm db:migrate           # Run database migrations
pnpm db:studio            # Open Prisma Studio
pnpm db:seed              # Seed database
```

## Tech Stack

- **Frontend**: React 19, TypeScript, TanStack Router, TanStack Query
- **UI**: Mantine v8, Tailwind CSS v4
- **Backend**: Elysia (via Nitro), Prisma ORM, PostgreSQL
- **Auth**: Better Auth with email/password and GitHub OAuth
- **State**: Valtio, TanStack Query
- **Build**: Vite, Bun
- **Testing**: Vitest, Testing Library
- **Lint/Format**: Biome 2.2.4

## Code Style Guidelines

### Formatting (Biome)
- Use **tabs** for indentation (not spaces)
- Use **double quotes** for strings
- Import organization is automatic (enabled via Biome)
- Run `pnpm format` before committing

### TypeScript
- Strict mode enabled (`strict: true`)
- No unused locals or parameters (`noUnusedLocals`, `noUnusedParameters`)
- Use explicit types for function parameters and returns
- Use `@/*` path alias for imports from src (e.g., `import { auth } from "@/lib/auth"`)

### File Structure
- **Routes**: File-based routing in `src/routes/`. Export `Route` from `createFileRoute()`
- **Components**: Default export functions in `src/components/`
- **Lib**: Utilities and services in `src/lib/`
- **API**: Elysia routes in `src/routes/api/`

### Component Patterns
```tsx
// Components use default export
export default function MyComponent() {
  return <div>Content</div>
}

// Routes export Route constant
export const Route = createFileRoute("/path")({
  component: MyComponent,
  loader: async () => { /* data fetching */ }
});
```

### Imports
- Group imports: third-party, internal, relative
- Biome auto-organizes imports on format
- Use destructured imports from `@tanstack/react-router`: `Link`, `createFileRoute`, `useNavigate`

### Styling
- Tailwind utility classes for layout and spacing
- Mantine components for complex UI (Card, Button, etc.)
- Use `cn()` utility from `@/lib/utils` for conditional classes (combines clsx + tailwind-merge)
- For dark mode, Mantine's color scheme is managed in `__root.tsx`

### Database (Prisma)
- Schema: `prisma/schema.prisma`
- Generated client: `src/generated/prisma/`
- Import prisma client: `import { prisma } from "@/db"`
- Always run `pnpm db:generate` after schema changes

### Authentication
- Auth config: `src/lib/auth.ts` (Better Auth instance server only don't use it client side)
- Auth client: `src/lib/auth-client.ts` (Better Auth instance client only don't use it server side)
- Middleware: Use `authMiddleware` from `src/middleware/auth.ts` for protected routes
- Get session in middleware: `await auth.api.getSession({ headers })`
- Redirect unauthenticated: `throw redirect({ to: "/login", replace: true })`

### API Integration
- API client: `src/lib/api-client.ts` (Elysia treaty)
- Type-safe API calls: `api.resource.method()`
- Server functions: Elysia routes in `src/routes/api/`

### Error Handling
- Use try/catch for async operations
- Use biome-ignore comments with explanations for intentional rule violations
- For auth errors, use `throw redirect()` to route to login

### Testing
- Tests use Vitest with jsdom environment
- No existing test files - create `.test.ts` or `.test.tsx` files
- Run single test: `pnpm test <test-name>`

### Environment Variables
- Managed via `@t3-oss/env-core` with Zod validation
- Config: `src/env.ts`
- Server vars: accessed via `env.VAR_NAME`
- Client vars: must have `VITE_` prefix
- Use `.env` file (not `.env.local` - uses dotenv-cli for db commands)

## Key Files to Reference

- `biome.json`: Linting/formatting configuration
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite plugins and aliases
- `src/db.ts`: Prisma client export
- `src/env.ts`: Environment variable schema
- `src/routes/__root.tsx`: Root layout and document structure
