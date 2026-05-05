# TourCraft — Dashboard Skeleton Design

|                             |                                                                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Date**                    | 2026-05-05                                                                                                                                               |
| **Status**                  | Draft (pending user review)                                                                                                                              |
| **Author**                  | Claude (collaborating with user)                                                                                                                         |
| **Implementation**          | TBD — next session via `superpowers:writing-plans` → `superpowers:executing-plans`                                                                       |
| **Repo state at spec time** | Vuestic Admin v3.1.0 cloned into `/Users/samsepiol/code/TC`, deps installed, dev server boots clean on `:5173`, two commits on `main` (scaffold + this spec) |

---

## 1. Context

TourCraft is an artist/collective tour management platform. This is the first frontend spec for the project.

The reference mock (provided by the user) shows the **Tour Dashboard** view: a command-center page composed of four KPI tiles, a Next-72-Hours card, a day-of-show timeline for "today," a Travel & Hotel card, a Quick Contacts card, an Open Issues card with severity pills, an Upcoming Shows table, and a Recent Notes log. The sidebar reveals a 10-item information architecture: **Dashboard, Tour Dates, Shows, Itinerary, Travel, Contacts, Tasks, Documents, Settlements, Notes**.

Stack (already scaffolded):

- Vue 3.5 + Vite 5 + TypeScript
- Vuestic UI 1.10 (component library) + `@vuestic/tailwind` preset
- Tailwind 3.4 + SCSS
- Pinia 2 + Vue Router 4
- vue-i18n 9 (auto-globs `src/i18n/locales/*.json`; default locale `gb`)
- chart.js + vue-chartjs (kept for future use; no charts in this spec)

The user described the goal as "a skeleton frontend to be further edited," and confirmed they have detailed designs for each of the 9 non-Dashboard sections that they will share later. The architecture should make adding detail to any section a one-file edit.

## 2. Goal

Build the **Dashboard view** as a faithful render of the reference mock. Ship the IA shell so the other 9 nav items are routable and render a placeholder. Architect for low-friction extension when per-section designs arrive. Wireframe fidelity (Vuestic default theme tokens stand in for brand identity).

## 3. Scope

### In scope

1. Strip Vuestic Admin's demo content (demo pages, non-English locales, Storybook config, e2e workspace, demo charts/data, demo components not referenced by the layout shell).
2. Rewrite `src/components/sidebar/NavigationRoutes.ts` to TourCraft's 10 IA items.
3. Rewrite `src/router/index.ts` with lazy-loaded TourCraft routes (one per IA item, plus `/` → `/dashboard` redirect and a 404 fallback).
4. Rebrand surface chrome (`<title>`, sidebar header text, `package.json` `name`).
5. Build the Dashboard page (`src/pages/Dashboard.vue`) faithfully matching the mock, decomposed into 8 widget components under `src/components/dashboard/`.
6. Stub the 9 non-Dashboard pages with a shared `<PagePlaceholder>` component that renders `<PageHeader>` + a "Coming soon" body.
7. Add typed mock-data fixtures in `src/data/dashboard.ts` whose values reproduce the mock 1:1.
8. Verify `npm run dev` boots and the rendered page visually matches the mock under wireframe fidelity.

### Out of scope

- CRUD, forms, submit handlers
- Authentication (login, signup, password recovery, sessions, gating)
- Real API integration; real Pinia stores for Dashboard data (constants only)
- Detail routes for the 9 stub sections (e.g., `/shows/:id`)
- Tests (unit, e2e) — e2e workspace deleted; unit tests deferred until logic exists worth covering
- Storybook
- Locale work beyond the existing `gb` (other locale files deleted; strings remain as plain text in components for this spec)
- Custom design tokens / brand identity (Vuestic defaults stand in)
- Error handling (no fetches, nothing to fail)

## 4. Architecture & file layout

