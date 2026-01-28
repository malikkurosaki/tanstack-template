# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Manager
This project uses `pnpm` for package management (note: package.json scripts use `pnpm`, not `npm` or `bun`).

### Core Commands
```bash
pnpm dev              # Start development server on port 3000
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm test             # Run tests with Vitest
```

### Code Quality
```bash
pnpm format           # Format code with Biome
pnpm lint             # Lint code with Biome
pnpm check            # Run both format and lint checks
```

### Database Operations
All database commands require `.env.local` file with DATABASE_URL:

```bash
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes to database
pnpm db:migrate       # Create and run migrations
pnpm db:studio        # Open Prisma Studio GUI
pnpm db:seed          # Seed database with initial data
```

## Architecture Overview

### Stack
- **Framework**: TanStack Start (React SSR framework built on TanStack Router)
- **Routing**: TanStack Router with file-based routing
- **Backend**: Elysia (Bun-based web framework) for API routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: better-auth with email/password and GitHub OAuth
- **State Management**: TanStack Query for server state, Valtio for client state
- **UI**: Mantine v8 components + Tailwind CSS v4
- **Styling**: Tailwind CSS with Mantine component library
- **Code Quality**: Biome for linting and formatting (tabs, double quotes)

### Key Architectural Patterns

#### 1. Hybrid Routing System
- **Frontend routes**: File-based in `src/routes/` (TanStack Router)
- **API routes**: Located in `src/routes/api/` using Elysia
- The special `src/routes/api/$.ts` file acts as the API entry point, handling all HTTP methods and mounting Elysia app

#### 2. API Layer Architecture
```
src/routes/api/
├── $.ts                 # Main API entry point (Elysia app)
└── _lib/               # API route modules
    ├── users.api.ts    # User endpoints
    └── apikey.api.ts   # API key endpoints
```

- Elysia handles API routing with type-safe endpoints
- Eden Treaty (`@elysiajs/eden`) provides end-to-end type safety between client and server
- Client imports API types via: `import type { AppApi } from "@/routes/api/$"`
- API client setup in `src/lib/api-client.ts` uses treaty for type-safe calls

#### 3. Authentication Flow
- **Library**: better-auth with Prisma adapter
- **Strategies**: Email/password + GitHub OAuth + Bearer token (for API access)
- **Server-side auth**: `src/lib/auth.ts` configures better-auth instance
- **Client-side auth**: `src/lib/auth-client.ts` provides auth helpers
- **Middleware**:
  - `src/middleware/auth.ts` - Route-level auth (redirects unauthorized users)
  - `src/middleware/api.tsx` - API-level auth (validates session/JWT tokens)
- **Protected routes**: Use `authMiddleware` for server-side protection (see dashboard and profile routes)

#### 4. Database Layer
- **ORM**: Prisma with PostgreSQL adapter (`@prisma/adapter-pg`)
- **Schema**: `prisma/schema.prisma`
- **Generated client**: Output to `src/generated/prisma/` (not the default location)
- **Connection**: Singleton pattern in `src/db.ts` to prevent connection leaks
- **Models**: User (with roles), Session, Account, ApiKey, Verification, Todo

#### 5. Type-Safe Environment Variables
- **Library**: T3 Env (`@t3-oss/env-core`)
- **Configuration**: `src/env.ts`
- **Server vars**: DATABASE_URL, JWT_SECRET, BETTER_AUTH_SECRET, GITHUB_CLIENT_ID/SECRET
- **Client vars**: Must be prefixed with `VITE_` (e.g., VITE_BASE_URL, VITE_APP_TITLE)
- Import using: `import { env } from "@/env"`

#### 6. Path Aliases
- `@/*` maps to `src/*` (configured in tsconfig.json and vite.config.ts)
- Use `@/` imports consistently throughout the codebase

#### 7. SSR with TanStack Query Integration
- `src/router.tsx` sets up router with SSR query integration via `setupRouterSsrQueryIntegration`
- Query client context shared between router and React Query
- Query provider in `src/integrations/tanstack-query/root-provider.tsx`

## Project Structure

```
src/
├── routes/               # File-based routing
│   ├── __root.tsx       # Root layout with Mantine provider
│   ├── index.tsx        # Home page
│   ├── api/             # Elysia API routes
│   │   ├── $.ts         # API entry point
│   │   └── _lib/        # API modules (Elysia routers)
│   ├── auth/            # Auth-related pages
│   ├── dashboard/       # Admin dashboard (requires ADMIN role)
│   └── profile/         # User profile (requires auth)
├── lib/                 # Shared utilities
│   ├── auth.ts          # Better-auth server config
│   ├── auth-client.ts   # Better-auth client helpers
│   ├── api-client.ts    # Eden Treaty client setup
│   └── session-cache.ts # Session caching utilities
├── middleware/          # Route and API middleware
│   ├── auth.ts          # TanStack Router auth middleware
│   └── api.tsx          # Elysia API auth middleware
├── components/          # React components
├── integrations/        # Third-party integrations
│   └── tanstack-query/  # React Query setup
├── generated/           # Generated code (Prisma client)
├── db.ts               # Prisma client singleton
├── env.ts              # Type-safe environment variables
└── router.tsx          # Router configuration

prisma/
├── schema.prisma       # Database schema
└── seed.ts            # Database seeding script
```

## Important Implementation Notes

### Prisma Client Location
The Prisma client is generated to `src/generated/prisma/` instead of `node_modules/.prisma/client`. Always import from:
```typescript
import { prisma } from "@/db";
import { User } from "@/generated/prisma/client";
```

### API Development Pattern
1. Create new API routes in `src/routes/api/_lib/` as Elysia instances
2. Mount them in `src/routes/api/$.ts` using `.use(YourApi)`
3. Apply authentication with `apiMiddleware` for protected endpoints
4. Use `prisma` for database operations
5. Client-side access via `api` from `@/lib/api-client`

### Authentication Patterns
- **Session-based**: Used for web app routes (cookie-based via better-auth)
- **Token-based**: Used for API access (Bearer tokens or custom `x-token` header)
- **Role-based access**: UserRole enum (ADMIN, USER) enforced in middleware
- Always validate user role for admin routes

### Styling Guidelines
- Mantine components for UI elements (already configured with dark mode by default)
- Tailwind utilities for custom styling
- Biome formatting rules: tabs for indentation, double quotes for strings
- Generated files (`routeTree.gen.ts`, `styles.css`) are excluded from Biome checks

### Route Protection
Protected routes should use the `authMiddleware`:
```typescript
export const Route = createFileRoute('/protected-route')({
  server: {
    middleware: [authMiddleware]
  }
})
```

### Testing
- Framework: Vitest with jsdom
- Testing library: @testing-library/react
- Run single test: `pnpm test <test-file-pattern>`

## Environment Setup

Required environment variables in `.env.local`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-jwt-secret
BETTER_AUTH_SECRET=your-better-auth-secret
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
VITE_BASE_URL=http://localhost:3000
PORT=3000
```

## Development Workflow

1. Set up environment variables in `.env.local`
2. Generate Prisma client: `pnpm db:generate`
3. Push database schema: `pnpm db:push` (or create migration with `pnpm db:migrate`)
4. Optionally seed database: `pnpm db:seed`
5. Start dev server: `pnpm dev`
6. Access API docs (dev only): http://localhost:3000/api/docs

## Code Quality Standards

- Use Biome for all formatting and linting
- Path imports should use `@/` alias
- All new database operations should use the `prisma` singleton from `@/db`
- Keep API routes modular in `_lib` subdirectory
- Maintain type safety with TypeScript strict mode
