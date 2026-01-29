# TanStack App

A full-stack application built with TanStack ecosystem and modern web technologies.

## Tech Stack

- **Frontend**: React 19, TypeScript, TanStack Router, TanStack Query
- **UI**: Mantine v8, Tailwind CSS v4
- **Backend**: Elysia (via Nitro), Prisma ORM, PostgreSQL
- **Auth**: Better Auth with email/password and GitHub OAuth
- **State**: Valtio, TanStack Query
- **Build**: Vite, Bun
- **Testing**: Vitest, Testing Library
- **Lint/Format**: Biome 2.2.4

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

```bash
pnpm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Better Auth secret key
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` - GitHub OAuth credentials (optional)

### Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Run migrations (for production)
pnpm db:migrate

# Seed database (if seed script exists)
pnpm db:seed

# Open Prisma Studio (database GUI)
pnpm db:studio
```

### Development

Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Building For Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## Project Structure

```
src/
├── components/          # Reusable React components
├── env.ts              # Environment variable schema (T3Env)
├── lib/
│   ├── api-client.ts   # Elysia treaty client
│   ├── auth.ts         # Better Auth server instance
│   ├── auth-client.ts  # Better Auth client instance
│   ├── session-cache.ts # Session caching utilities
│   └── utils.ts        # Utility functions
├── middleware/
│   ├── api.tsx         # API route middleware
│   └── auth.ts         # Authentication middleware
├── integrations/
│   └── tanstack-query/ # TanStack Query setup
├── routes/
│   ├── __root.tsx      # Root layout
│   ├── index.tsx       # Home page
│   ├── auth/           # Auth pages (signin, signup)
│   ├── dashboard/      # Protected dashboard routes
│   ├── profile/        # User profile
│   └── api/            # API routes (Elysia)
└── db.ts               # Prisma client export
prisma/
├── schema.prisma       # Database schema
└── seed.ts             # Database seeding script
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing.

### Adding A Route

Add a new file in the `./src/routes` directory:

```tsx
// src/routes/about.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return <div>About page</div>;
}
```

### Using Links

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/dashboard">Dashboard</Link>
```

### Protected Routes

Use the auth middleware to protect routes:

```tsx
// src/routes/dashboard/route.tsx
import { authMiddleware } from "@/middleware/auth";
import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    const session = await authMiddleware({
      headers: new Headers(),
    });

    if (!session) {
      throw redirect({
        to: "/login",
        replace: true,
      });
    }

    return { user: session.user };
  },
  component: Dashboard,
});
```

## API Routes

API routes are built with [Elysia](https://elysia.dev/) and located in `src/routes/api/`.

### Example API Route

```ts
// src/routes/api/users.ts
import { Elysia, t } from "elysia";
import { prisma } from "@/db";

export const usersRoute = new Elysia()
  .get("/api/users", async () => {
    return prisma.user.findMany();
  })
  .get("/api/users/:id", async ({ params }) => {
    return prisma.user.findUnique({
      where: { id: params.id },
    });
  });
```

## Data Fetching

### TanStack Router Loaders

```tsx
export const Route = createFileRoute("/users")({
  loader: async () => {
    const response = await fetch("/api/users");
    return response.json();
  },
  component: Users,
});

function Users() {
  const users = Route.useLoaderData();
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### TanStack Query

```tsx
import { useQuery } from "@tanstack/react-query";

function UsersList() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then((res) => res.json()),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## Authentication

Authentication is handled by [Better Auth](https://better-auth.com/).

### Server Side

```ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Get current session
const session = await auth.api.getSession({
  headers: await headers(),
});
```

### Client Side

```ts
import { signIn, signOut, useSession } from "@/lib/auth-client";

// Sign in
await signIn.email({
  email: "user@example.com",
  password: "password",
});

// Sign out
await signOut();

// Get session (React hook)
const { data: session } = useSession();
```

## State Management

- **TanStack Query**: Server state and caching
- **Valtio**: Client-side proxy-based state

## Styling

- **Tailwind CSS v4**: Utility-first CSS
- **Mantine v8**: UI components (Card, Button, Modal, etc.)

Use the `cn()` utility for conditional classes:

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class")}>
  Content
</div>;
```

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting.

```bash
# Run linter
pnpm lint

# Format code
pnpm format

# Run both checks
pnpm check
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing.

```bash
# Run all tests
pnpm test

# Run specific test
pnpm test <pattern>
```

## Database Schema

The Prisma schema is located at `prisma/schema.prisma`. Key models:

- `User` - User accounts
- `Session` - Auth sessions
- `Account` - OAuth accounts
- `Verification` - Email verification tokens

After modifying the schema, run:

```bash
pnpm db:generate
pnpm db:push
```

## Learn More

- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Better Auth](https://better-auth.com/)
- [Elysia](https://elysia.dev/)
- [Prisma](https://prisma.io/)
- [Mantine](https://mantine.dev/)
- [Biome](https://biomejs.dev/)