```
src/
  App.vue                       (kept — renders <RouterView/>; no edits needed)
  main.ts                       (edited — see §9 (remove GTM init) and §10 (no functional change beyond GTM strip))
  layouts/
    AppLayout.vue               (kept — responsive sidebar+topbar)
  pages/
    Dashboard.vue               (BUILT — orchestrates Dashboard widgets, no UI guts inline)
    TourDates.vue               (STUB — <PagePlaceholder name="Tour Dates"/>)
    Shows.vue                   (STUB)
    Itinerary.vue               (STUB)
    Travel.vue                  (STUB)
    Contacts.vue                (STUB)
    Tasks.vue                   (STUB)
    Documents.vue               (STUB)
    Settlements.vue             (STUB)
    Notes.vue                   (STUB)
    NotFound.vue                (BUILT — minimal 404 page: <PageHeader title="Page not found" subtitle="404"/> + a "Back to Dashboard" link; replaces the deleted Vuestic 404.vue demo)
  components/
    PageHeader.vue              (NEW — reusable; <h1> + subtitle, used by every page including the 9 stubs)
    PagePlaceholder.vue         (NEW — composes <PageHeader> + a centered "Coming soon" panel; used by the 9 stub pages)
    navbar/components/
      NavbarSearch.vue          (NEW — global search input; visual only this spec)
      [existing internals retained: NotificationDropdown, ProfileDropdown; GitHubButton/Discord deleted per §9]
    sidebar/
      NavigationRoutes.ts       (REWRITTEN — TourCraft's 10 items, see §6)
      [Vuestic sidebar internals untouched]
    navbar/                     (kept — topbar; minor edits in §7)
    app-layout-navigation/      (kept — Vuestic layout helpers, untouched)
    dashboard/                  (NEW folder — Dashboard widgets ONLY; new sections get sibling folders later)
      KpiTile.vue
      Next72HoursCard.vue
      TodayTimelineCard.vue
      TravelHotelCard.vue
      QuickContactsCard.vue
      OpenIssuesCard.vue
      UpcomingShowsTable.vue
      RecentNotesCard.vue
  data/
    types.ts                    (NEW — typed interfaces; see §8)
    dashboard.ts                (NEW — mock fixtures; see §8)
    severity.ts                 (NEW — severity tokens shared across sections; see §7)
    format.ts                   (NEW — date/currency formatters; see §7)
  router/index.ts               (REWRITTEN — see §5)
  i18n/
    index.ts                    (kept; pinned to `gb`, no edits)
    locales/gb.json             (kept — only locale file retained)
  scss/                         (kept untouched — Vuestic defaults)
  stores/                       (kept; minimal stub edits if any sidebar/auth store is referenced by AppLayout — verify during implementation)
  services/                     (left empty for now; per-section service files added in future specs)
```

**Modularity rule (per CLAUDE.md "modularize early"):**

- **Page files contain orchestration only.** `Dashboard.vue` imports and composes the 8 widget components; it does _not_ define their internals inline. `Shows.vue` (when built later) will compose components from `components/shows/`.
- **Per-section component folders** (`components/dashboard/`, future `components/shows/`, etc.) keep concerns scoped. No cross-folder imports between sections; shared UI lives at `components/` root (`PageHeader`, `PagePlaceholder`). Cross-cutting tokens / types / formatters live in `src/data/` so any future section can reuse them (`severity.ts`, `format.ts`, `types.ts`).
- **Replacing a stub page** = editing one `.vue` file under `pages/`. **Adding a detail route** = adding one route entry + one new page file. No churn elsewhere.

## 5. Routing

```ts
// src/router/index.ts (abbreviated)
import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      redirect: '/dashboard',
      children: [
        { path: 'dashboard',   name: 'dashboard',   component: () => import('@/pages/Dashboard.vue') },
        { path: 'tour-dates',  name: 'tour-dates',  component: () => import('@/pages/TourDates.vue') },
        { path: 'shows',       name: 'shows',       component: () => import('@/pages/Shows.vue') },
        { path: 'itinerary',   name: 'itinerary',   component: () => import('@/pages/Itinerary.vue') },
        { path: 'travel',      name: 'travel',      component: () => import('@/pages/Travel.vue') },
        { path: 'contacts',    name: 'contacts',    component: () => import('@/pages/Contacts.vue') },
        { path: 'tasks',       name: 'tasks',       component: () => import('@/pages/Tasks.vue') },
        { path: 'documents',   name: 'documents',   component: () => import('@/pages/Documents.vue') },
        { path: 'settlements', name: 'settlements', component: () => import('@/pages/Settlements.vue') },
        { path: 'notes',       name: 'notes',       component: () => import('@/pages/Notes.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFound.vue') },
  ],
})
```

**Why this shape:**

