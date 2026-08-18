<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Agent Guide

## Overview

This repository is a Next.js 16 application using the App Router, React 19, TypeScript, Tailwind CSS v4, and a feature-sliced design (FSD) structure. The app is a book catalogue with CRUD-style book management, Supabase-backed data access, and Cloudflare/OpenNext deployment support.

## Tech stack

- Runtime and framework: Next.js 16, React 19, TypeScript (strict mode)
- Styling: Tailwind CSS v4 with shadcn-style UI primitives and `lucide-react`
- Forms and validation: `react-hook-form` + `zod` + `@hookform/resolvers`
- Data and auth integration: Supabase SSR and client SDKs
- Deployment: Cloudflare via `@opennextjs/cloudflare` and Wrangler
- Quality tooling: ESLint, Prettier, TypeScript

## Project scripts

Use these commands when changing or validating code:

- `npm run dev` — start the local dev server
- `npm run lint` — run ESLint
- `npm run build` — build the Next.js app
- `npm run format` — format the codebase with Prettier

## Architecture and folder conventions

This project follows Feature-Sliced Design (FSD) principles. Keep the dependency flow layered and predictable:

- `app/` — Next.js App Router entrypoints, route handlers, layout, global styles, and page-level composition
- `src/app/` — reserved for app-level composition if needed; avoid putting feature logic here
- `src/entities/` — business entities and their core model/schema/API logic
  - Example: `src/entities/book/`
  - Keep entity contracts, validation schemas, and entity-specific helpers here
- `src/features/` — user-facing slices with concrete functionality
  - Example: `src/features/add-book/`, `src/features/book-filters/`, `src/features/book-grid/`
  - Each feature should contain its own `api/`, `model/`, `ui/`, and `index.ts` structure when appropriate
- `src/views/` — page-level or screen-level compositions built from entities and features
  - Example: `src/views/books-user-view/`
- `src/widgets/` — larger composite UI blocks when they span multiple features or entities
- `src/shared/` — reusable, cross-cutting code that is not tied to a specific business feature
  - `src/shared/components/` — UI primitives and shared components
  - `src/shared/lib/` — utility functions, helpers, and guards
  - `src/shared/configs/` — environment/configuration helpers
  - `src/shared/types/` — shared TypeScript types

## FSD rules to follow

- Keep imports moving from lower layers to higher layers: `shared -> entities -> features -> views -> app`
- Do not put feature-specific logic into `src/shared/` unless it is genuinely reusable across multiple features
- Prefer colocating related code near the feature or entity it belongs to
- Keep route handlers and server-only logic in the appropriate app or API layer; do not leak server concerns into UI components unless necessary
- Use public entrypoints like `index.ts` files to expose module boundaries cleanly

Refer to `.agents/skills/feature-sliced-design` for more info about the rules and conventions of FSD.

## Coding conventions

- Use TypeScript and preserve strict typing
- Prefer server components by default; add `'use client'` only when interactivity is required
- Use the `@/*` path alias for imports from the project root
- Reuse shared UI primitives from `src/shared/components` before creating new one-off components
- Preserve existing naming patterns and folder structure when extending the app
- Keep validation logic close to the entity or feature that owns it; Zod schemas are already used for book domain models
- Use `react-hook-form` for form state and validation where interactive forms are involved

## Data and API conventions

- API route handlers live under `app/api/`
- Business data access logic should live under entity or feature `api/` folders rather than directly in components
- Use the existing `src/shared/lib/guards/` and config helpers for environment access
- Prefer typed API results and explicit success/error handling patterns over ad-hoc branching

## When adding new features

1. Identify the correct FSD layer first
2. Add or update the relevant entity if the feature introduces a new domain concept
3. Place UI in `ui/`, state or hooks in `model/`, and data access in `api/`
4. Compose the feature from the view layer upward
5. Verify with `npm run lint` and `npm run build` when possible

## Important project-specific notes

- The project uses shadcn/ui components (installed as needed) and lives under `src/shared/components`. Use the shadcn components where possible. Only default to custom components, if no shadcn/ui components available.
- The current app already uses `sonner` for toasts, `zod` for validation, and `react-hook-form` for forms
- Cloudflare deployment is part of the workflow, so changes that affect build/runtime behavior should be tested with the relevant preview/deploy scripts
- Because this project uses a newer Next.js release, be cautious with framework conventions and consult the local Next.js docs when unsure

## Agent skills

### Issue tracker

Issues are tracked as markdown files under .scratch/. See docs/agents/issue-tracker.md.

### Triage labels

Uses the default triage labels: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See docs/agents/triage-labels.md.

### Domain docs

Single-context repo: root CONTEXT.md plus docs/adr/. See docs/agents/domain.md.
