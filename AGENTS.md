# Project Context

Automated Assignment Task Generation System (AATGS) is a SvelteKit 3 project integrated with Gemini AI to turn assignment docs into step-by-step, actionable, todo-like tasklists that students can follow to complete their assignment.

This project is **local only** and will **not be deployed**. Do not use paid services for storage, database, etc.

## Stack

SvelteKit 3 (Svelte 5 runes, remote functions) · TypeScript · Tailwind CSS 4 · Drizzle ORM + SQLite (better-sqlite3) · Better Auth · vitest · pnpm · devenv

## Project Structure

```bash
aatgs-svelte/
├ src/
│ ├ lib/
│ │ ├ server/        # server-only code (auth, db)
│ │ │ └ db/          # drizzle client + schemas
│ │ └ [shared lib]
│ ├ routes/          # pages, layouts, endpoints
│ ├ app.html
│ ├ env.ts           # env var declarations
│ └ hooks.server.ts
├ static/            # static assets
├ tests/             # vitest only here (*.svelte.test.ts → browser, *.test.ts → node)
├ devenv.nix         # dev shell (node, pnpm, LSPs)
├ drizzle.config.ts
└ vite.config.ts     # SvelteKit config lives here (no svelte.config.js)
```

## Workflow Rules

- Brainstorm by default; write code only when asked.
- Minimal changes, no scope creep.
- Explain what changed and why.
- Light checks only. No tests without permission; list test scenarios before moving on.
- User verifies and reports bugs. Fix only the reported bug, no broad audits.

## Conventions

- Work inside `devenv shell`; it loads `.env` and installs deps.
- Import lib code with the `#lib/*` alias.
- Declare new env vars in `src/env.ts`; server code reads them from `$app/env/private`.
- Generated auth tables: run `pnpm auth:schema`, don't hand-edit `db/auth.schema.ts`.

## Commands

- `pnpm dev` — dev server
- `pnpm check` — type-check
- `pnpm lint` / `pnpm format`
- `pnpm db:push` — sync schema to local SQLite