- All pages are **child routes of `AppLayout`** so the shell renders once and `<router-view>` swaps the page body. This is the same pattern Vuestic Admin uses today; we're keeping it.
- **Lazy `import()`** keeps each page in its own chunk. As pages flesh out, the bundle grows linearly per page rather than ballooning the entry chunk.
- **Named routes** so `<router-link :to="{ name: 'shows' }">` works — friendlier than path strings when paths change.
- **Adding a detail route later** is a one-line addition (`{ path: 'shows/:id', name: 'show-detail', component: () => import('@/pages/ShowDetail.vue') }`) plus the new `.vue` file. No router-wide refactor.

## 6. Layout shell & navigation

`AppLayout.vue` is kept verbatim. Inputs (sidebar route table + navbar contents) change.

### NavigationRoutes (sidebar)

`AppSidebar.vue` runs `displayName` through vue-i18n's `t(...)`, so values are i18n keys (not literals). The default export shape is `{ root, routes }` and is consumed via `navigationRoutes.routes` — `root` is currently unused but preserved to match the existing Vuestic type contract.

```ts
// src/components/sidebar/NavigationRoutes.ts (full replacement)
export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: { name: '/', displayName: 'navigationRoutes.home' },
  routes: [
    { name: 'dashboard',   displayName: 'menu.dashboard',   meta: { icon: 'mso-home' } },
    { name: 'tour-dates',  displayName: 'menu.tour-dates',  meta: { icon: 'mso-calendar_today' } },
    { name: 'shows',       displayName: 'menu.shows',       meta: { icon: 'mso-confirmation_number' } },
    { name: 'itinerary',   displayName: 'menu.itinerary',   meta: { icon: 'mso-map' } },
    { name: 'travel',      displayName: 'menu.travel',      meta: { icon: 'mso-flight' } },
    { name: 'contacts',    displayName: 'menu.contacts',    meta: { icon: 'mso-group' } },
    { name: 'tasks',       displayName: 'menu.tasks',       meta: { icon: 'mso-task_alt' } },
    { name: 'documents',   displayName: 'menu.documents',   meta: { icon: 'mso-folder' } },
    { name: 'settlements', displayName: 'menu.settlements', meta: { icon: 'mso-attach_money' } },
    { name: 'notes',       displayName: 'menu.notes',       meta: { icon: 'mso-sticky_note_2' } },
  ] as INavigationRoute[],
}
```

Each `displayName` key needs a corresponding string in `src/i18n/locales/gb.json` under the `menu.*` namespace — see §9 for the exact additions.

> **Icon set decision:** Use **Material Symbols Outlined** (`mso-*`). Verified during review: `index.html` already loads `Material+Symbols+Outlined` from Google Fonts, and `src/services/vuestic-ui/icons-config/icons-config.ts` includes the `mso-{content}` resolver. So `mso-*` names render with zero added setup. The mock's icons are lucide-style; the visual gap is acceptable under wireframe fidelity. Swapping any individual `mso-*` to a closer Material Symbol during implementation is fine and doesn't require a spec change.

### Topbar (`src/components/navbar/`) — actual contents and required changes

What's there today (`AppNavbar.vue` + `AppNavbarActions.vue`):

- **Left slot:** hamburger toggle (mobile only) + `<VuesticLogo />` linking to `/`
- **Right slot, via `AppNavbarActions.vue`:** `GitHubButton` (Vuestic promo) + Discord icon (`VaIconDiscord`, also Vuestic promo) + `NotificationDropdown` (bell) + `ProfileDropdown`
- **No search input. No theme toggle. No locale switcher.** (Earlier spec drafts assumed otherwise — verified wrong against the actual files during review.)

Target navbar contents (matches the mock — note the mock shows no navbar logo/wordmark):

```
[hamburger (mobile)]   [─── NavbarSearch ───]                 [bell]   [profile]
└── left slot ──────────────────────────────┘                 └── right slot ──┘
```

Required changes during implementation:

