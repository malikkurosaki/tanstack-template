---
name: integration-tanstack-elysiajs
description: Skill for integrasi ElysiaJS dengan Tanstack Start.
---

# SKILL.md – Integrasi ElysiaJS dengan Tanstack Start

## 🧠 Skill

**Integrate ElysiaJS backend into Tanstack Start routes**
Mampu menjalankan server Elysia di dalam sistem routing Tanstack Start untuk membuat API backend yang terhubung langsung dengan aplikasi TanStack Start.

---

## 🎯 Tujuan

* Menjalankan server **ElysiaJS** di dalam server routes **Tanstack Start**.
* Membuat endpoint API yang bisa diakses dari client Tanstack Start.
* Mendukung pemanggilan API dengan type-safe melalui **Eden Treaty**.
* Mengintegrasikan data fetching dengan **Loader** dan **React Query**.

---

## 📦 Prasyarat

Sebelum mulai, pastikan proyek Tanstack Start sudah berjalan dan dependencies berikut terinstal:

* `elysia`
* `@tanstack/react-router`
* `@tanstack/react-start`
* (Opsional) `@elysiajs/eden`, dll. jika membutuhkan type safety & fitur lanjutan.([ElysiaJS][1])

---

## 🧱 Dasar Integrasi

### 1) Struktur File

Buat file API route:

```
src/routes/api.$.ts
```

---

## 🛠️ Cara Mengintegrasikan

### ✨ 1. Define Elysia Server di Route Handler

```ts
import { Elysia } from 'elysia'
import { createFileRoute } from '@tanstack/react-router'
import { createIsomorphicFn } from '@tanstack/react-start'

const app = new Elysia({
	prefix: '/api'
})
.get('/', 'Hello Elysia!')

const handle = ({ request }: { request: Request }) => app.fetch(request)

export const Route = createFileRoute('/api/$')({
	server: {
		handlers: {
			GET: handle,
			POST: handle
		}
	}
})
```

👉 Elysia kini berjalan pada route `/api` dalam Tanstack Start server.
Tambahkan method HTTP lain sesuai kebutuhan.([ElysiaJS][1])

---

## 🧩 Fitur Lanjutan

### 💡 2. End-to-End Type Safety dengan Eden

```ts
import { treaty } from '@elysiajs/eden'

export const getTreaty = createIsomorphicFn()
	.server(() => treaty(app).api)
	.client(() => treaty<typeof app>('localhost:3000').api)
```

* `.server()` → panggilan server langsung tanpa HTTP overhead.
* `.client()` → panggilan melalui HTTP ke Elysia server.
* Bisa dipakai di komponen React untuk type-safe API calls.([ElysiaJS][1])

---

## 🚀 Data Fetching di Frontend

### 🧩 3. Tanstack Start Loader

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { getTreaty } from './api.$'

export const Route = createFileRoute('/a')({
	component: App,
	loader: () => getTreaty().get().then((res) => res.data)
})

function App() {
	const data = Route.useLoaderData()
	return data
}
```

* Loader fetch akan dieksekusi saat SSR dan tanpa HTTP overhead.
* Menjamin type safety dan performa optimal.([ElysiaJS][1])

---

### 📈 4. React Query

```tsx
import { useQuery } from '@tanstack/react-query'
import { getTreaty } from './api.$'

function App() {
	const { data: response } = useQuery({
		queryKey: ['get'],
		queryFn: () => getTreaty().get()
	})

	return response?.data
}
```

* Gunakan `React Query` untuk caching, pagination, dan fitur query lain.([ElysiaJS][1])

---

## 🧠 Ringkasan Skill

| Skill             | Deskripsi                                                                |
| ----------------- | ------------------------------------------------------------------------ |
| 📍 Elysia Handler | Menyusun handler Elysia untuk diletakkan di Tanstack Start server routes |
| 📦 Type-safe API  | Integrasi Eden Treaty untuk type-safe client/server calls                |
| 🔄 Data Fetch     | Optimasi data fetching dengan Loader Tanstack Start                      |
| 📊 React Query    | Integrasi API calls ke frontend via React Query                          |
