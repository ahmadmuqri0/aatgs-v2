# AATGS Roadmap

Tick an item when it ships; add new items under their area. Mark work underway with _(in progress)_.

## Auth

- [x] Register, login, logout
- [x] Session guard for app routes (`requireUser`)

## App shell

- [x] Sidebar layout with breadcrumbs and page titles
- [ ] Home page dashboard (upcoming due dates, in-progress assignments)
- [ ] Integrate event calendar

## Assignments

- [x] Create assignment dialog (title, due date, PDF drop zone)
- [x] Store uploaded brief; clean up the file if the DB insert fails
- [x] Assignments list sorted by due date, with status badges
- [x] Task progress bar on cards (green + "Completed" badge when done)
- [x] Live list updates via `query.live`
- [x] Assignment detail page (`assignments/[id]`)
- [ ] Edit assignment title / due date
- [ ] Delete assignment (and its uploaded file)
- [ ] View the original brief PDF

## Generation

- [x] Background task generation with Gemini (model via `GEMINI_MODEL`)
- [x] Structured output validated with zod; rejects non-assignment docs
- [x] Generation history with pending / completed / failed status
- [ ] Retry a failed generation (`retryGeneration`)
- [ ] Regenerate tasks (new generation becomes active)
- [ ] Handle Gemini 503 "high demand" (retry or fallback model)
- [ ] Recover generations stuck in `pending` after a server restart

## Tasks

- [x] Task list on the detail page
- [x] Check tasks off (`toggleTask`, must call `notifyAssignmentsChanged`)
- [x] Progress bar on the detail page

## Dev tooling

- [ ] Log outgoing requests (e.g. to Gemini)
- [ ] Fix existing formatting issues (`vp check --fix`)
- [ ] Tests for generation and remote functions