| Change | File | Action |
|---|---|---|
| Remove navbar branding | `AppNavbar.vue` | Drop `import VuesticLogo from '../VuesticLogo.vue'` and the `<RouterLink to="/"><VuesticLogo /></RouterLink>` template usage. Mock has no navbar logo/wordmark — branding lives in `<title>`, `package.json`, and (later) the favicon. Delete `VuesticLogo.vue` per §9. |
| Add global search | `AppNavbar.vue` | Mount `<NavbarSearch />` in the **left slot**, after the hamburger toggle, with `flex: 1` so it expands across the available width. Import: `import NavbarSearch from './components/NavbarSearch.vue'`. New component is defined in §10. |
| Remove GitHub promo button | `AppNavbarActions.vue` | Drop `import GithubButton from './GitHubButton.vue'` and its template usage. Delete `GitHubButton.vue` per §9. |
| Remove Discord promo icon | `AppNavbarActions.vue` | Drop `import VaIconDiscord from '../../icons/VaIconDiscord.vue'` and its template usage. Delete `VaIconDiscord.vue` per §9. |
| Set profile name to "Jane Manager" | `ProfileDropdown.vue` (or downstream) | Replace the rendered display name with literal **"Jane Manager"** to match the mock. Find via `grep -rn "displayName\|name\b" src/components/navbar/components/dropdowns/ProfileDropdown.vue`. Avatar stays as the Vuestic default placeholder. |
| Bell stays | `NotificationDropdown.vue` | No edit. We don't wire its dropdown content this spec — if it currently shows demo notifications in the dropdown, replace the list with a single "No new notifications" stub or leave it; implementer's call (cosmetic). |

**Search input placeholder:** `Search shows, dates, venues, contacts, tasks, and more…`

### Sidebar header / brand mark

The mock shows no brand element in the sidebar either — just the 10 nav items. No sidebar-header changes required.

If `grep -rn "Vuestic" src/components src/layouts` surfaces other user-facing "Vuestic" strings (copy in `gb.json`, template comments), replace user-facing strings only — leave class names (`va-*`), package imports (`from 'vuestic-ui'`), SCSS variable names, and Vuestic API calls alone.

## 7. Dashboard composition

`src/pages/Dashboard.vue` is pure orchestration:

```vue
<template>
  <div class="dashboard-page">
    <PageHeader title="Tour Dashboard" subtitle="Today / Command Center" />

    <section class="kpi-row">
      <KpiTile v-for="k in kpis" :key="k.label" v-bind="k" />
    </section>

    <section class="row-2">
      <Next72HoursCard :shows="next72h" />
      <TodayTimelineCard :date="todayDate" :events="todayTimeline" />
      <TravelHotelCard :legs="travelLegs" />
    </section>

    <section class="row-3">
      <QuickContactsCard :contacts="quickContacts" />
      <OpenIssuesCard :issues="openIssues" />
      <UpcomingShowsTable :shows="upcomingShows" />
    </section>

    <RecentNotesCard :notes="recentNotes" />
  </div>
</template>
```

Layout: CSS grid via Tailwind. KPI row = `grid-cols-4` on `lg`, `grid-cols-2` on `md`, `grid-cols-1` below `md`. Mid and lower rows = `grid-cols-3` on `lg`, stack below.

### Widget specifications

| Widget                   | Vuestic / HTML primitives                | Behavior & notes                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`KpiTile`**            | `VaCard` + custom layout                 | Props: `icon`, `label`, `value`, `sub`. Renders icon top-left, label top, large numeric value, sub-label muted underneath. No interactivity.                                                                                                                                                                                                                             |
| **`Next72HoursCard`**    | `VaCard` + custom rows                   | Card title + list of 3 rows: left = date+time stacked; right = city+venue stacked; trailing right-chevron icon (decorative, no click handler). Footer: a "View all shows →" `VaButton preset="secondary"` (no nav this spec).                                                                                                                                            |
| **`TodayTimelineCard`**  | `VaCard` + custom timeline               | Card title shows `Today — {{ formatDate(date) }}`. Vertical timeline: left rail with dot markers, time label, then event title + sub-text on the right. Pure CSS (Tailwind) — no timeline lib. Footer: "View full day →" button (no-op).                                                                                                                                 |
| **`TravelHotelCard`**    | `VaCard` + `VaBadge`                     | Card title "Travel & Hotel". 3 rows (Flight / Hotel / Ground) — each: kind icon, kind label, primary text (e.g., "ATL → BNA"), sub text (e.g., "May 20 · 9:45 AM"), status badge ("Confirmed"), trailing chevron.                                                                                                                                                        |
| **`QuickContactsCard`**  | `VaCard` + custom rows + icon `VaButton` | 4 rows: role / name / phone-number / phone-call icon button + email icon button. Buttons are `aria-label`'d but no handlers.                                                                                                                                                                                                                                             |
| **`OpenIssuesCard`**     | `VaCard` + severity badge                | 3 rows: leading bullet dot (severity-tinted), issue title, sub-line, severity pill. **Severity tokens** (defined once in `src/data/severity.ts` so they can be re-skinned and reused by future sections like Tasks): `High`=`{ bg: 'red-100', text: 'red-800' }`, `Medium`=`{ bg: 'amber-100', text: 'amber-800' }`, `Low`=`{ bg: 'slate-100', text: 'slate-700' }`. Lives in `data/` (not `components/dashboard/`) per the modularity rule in §4 — cross-cutting tokens shouldn't be section-scoped.                        |
| **`UpcomingShowsTable`** | Plain `<table>` + Tailwind               | Columns: Date / City / Venue / Advance / Travel / Settlement. Right-aligned numeric. Travel column uses the same "Confirmed"/"Pending" badge style as Travel & Hotel. **Decision:** plain `<table>` rather than `VaDataTable` for skeleton — no sort/filter logic to back, easier to restyle. Swap to `VaDataTable` in a future spec when sort/filter/pagination matter. |
| **`RecentNotesCard`**    | `VaCard` + log rows                      | 3 rows: body text (truncate to 1 line on narrow widths), right-aligned timestamp + `VaAvatar size="small"` with author initials. Footer: "View all notes →" (no-op).                                                                                                                                                                                                     |

