# TourCraft

Artist / collective tour management platform. Skeleton frontend (mock data, no real backend yet) built on top of [Vuestic UI](https://ui.vuestic.dev/).

**Live preview locally:** `http://localhost:5173/dashboard` after `npm run dev`.

## Stack

- **Vue 3.5** + **Vite 5** + **TypeScript**
- **[Vuestic UI](https://ui.vuestic.dev/)** 1.10 + **Tailwind CSS** 3.4 + **SCSS**
- **Pinia** 2 (state) + **Vue Router** 4 (routing)
- **vue-i18n** 9 (locale wired, English-only for now)

## Quick start

Requires **Node 20** (see `.nvmrc`).

```bash
nvm use            # picks up .nvmrc
npm install
npm run dev        # http://localhost:5173/
```

## Project state

This is a **skeleton frontend** — every page renders mock data; there is no real backend, no auth, and no tests yet.

| Tag | What ships |
|---|---|
| `v0.1.0-skeleton` | Layout shell, IA sidebar, Tour Dashboard view fully built; 9 other sections render `<PagePlaceholder>` |
| `v0.2.0-screens` | 6 mocked pages added (Tour Dates, Shows, Travel, Contacts, Tasks, Documents/Settlements). `/itinerary` and `/notes` still placeholders pending designs. |

`/documents` and `/settlements` both render the same combined view (sidebar highlight differs per route — the IA semantics may collapse in a future spec).

## Where to look

- **Design specs:** `docs/superpowers/specs/`
- **Implementation plans:** `docs/superpowers/plans/`
- **Reference mocks:** `screens/01-dashboard.png` through `screens/07-documents.png`
- **Layout shell:** `src/layouts/AppLayout.vue` + `src/components/{sidebar,navbar}/`
- **Shared primitives:** `src/components/{PageHeader,PagePlaceholder,KpiTile,KpiRow,ShowSwitcher,Breadcrumb}.vue`
- **Per-section widgets:** `src/components/{tour-dates,shows,travel,contacts,tasks,documents}/`
- **Mock data fixtures:** `src/data/{tourDates,shows,travel,contacts,tasks,documents,dashboard}.ts`
- **Cross-cutting types/tokens/formatters:** `src/data/{types,severity,format}.ts`

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server (HMR) |
| `npm run build:ci` | Fast production build (no lint, no tsc) — for CI smoke checks |
| `npm run build` | Full production build (lint + `vue-tsc --noEmit` + Vite) |
| `npm run lint` | ESLint with auto-fix on `src/**/*.{ts,js,vue}` |
| `npm run format` | Prettier on the whole tree |
| `npm run preview` | Serve the built `dist/` |

A pre-commit hook (Husky + lint-staged) runs Prettier and ESLint on staged files automatically.

## Conventions

- **`<script setup lang="ts">`** SFCs throughout. No Options API in new code.
- **Per-section component folders** (`components/<section>/`) keep concerns scoped. **No cross-section component imports** — a Tasks widget never imports from `components/contacts/`. Shared UI lives at `components/` root.
- **Cross-cutting tokens / types / formatters** live in `src/data/` (`types.ts`, `severity.ts`, `format.ts`). Data files _may_ import each other (e.g., `shows.ts` reuses fixtures from `dashboard.ts`).
- **BEM-style scoped SCSS** class names — one block prefix per component (`.kpi-tile__head`, `.advance-row__pill`, etc.).
- **Material Symbols Outlined** icons — `mso-*` names in `<VaIcon>`. The font is loaded in `index.html`.
- **Page files contain orchestration only.** Each `pages/*.vue` imports `PageHeader` + section widgets and composes them. UI guts live in section folders.
- **Status / severity pills** use the token maps in `src/data/severity.ts` (`severityTokens` for High/Medium/Low; `statusTokens` for Confirmed/Pending/Approved/Missing/etc.). Don't hardcode pill colors per component.

## What's intentionally out

This is a wireframe-fidelity skeleton:

- **No interactivity** — search, filters, sort, pagination, kanban drag, row clicks, dropdown opens, action buttons all render but have no handlers
- **No real auth** — profile menu hardcoded to "Jane Manager"
- **No real backend** — fixtures only
- **No detail routes** — Tour Dates and Shows render the current show; switcher in the page header is visual-only
- **No tests** yet — they get added when there's behavior worth covering
- **Itinerary and Notes** — render `<PagePlaceholder>` until designs arrive

See spec §11 ("Non-goals") in each design doc for the full list.

## Contributing

- Read the relevant spec in `docs/superpowers/specs/` before making non-trivial changes
- Stick to the per-section folder convention — when in doubt, follow the pattern in `components/dashboard/` or any sibling section
- The pre-commit hook will reformat your code; don't fight it
- For bigger changes, open an issue or PR with the proposed approach before writing the code

## License

TBD — internal collab project.
