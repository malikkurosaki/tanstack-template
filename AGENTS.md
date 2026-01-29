# Agent Guidelines

## Development Commands

```bash
# Development
bun dev                  # Start dev server on port 3000
bun build               # Build for production
bun preview             # Preview production build

# Code Quality
bun lint                 # Run Biome linter
bun format               # Format code with Biome
bun check                # Run both lint and format checks

# Testing
bun test                 # Run all tests with Vitest
bun test <pattern>       # Run tests matching pattern (e.g., bun test User)

# Database
bun db:generate          # Generate Prisma client
bun db:push              # Push schema changes to database
bun db:migrate           # Run database migrations
bun db:studio            # Open Prisma Studio
bun db:seed              # Seed database

# Backup & Recovery (Auto-commit System)
bash bin/backup.sh        # Manual backup before changes
bash .opencode/restore.sh # Restore project from previous commit
bash .opencode/logs.sh    # View backup history
git log --oneline -10     # View recent commits for restore
````

## Version Control & Development Lifecycle (WAJIB)

### Core Principle

**NO COMMIT = NO CHANGE**

Agent bertanggung jawab memastikan **tidak ada pekerjaan yang hilang, tertimpa, atau tidak dapat di-rollback**.

### Mandatory Lifecycle

Setiap tugas HARUS mengikuti lifecycle berikut secara berurutan:

1. Analyze perubahan yang diminta
2. Identifikasi file yang terdampak
3. Evaluasi tingkat risiko (low / medium / high)
4. Pastikan ada recovery point (git commit / backup)
5. Lakukan perubahan secara incremental
6. Pastikan perubahan dapat di-revert
7. Buat checkpoint setelah setiap logical step

### Strict Rules

* DILARANG memodifikasi file existing tanpa recovery point
* DILARANG overwrite atau delete code tanpa rollback path
* Perubahan besar HARUS dipecah menjadi beberapa commit kecil
* Jika commit / snapshot belum tersedia, **HENTIKAN dan notify_user**
* Jika ragu, gunakan pendekatan additive (buat file/branch baru)

### Safety Constraints

* Selalu asumsikan kode berada di production context
* Minimalkan blast radius perubahan
* Jangan melakukan refactor besar dalam satu langkah
* Prefer branch atau snapshot sebelum perubahan berisiko

### Required Self-Verification (Sebelum Lanjut)

Sebelum menulis atau mengubah kode, agent HARUS memastikan:

* Ada commit atau snapshot yang bisa dipulihkan
* Perubahan ini bisa di-revert dengan jelas
* Tidak ada data atau logika penting yang hilang

Jika salah satu poin di atas **tidak terpenuhi**, agent **TIDAK BOLEH MELANJUTKAN**.

---

## Tech Stack

* **Frontend**: React 19, TypeScript, TanStack Router, TanStack Query
* **UI**: Mantine v8, Tailwind CSS v4
* **Backend**: Elysia (via Nitro), Prisma ORM, PostgreSQL
* **Auth**: Better Auth with email/password and GitHub OAuth
* **State**: Valtio, TanStack Query
* **Build**: Vite, Bun
* **Testing**: Vitest, Testing Library
* **Lint/Format**: Biome 2.2.4

## Code Style Guidelines

### Formatting (Biome)

* Use **tabs** for indentation (not spaces)
* Use **double quotes** for strings
* Import organization is automatic (enabled via Biome)
* Run `bun format` before committing

### TypeScript

* Strict mode enabled (`strict: true`)
* No unused locals or parameters (`noUnusedLocals`, `noUnusedParameters`)
* Use explicit types for function parameters and returns
* Use `@/*` path alias for imports from src (e.g., `import { auth } from "@/lib/auth"`)

### File Structure

* **Routes**: File-based routing in `src/routes/`. Export `Route` from `createFileRoute()`
* **Components**: Default export functions in `src/components/`
* **Lib**: Utilities and services in `src/lib/`
* **API**: Elysia routes in `src/routes/api/`

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

* Group imports: third-party, internal, relative
* Biome auto-organizes imports on format
* Use destructured imports from `@tanstack/react-router`: `Link`, `createFileRoute`, `useNavigate`

### Styling

* Tailwind utility classes for layout and spacing
* Mantine components for complex UI (Card, Button, etc.)
* Use `cn()` utility from `@/lib/utils` for conditional classes (combines clsx + tailwind-merge)
* For dark mode, Mantine's color scheme is managed in `__root.tsx`

### Database (Prisma)

* Schema: `prisma/schema.prisma`
* Generated client: `src/generated/prisma/`
* Import prisma client: `import { prisma } from "@/db"`
* Always run `bun db:generate` after schema changes

### Authentication

* Auth config: `src/lib/auth.ts` (Better Auth instance server only don't use it client side)
* Auth client: `src/lib/auth-client.ts` (Better Auth instance client only don't use it server side)
* Middleware: Use `authMiddleware` from `src/middleware/auth.ts` for protected routes
* Get session in middleware: `await auth.api.getSession({ headers })`
* Redirect unauthenticated: `throw redirect({ to: "/login", replace: true })`

### API Integration

* API client: `src/lib/api-client.ts` (Elysia treaty)
* Type-safe API calls: `api.resource.method()`
* Server functions: Elysia routes in `src/routes/api/`

### Error Handling

* Use try/catch for async operations
* Use biome-ignore comments with explanations for intentional rule violations
* For auth errors, use `throw redirect()` to route to login

### Testing

* Tests use Vitest with jsdom environment
* No existing test files - create `.test.ts` or `.test.tsx` files
* Run single test: `bun test <test-name>`

### Environment Variables

* Managed via `@t3-oss/env-core` with Zod validation
* Config: `src/env.ts`
* Server vars: accessed via `env.VAR_NAME`
* Client vars: must have `VITE_` prefix
* Use `.env` file (not `.env.local` - uses dotenv-cli for db commands)

## Notification Protocol

### WAJIB: notify_user Setelah Tugas Selesai

Setiap kali agen menyelesaikan tugas, `notify_user` HARUS dipanggil untuk menginformasikan progres dan hasil kepada user.

#### Kapan Harus Memanggil notify_user

1. **Sebelum memulai**: Jika ada pertanyaan atau klarifikasi yang dibutuhkan
2. **Setelah membuat plan**: Presentasi plan dan minta approval
3. **Sebelum aksi berisiko**: Sebelum modify/delete file (setelah git_snapshot)
4. **Setelah step penting**: Setiap step selesai, update progres
5. **Setelah tugas selesai**: Ringkasan hasil dan langkah selanjutnya

#### Template Penggunaan

```javascript
// Sebelum membuat plan (jika ada pertanyaan)
if (adaClarification) {
  notify_user({ text: "Pertanyaan untuk user..." });
}

// Setelah membuat plan
notify_user({ text: "Plan telah dibuat:\n1. Langkah pertama\n2. Langkah kedua\n\nMohon approve untuk dilanjutkan." });
}

// Sebelum modify/delete file
notify_user({ text: "⚠️ Akan melakukan perubahan pada file X.\nSnapshot sudah dibuat.\nApakah ingin dilanjutkan?" });
}

// Setelah tugas selesai
notify_user({ text: "✅ Tugas selesai!\n\nRingkasan hasil:\n- Hasil 1\n- Hasil 2\n\nLangkah selanjutnya:" });
```

#### Checklist Sebelum Menutup Tugas

* [ ] notify_user sudah dipanggil dengan ringkasan hasil
* [ ] Langkah selanjutnya sudah dijelaskan (jika ada)
* [ ] Tidak ada file yang perlu di-backup/di-restore

---

## Key Files to Reference

* `biome.json`: Linting/formatting configuration
* `tsconfig.json`: TypeScript configuration
* `vite.config.ts`: Vite plugins and aliases
* `src/db.ts`: Prisma client export
* `src/env.ts`: Environment variable schema
* `src/routes/__root.tsx`: Root layout and document structure