# TanStack App - QWEN Context

## Project Overview

This is a modern full-stack web application built with the TanStack ecosystem. It's a workforce management platform that includes employee activity tracking, project management, task management, and internal social features. The application uses TanStack Router for routing, TanStack Query for data fetching, and TanStack Start for the React framework.

### Key Technologies & Architecture

- **Frontend Framework**: React 19 with TanStack Start (full-stack React framework)
- **Routing**: TanStack Router with file-based routing
- **State Management**: TanStack Query for server state, TanStack Store for client state
- **UI Components**: Mantine UI library with Tailwind CSS
- **Authentication**: Better Auth with GitHub OAuth and email/password
- **Database**: PostgreSQL with Prisma ORM
- **Backend API**: Elysia.js (Lightweight Bun-first web framework)
- **Environment Variables**: T3Env with Zod validation
- **Styling**: Tailwind CSS with Mantine components
- **Linting & Formatting**: Biome
- **Testing**: Vitest

### Project Structure

```
src/
├── components/           # Reusable UI components
├── generated/            # Generated Prisma types
├── integrations/         # Integration configurations (TanStack Query)
├── lib/                 # Core libraries and utilities
├── middleware/          # Authentication and routing middleware
├── routes/              # File-based routes for TanStack Router
│   ├── api/             # API routes
│   ├── auth/            # Authentication routes
│   ├── dashboard/       # Dashboard routes
│   ├── profile/         # Profile routes
│   ├── __root.tsx       # Root layout component
│   ├── $.tsx            # Catch-all route
│   └── index.tsx        # Home page
├── db.ts                # Database connection (Prisma)
├── env.ts               # Environment variable validation
├── logo.svg             # Logo asset
├── router.tsx           # Router configuration
├── routeTree.gen.ts     # Generated route tree (auto-generated)
└── styles.css           # Global styles
```

### Building and Running

#### Development
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

#### Production
```bash
# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

#### Database Operations
```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes to database
pnpm db:push

# Create and run migration
pnpm db:migrate

# Open Prisma Studio (database GUI)
pnpm db:studio

# Seed database
pnpm db:seed
```

#### Testing & Quality
```bash
# Run tests
pnpm test

# Format code
pnpm format

# Lint code
pnpm lint

# Run both lint and format checks
pnpm check
```

### Key Features

1. **Authentication System**:
   - Email/password authentication
   - GitHub OAuth integration
   - Session management with JWT
   - Role-based access control (RBAC)

2. **Routing & Middleware**:
   - File-based routing with TanStack Router
   - Authentication middleware for protected routes
   - Admin-only dashboard access

3. **Database Integration**:
   - PostgreSQL with Prisma ORM
   - User roles and permissions
   - Adapter pattern for database abstraction

4. **UI & Styling**:
   - Mantine UI components with dark/light themes
   - Responsive design with Tailwind CSS
   - Consistent design system

5. **API Layer**:
   - RESTful API endpoints
   - Server-side rendering capabilities
   - Data fetching with TanStack Query

### Development Conventions

- **Code Style**: Enforced with Biome (formatter, linter)
- **Naming**: PascalCase for React components, camelCase for functions/variables
- **File Structure**: Component files use `.tsx` extension, utility files use `.ts`
- **Imports**: Absolute imports using `@/*` alias for `src/*`
- **Environment Variables**: Prefixed with `VITE_` for client-side access
- **Type Safety**: Full TypeScript coverage with Zod validation for environment variables

### Important Configuration Files

- `vite.config.ts`: Vite build configuration with TanStack plugins
- `tsconfig.json`: TypeScript configuration with path aliases
- `biome.json`: Linting and formatting rules
- `prisma.config.ts`: Prisma database configuration
- `package.json`: Dependencies and scripts
- `src/env.ts`: Environment variable validation schema
- `src/lib/auth.ts`: Authentication configuration
- `src/middleware/auth.ts`: Authentication middleware

### Common Patterns

1. **Route Definition**: Uses `createFileRoute()` from TanStack Router
2. **Data Fetching**: Leverages TanStack Query with SSR integration
3. **Component Styling**: Combines Mantine components with Tailwind utility classes
4. **Authentication**: Better Auth with custom middleware for route protection
5. **Database Access**: Prisma ORM with adapter pattern for flexibility