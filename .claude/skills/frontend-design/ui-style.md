# UI Style Guide

## Branding
- **Primary Color:** #96151D
- **Secondary Color:** #000000
- **Font Family:** `Inter`, fallback: `system-ui, sans-serif`
- **Font Sclae:** Use Tailwind's default type scale (ext-sm, text-base, text-lg, etc)

## Styling Framework
- **Framework:** Tailwind CSS v4
- **Component Library:** shadcn/ui
- Do NOT use inline style or plain CSS unless absolutely necessary


## React Component Style Rules
- Use function components with TypeScript
- Props interface defined above the component

### Example Pattern
```tsx
import { cn } from `@/app/lib/utils` 
```