### Cross-widget conventions

- **Card chrome** (border, padding, header style) comes from `VaCard` defaults; no per-widget overrides this spec.
- **No interactivity** beyond hover states inherited from Vuestic. Buttons render but have no handlers.
- **Currency formatting** via `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })` for the Advance column.
- **Date formatting** via a shared `src/data/format.ts` helper (`formatShortDate`, `formatTime`) so future pages reuse it.

## 8. Mock data

### Types — `src/data/types.ts`

```ts
export type Status = 'Confirmed' | 'Pending'
export type Severity = 'High' | 'Medium' | 'Low'

export interface Kpi {
  icon: string // mso-* identifier
  label: string
  value: string // pre-formatted (e.g., '12', '$65,000')
  sub: string // sub-label
}

export interface ShowSummary {
  id: string
  date: string // ISO yyyy-mm-dd
  time?: string // 12h string, e.g., '7:30 PM'
  city: string
  venue: string
  advanceUsd?: number
  travel?: Status
  settlement?: '-' | 'Pending' | number
}

export interface TimelineEvent {
  id: string
  time: string // '9:00 AM'
  title: string
  sub: string
}

export interface TravelLeg {
  kind: 'Flight' | 'Hotel' | 'Ground'
  primary: string
  sub: string
  status: Status
}

export interface QuickContact {
  role: string // 'Venue Manager' | 'Promoter' | 'Driver' | 'Hotel'
  name: string
  phone: string
  email?: string
}

export interface Issue {
  id: string
  title: string
  sub: string
  severity: Severity
}

export interface NoteEntry {
  id: string
  body: string
  at: string // ISO datetime
  authorInitials: string
}
```

### Fixtures — `src/data/dashboard.ts` (values reproduce the mock 1:1)

