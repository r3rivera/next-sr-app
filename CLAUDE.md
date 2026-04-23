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
| Auth | next-auth 5 beta (`next-auth@5.0.0-beta`) — installed, **not yet configured** (no `auth.ts` or `middleware.ts`) |
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

Two route groups control access levels: `(admin)` for admin users and `(users)` for regular users.

```
app/
  page.tsx                                    # Root landing page
  layout.tsx                                  # Root layout (Inter font, global CSS)
  main/page.tsx                               # /main route
  (admin)/dashboard/page.tsx                  # /dashboard
  (admin)/dashboard/manage-rules/page.tsx     # /dashboard/manage-rules
  (admin)/dashboard/manage-users/page.tsx     # /dashboard/manage-users
  (admin)/dashboard/manage-contacts/page.tsx  # /dashboard/manage-contacts
  (users)/panel/page.tsx                      # /panel (regular user dashboard)
  seed/route.ts                               # GET /seed — DB seeding API route
  query/route.ts                              # GET /query — DB query API route
```

### Data Layer (`app/lib/`)

- `definitions.ts` — All TypeScript types (`User`, `Customer`, `Invoice`, `Revenue`, etc.)
- `data.ts` — All DB queries using tagged template SQL via `postgres` package. Amounts stored in cents; `fetchInvoiceById` divides by 100 on read, all other queries call `formatCurrency()` in a `.map()` step.
- `utils.ts` — Shared utilities (includes `cn()` helper for merging Tailwind classes)
- `placeholder-data.ts` — Seed data

### UI Layer (`app/ui/`)

- `components/buttons/` — `PrimaryBtn`, `SecondaryBtn` (accept `className` + all button HTML attrs via `buttonProps.ts`)
- `components/navigation/` — `Header` and `Banner` components (both exported from `header.tsx`; `Banner` is the landing-page hero section)
- `images/app-logo.tsx` — `AcmeLogo` SVG component
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

- **Primary Color:** `#FFE866` → `yellow-300` in Tailwind (the yellow scale is redefined in `global.css` — `yellow-300` is the brand primary, **not** `yellow-500`)
- **Secondary Color:** `#241E00`
- **CTA / Accent Color:** `#96151D` (dark red) — used for action buttons (e.g., "Get Started", "Browse Listings")
- **Font:** Inter (`app/ui/fonts.ts`)
- Do **not** use inline styles or plain CSS — use Tailwind classes only
- Props interface must be defined above the component
- `@tailwindcss/forms` plugin is active (imported in `global.css`)

### Custom Color Palettes (defined in `global.css` `@theme`)

All custom scales are available as standard Tailwind utilities (e.g. `bg-light-gold-300`, `text-tangerine-dream-500`).

**Yellow** (redefined Tailwind scale):

| Token | Hex |
|---|---|
| `yellow-050` | `#FFFBE5` |
| `yellow-100` | `#FFF7CC` |
| `yellow-200` | `#FFF099` |
| `yellow-300` | `#FFE866` ← **primary brand color** |
| `yellow-400` | `#FFE033` |
| `yellow-500` | `#FFD900` |
| `yellow-600` | `#CCAD00` |
| `yellow-700` | `#998200` |
| `yellow-800` | `#665700` |
| `yellow-900` | `#332B00` |

**Additional brand palettes** (50–950 each): `light-gold`, `vanilla-custard`, `tangerine-dream`, `light-blue`

- `light-gold-950` (`#241E00`) is the secondary brand color
- Full token values in `app/ui/global.css`

### Custom Tailwind Utilities

- `grid-cols-13` — 13-column grid layout (`--grid-template-columns-13`)
- `animate-shimmer` — loading shimmer animation used in skeleton screens (`skeletons.tsx`)

### Button Colors

`PrimaryBtn` defaults to `yellow-500`. CTA buttons (e.g. "Get Started", "Browse Listings") override with `className="bg-[#96151D] hover:bg-[#7a1118] ..."` at the call site — there is no separate CTA button component.

## Project Skills

```
.claude/skills/frontend-design/SKILL.md      # UI style guide and component patterns
.claude/skills/project-structure/SKILL.md    # Folder structure and naming conventions
```
