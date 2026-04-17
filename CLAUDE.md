# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

---

# Real Estate Property Management Dashboard

## Tech Stack

| Layer | Package / Version |
|---|---|
| Framework | Next.js (latest) — App Router |
| Language | TypeScript 5.7 (strict mode) |
| Styling | Tailwind CSS 4.2 via `@tailwindcss/postcss` (no `tailwind.config.ts`) |
| UI Components | shadcn/ui (planned — not yet installed) |
| Auth | next-auth 5 beta (`next-auth@5.0.0-beta`) |
| Database | PostgreSQL via `postgres` package (raw SQL, no ORM) |
| Validation | Zod |
| Icons | @heroicons/react |
| Search debounce | `use-debounce` |
| Password hashing | `bcrypt` |
| Package Manager | pnpm |

**Planned (not yet installed):** shadcn/ui, AWS Amplify, AWS Cognito, Zustand, Axios, React Query.

## Path Alias

`@/*` resolves to the **project root** (not `./src/*`). Imports look like:
```ts
import { cn } from '@/app/lib/utils';
```

## Development Commands

```bash
pnpm dev        # Start dev server (Turbopack)
pnpm build      # Production build
pnpm start      # Start production server
pnpm tsc --noEmit  # Type-check (no lint script configured)
```

**Seed the database** (requires `POSTGRES_URL` env var):
```
GET /seed       # Calls app/seed/route.ts — creates tables and inserts placeholder data
```

## Environment Variables

```
POSTGRES_URL    # PostgreSQL connection string (ssl: require)
```

## Architecture

### Route Structure

```
app/
  page.tsx                          # Root landing page
  layout.tsx                        # Root layout (Inter font, global CSS)
  main/page.tsx                     # /main route
  (admin)/dashboard/page.tsx        # /dashboard (admin route group)
  (admin)/dashboard/manage-rules/   # /dashboard/manage-rules
  seed/route.ts                     # GET /seed — DB seeding API route
  query/route.ts                    # GET /query — DB query API route
```

### Data Layer (`app/lib/`)

- `definitions.ts` — All TypeScript types (`User`, `Customer`, `Invoice`, `Revenue`, etc.)
- `data.ts` — All DB queries using tagged template SQL via `postgres` package. Amounts stored in cents; `fetchInvoiceById` divides by 100 on read, all other queries call `formatCurrency()` in a `.map()` step.
- `utils.ts` — Shared utilities (includes `cn()` helper for merging Tailwind classes)
- `placeholder-data.ts` — Seed data

### UI Layer (`app/ui/`)

- `components/` — Shared, reusable components (buttons, navigation)
- `invoices/`, `dashboard/`, `customers/` — Feature-specific components
- `skeletons.tsx` — Suspense skeleton screens for streaming

### Component Conventions

Components use the `cn()` utility from `@/app/lib/utils` (wraps `clsx` + `tailwind-merge`) for conditional class merging:

```tsx
import { cn } from '@/app/lib/utils';

interface MyProps {
  className?: string;
}

export function MyComponent({ className }: MyProps) {
  return <div className={cn('base-classes', className)} />;
}
```

## File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Component | PascalCase | `UserCard.tsx` |
| Hook | camelCase `use` prefix | `useUserData.ts` |
| Service | camelCase `.service` suffix | `user.service.ts` |
| Store | camelCase `.store` suffix | `user.store.ts` |
| Types | camelCase `.types` suffix | `user.types.ts` |
| Utility | camelCase | `formatDate.ts` |
| Page | lowercase (Next.js) | `page.tsx` |

## UI / Branding

- **Primary Color:** `#96151D`
- **Secondary Color:** `#000000`
- **Font:** Inter (`app/ui/fonts.ts`)
- Do **not** use inline styles or plain CSS — use Tailwind classes only
- Props interface must be defined above the component

## Project Skills

```
.claude/skills/frontend-design/SKILL.md      # UI style guide and component patterns
.claude/skills/project-structure/SKILL.md    # Folder structure and naming conventions
```