```ts
import type { Kpi, ShowSummary, TimelineEvent, TravelLeg, QuickContact, Issue, NoteEntry } from './types'

export const todayDate = '2026-05-20' // anchors the "Today" timeline; matches mock's "Tue, May 20"

export const kpis: Kpi[] = [
  { icon: 'mso-calendar_today', label: 'Upcoming Shows', value: '12', sub: 'Next 30 days' },
  { icon: 'mso-place', label: 'Cities This Run', value: '8', sub: 'May 18 – Jun 8' },
  { icon: 'mso-check_circle', label: 'Open Tasks', value: '17', sub: '7 due today' },
  { icon: 'mso-warning', label: 'Missing Confirmations', value: '6', sub: 'Venues & Travel' },
]

export const next72h: ShowSummary[] = [
  { id: 's1', date: '2026-05-20', time: '7:30 PM', city: 'Nashville, TN', venue: 'The Ryman' },
  { id: 's2', date: '2026-05-21', time: '8:00 PM', city: 'Atlanta, GA', venue: 'Tabernacle' },
  { id: 's3', date: '2026-05-22', time: '7:00 PM', city: 'New Orleans, LA', venue: 'The Fillmore' },
]

export const todayTimeline: TimelineEvent[] = [
  { id: 't1', time: '9:00 AM', title: 'Load-In', sub: 'Ryman Auditorium' },
  { id: 't2', time: '11:00 AM', title: 'Soundcheck', sub: 'Stage' },
  { id: 't3', time: '5:00 PM', title: 'Dinner', sub: 'Crew & Band' },
  { id: 't4', time: '7:30 PM', title: 'Show', sub: 'The Ryman' },
  { id: 't5', time: '11:00 PM', title: 'Load-Out', sub: 'Ryman Auditorium' },
]

export const travelLegs: TravelLeg[] = [
  { kind: 'Flight', primary: 'ATL → BNA', sub: 'May 20 · 9:45 AM', status: 'Confirmed' },
  { kind: 'Hotel', primary: 'Grand Hyatt Nashville', sub: 'May 20 – May 21 · 1 Room', status: 'Confirmed' },
  { kind: 'Ground', primary: 'Airport Pickup', sub: 'May 20 · 8:30 AM', status: 'Confirmed' },
]

export const quickContacts: QuickContact[] = [
  { role: 'Venue Manager', name: 'Sarah Williams', phone: '(615) 889-3060' },
  { role: 'Promoter', name: 'Mike Reynolds', phone: '(615) 555-2194' },
  { role: 'Driver', name: 'Derrick Johnson', phone: '(615) 555-7788' },
  { role: 'Hotel', name: 'Grand Hyatt Nashville', phone: '(615) 724-1234' },
]

export const openIssues: Issue[] = [
  { id: 'i1', title: 'Missing hotel confirmation', sub: 'Atlanta — May 21', severity: 'High' },
  { id: 'i2', title: 'Truck not confirmed', sub: 'New Orleans — May 22', severity: 'Medium' },
  { id: 'i3', title: 'Venue ride access not received', sub: 'Charlotte — May 24', severity: 'Low' },
]

export const upcomingShows: ShowSummary[] = [
  {
    id: 'u1',
    date: '2026-05-20',
    city: 'Nashville, TN',
    venue: 'The Ryman',
    advanceUsd: 65000,
    travel: 'Confirmed',
    settlement: '-',
  },
  {
    id: 'u2',
    date: '2026-05-21',
    city: 'Atlanta, GA',
    venue: 'Tabernacle',
    advanceUsd: 55000,
    travel: 'Confirmed',
    settlement: '-',
  },
  {
    id: 'u3',
    date: '2026-05-22',
    city: 'New Orleans, LA',
    venue: 'The Fillmore',
    advanceUsd: 50000,
    travel: 'Confirmed',
    settlement: '-',
  },
  {
    id: 'u4',
    date: '2026-05-23',
    city: 'Birmingham, AL',
    venue: 'Iron City',
    advanceUsd: 45000,
    travel: 'Confirmed',
    settlement: '-',
  },
  {
    id: 'u5',
    date: '2026-05-24',
    city: 'Charlotte, NC',
    venue: 'The Fillmore',
    advanceUsd: 48000,
    travel: 'Pending',
    settlement: '-',
  },
]

export const recentNotes: NoteEntry[] = [
  {
    id: 'n1',
    body: 'Venue load-in will use loading dock on 5th Ave. Street access only.',
    at: '2026-05-20T09:15:00',
    authorInitials: 'JM',
  },
  {
    id: 'n2',
    body: 'Soundcheck at The Ryman moved to 11:00 AM. All crew please adjust call times.',
    at: '2026-05-19T16:08:00',
    authorInitials: 'JM',
  },
  {
    id: 'n3',
    body: 'Guest list for Atlanta is closed. No additional names accepted.',
    at: '2026-05-18T14:22:00',
    authorInitials: 'JM',
  },
]
```

**Why this shape:** every widget component imports exactly the named export it needs. When real services arrive in a later spec, each export becomes a loader (`export async function getKpis(): Promise<Kpi[]>`) and each widget switches from a static import to a Pinia store / composable — a localized change per widget rather than a refactor.

## 9. Cleanup operations

### Files / directories to delete

