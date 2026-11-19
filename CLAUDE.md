# Project Context

Automated Assignment Task Generation System (AATGS) is a SvelteKit 3 project integrated with Gemini AI to turn assignment docs into step-by-step, actionable, todo-like tasklists that students can follow to complete their assignment.

This project is **local only** and will **not be deployed**. Do not use paid services for storage, database, etc.

## Stack

SvelteKit 3 (Svelte 5 runes, remote functions) · TypeScript · Tailwind CSS 4 · Drizzle ORM + SQLite (better-sqlite3) · Better Auth · vite+ · pnpm

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
├ tests/             # tests file lives here
├ drizzle.config.ts
└ vite.config.ts     # SvelteKit config lives here (no svelte.config.js)
```

## Workflow Rules

- Brainstorm by default; write code only when asked.
- Minimal changes, no scope creep.
- Explain what changed and why.
- Light checks only. Tests when i ask to validate; list test scenarios before moving on.
- User verifies and reports bugs. Fix only the reported bug, no broad audits.
- Track features in `ROADMAP.md`: tick an item when it ships, add new items under their area.

## Conventions

- Import lib code with the `#lib/*` alias.
- Declare new env vars in `src/env.ts`; server code reads them from `$app/env/private`.
- Generated auth tables: run `pnpm auth:schema`, don't hand-edit `db/auth.schema.ts`.

## Commands

- `pnpm dev` — dev server
- `pnpm check` — type-check
- `pnpm lint` / `pnpm format`
- `pnpm db:push` — sync schema to local SQLite

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