```
# Demo pages — entire subtrees
src/pages/404.vue
src/pages/admin/                       (demo dashboard + demo subpages)
src/pages/auth/                        (login/signup/recover demos)
src/pages/billing/
src/pages/faq/
src/pages/payments/
src/pages/preferences/
src/pages/pricing-plans/
src/pages/projects/
src/pages/settings/
src/pages/users/

# Demo components
src/components/typography/             (demo)
src/components/va-charts/              (demo)
src/components/va-medium-editor/       (demo — pulls in `medium-editor` dep)
src/components/va-timeline-item.vue    (demo)
src/components/VuesticLogo.vue         (delete only AFTER editing AppNavbar.vue per §6 — no replacement; mock has no navbar logo)
src/components/VuesticLogo.stories.ts
src/components/NotFoundImage.vue

# Promotional UI in the navbar (Vuestic-specific, not part of TourCraft)
src/components/navbar/components/GitHubButton.vue
src/components/icons/VaIconDiscord.vue (only this one demo icon; see note below)

# Locales — keep gb.json only
src/i18n/locales/br.json
src/i18n/locales/cn.json
src/i18n/locales/es.json
src/i18n/locales/ir.json

# Demo data
src/data/charts/                       (demo)
src/data/CountriesList.ts
src/data/geo.json
src/data/pages/                        (demo subtree)
src/data/users.json
src/data/types.ts                      (REPLACED with TourCraft types — overwrite, see §8)

# Demo / unused tooling
.storybook/                            (entire dir)
e2e/                                   (entire workspace)

# Demo asset
public/vuestic-admin-image.png
```

> **DO NOT delete `src/components/icons/` wholesale.** Verified during review: `AppLayoutNavigation.vue` imports `VaIconMenuCollapsed` from this folder. The dir contains both demo icons (e.g., `VaIconDiscord`) and layout-chrome icons (e.g., `VaIconMenuCollapsed`). Delete only `VaIconDiscord.vue` for this spec; the rest stays. Revisit later if a section's detailed design lets us prune more.

**Verification gate before each deletion**: `grep -rln "<symbol-or-path>" src/ index.html` returns clean. If a delete still breaks an import, the surviving consumer is in §6's "actual contents and required changes" table — fix the consumer in the same step.

### Code edits required by deletions

| File | Edit |
|---|---|
| `src/main.ts` | Remove `import { createGtm } from '@gtm-support/vue-gtm'` and the `if (import.meta.env.VITE_APP_GTM_ENABLED) { app.use(createGtm({...})) }` block (currently lines 7 and 20–28). Build will break otherwise once `@gtm-support/vue-gtm` is uninstalled. |
| `src/components/navbar/AppNavbar.vue` | Drop the `VuesticLogo` import + `<RouterLink to="/"><VuesticLogo /></RouterLink>` template usage (no replacement — mock has no navbar logo). Add `import NavbarSearch from './components/NavbarSearch.vue'` and mount `<NavbarSearch />` in the **left slot** after the hamburger toggle, with `flex: 1` so it expands. |
| `src/components/navbar/components/AppNavbarActions.vue` | Drop `GithubButton` and `VaIconDiscord` imports + template usages. (No additions here — search lives in `AppNavbar.vue`'s left slot, not in this right-slot component.) |
| `src/components/navbar/components/dropdowns/ProfileDropdown.vue` (or downstream) | Replace the rendered display name with literal `"Jane Manager"`. Locate via `grep -rn "displayName\|name\b" src/components/navbar/components/dropdowns/`. |
| `src/i18n/locales/gb.json` | Add `menu.tour-dates`, `menu.shows`, `menu.itinerary`, `menu.travel`, `menu.contacts`, `menu.tasks`, `menu.documents`, `menu.settlements`, `menu.notes` keys with the displayed strings (e.g., `"menu.tour-dates": "Tour Dates"`). `menu.dashboard` already exists — keep. Orphaned keys for deleted demo pages (`menu.users`, `menu.projects`, `menu.faq`, etc.) can be left in for now (vue-i18n won't error on unused keys); a separate hygiene pass can prune them later. |

### Dependencies to uninstall

After component deletes:

```
medium-editor                    (used only by va-medium-editor)
@types/medium-editor             (devDep — paired)
chartjs-chart-geo                (used only by demo geo chart)
flag-icons                       (no kept consumers — verified during review)
ionicons                         (used only by demo)
register-service-worker          (verified: no imports in src/ or public/; safe to drop)
@gtm-support/vue-gtm             (after main.ts edit above; will reintroduce analytics later via PostHog/Plausible per CLAUDE.md)

# Storybook devDeps:
@storybook/addon-essentials, @storybook/addon-interactions, @storybook/addon-links,
@storybook/blocks, @storybook/testing-library, @storybook/vue3, @storybook/vue3-vite,
storybook, eslint-plugin-storybook
```

### Package.json scripts to remove

`storybook`, `build-storybook`, `e2e`, `e2e:update-snapshots`. Workspace `e2e` removed from `workspaces`.

### Package.json edits

- `name`: `vuestic-admin` → `tourcraft`
- `version`: reset to `0.1.0` (we're a new project, not a fork of v3.1.0)

## 10. Branding rename

| Where | Before | After |
|---|---|---|
| `index.html` `<title>` | `Vuestic Admin` | `TourCraft` |
| `index.html` favicon | Vuestic favicon | (leave default for this spec; brand asset later) |
| `package.json` `name` | `vuestic-admin` | `tourcraft` |
| Navbar logo | `<VuesticLogo>` in `AppNavbar.vue` | (removed entirely — mock has no navbar logo) |
| README.md | Vuestic README | (leave for this spec — user-replaceable later, not user-facing) |

### New component required

```vue
<!-- src/components/navbar/components/NavbarSearch.vue -->
<template>
  <VaInput
    class="navbar-search"
    placeholder="Search shows, dates, venues, contacts, tasks, and more…"
    aria-label="Global search"
  >
    <template #prependInner>
      <VaIcon name="mso-search" color="secondary" />
    </template>
  </VaInput>
</template>

<style scoped>
.navbar-search {
  min-width: 16rem;
  flex: 1 1 auto;
}
</style>
```

Lives under `components/navbar/components/` because it's navbar-specific.

Search-and-replace surface: `grep -ril "vuestic" src/ index.html package.json` — review each hit, replace user-facing strings, leave class names (`va-*`), package imports (`from 'vuestic-ui'`), SCSS variable names, and Vuestic API calls alone.

## 11. Definition of done

- [ ] `npm run dev` boots cleanly — no warnings about missing modules from deleted demo files or uninstalled deps (GTM, etc.)
- [ ] Visiting `/` redirects to `/dashboard`
- [ ] Dashboard renders all 8 widgets, populated from `src/data/dashboard.ts`, visually matching the reference mock under wireframe fidelity (layout / structure / copy match; exact pixel parity not required)
- [ ] Sidebar shows TourCraft's 10 IA items in the order specified, each labeled via i18n keys from `gb.json`, with the active item highlighted as you navigate
- [ ] Each non-Dashboard nav item routes to `<PagePlaceholder>` rendering `<PageHeader title="<section name>"/>` + a centered panel reading **"Coming soon — detailed design pending."** — no console errors, no broken layout
- [ ] Navbar layout matches mock: hamburger (mobile) + `<NavbarSearch>` filling the left slot, bell (`NotificationDropdown`) + profile menu reading **"Jane Manager"** in the right slot. **No VuesticLogo, no GitHub button, no Discord icon.**
- [ ] `npm run build:ci` completes successfully (skips lint/tsc; production-grade `npm run build` deferred — TS strict cleanup may surface issues to fix in a follow-up)
- [ ] No remaining demo Vuestic pages, demo data, demo `va-charts`/`va-medium-editor`/typography components, Storybook config, or e2e workspace in the repo
- [ ] No broken imports anywhere (`grep` for any deleted file path / removed dep returns clean)
- [ ] Spec file (this doc) committed; implementation work committed in subsequent commits keyed to the writing-plans output

## 12. Non-goals / decisions explicitly deferred

- **Real auth.** Profile menu is decorative. Future spec.
- **Real backend.** Mock data only. Future spec will introduce a service layer + Pinia stores + the chosen DB (per CLAUDE.md preference: Prisma + Postgres).
- **Multi-tenant model** (artists / collectives / managers). Future spec.
- **Brand identity / theme tokens.** Vuestic defaults stand in. Future spec when brand work happens.
- **Per-section detailed designs** for the 9 stub pages. User will provide; each gets its own spec.
- **Production build hygiene.** `npm run build` (full lint + vue-tsc) may flag issues from generated TypeScript strictness; resolving these is a follow-up, not a blocker for `build:ci`.

---

_End of spec. Implementation plan to follow via `superpowers:writing-plans`._
