# TourCraft Dashboard Skeleton — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the TourCraft Tour Dashboard view as a faithful render of the reference mock, plus a routable IA shell where the other 9 nav items render placeholder pages, on top of the already-scaffolded Vuestic Admin codebase.

**Architecture:** Strip Vuestic Admin's demo content surgically. Keep the layout shell (`AppLayout`, sidebar collapse, topbar slots), the Vuestic UI component library, and the build pipeline. Replace navigation/router with TourCraft routes, build 8 dashboard widgets composed by a thin orchestration page, stub the other 9 sections with a shared placeholder. Mock data only — no auth, no API, no real backend. Wireframe fidelity (Vuestic default tokens stand in for brand identity).

**Tech stack:** Vue 3.5 · Vite 5 · TypeScript · Vuestic UI 1.10 · Tailwind 3.4 · SCSS · Pinia 2 · Vue Router 4 · vue-i18n 9.

**Spec reference:** `docs/superpowers/specs/2026-05-05-tourcraft-dashboard-skeleton-design.md`

**Test posture:** No unit or e2e tests this iteration (per spec §3 out-of-scope — there's no logic worth covering yet). Verification per task is dev-server boot + targeted `grep` checks + visual confirmation in the browser at `http://localhost:5173/`. Tests get a dedicated spec when behavior arrives.

**Implementation order rationale:** Build new content alongside the old, then delete the old at the end. At every commit the dev server stays bootable. Demo Vuestic pages live at their old paths (e.g., `/admin/dashboard`) and are unreferenced by the rewritten router from Task 5 onward; deletion comes last in Task 13–14 once nothing imports them.

---

## File map (locked in)

### Created

- `src/data/types.ts` — typed interfaces (replaces existing demo types.ts)
- `src/data/severity.ts` — severity tokens shared across sections
- `src/data/format.ts` — currency + date helpers
- `src/data/dashboard.ts` — mock fixtures matching the mock 1:1
- `src/components/PageHeader.vue` — reusable page heading
- `src/components/PagePlaceholder.vue` — stub body for non-Dashboard pages
- `src/components/navbar/components/NavbarSearch.vue` — global search input
- `src/components/dashboard/KpiTile.vue` — KPI tile widget
- `src/components/dashboard/Next72HoursCard.vue` — upcoming 3 shows widget
- `src/components/dashboard/TodayTimelineCard.vue` — day-of-show timeline
- `src/components/dashboard/TravelHotelCard.vue` — travel legs card
- `src/components/dashboard/QuickContactsCard.vue` — contacts card
- `src/components/dashboard/OpenIssuesCard.vue` — issues with severity pills
- `src/components/dashboard/UpcomingShowsTable.vue` — upcoming-shows table
- `src/components/dashboard/RecentNotesCard.vue` — notes log
- `src/pages/Dashboard.vue` — orchestrates the 8 widgets
- `src/pages/TourDates.vue`, `Shows.vue`, `Itinerary.vue`, `Travel.vue`, `Contacts.vue`, `Tasks.vue`, `Documents.vue`, `Settlements.vue`, `Notes.vue` — 9 stubs
- `src/pages/NotFound.vue` — 404 page

### Modified

- `src/components/sidebar/NavigationRoutes.ts` — full replacement
- `src/router/index.ts` — full replacement
- `src/i18n/locales/gb.json` — add `menu.*` keys for TourCraft sections
- `src/components/navbar/AppNavbar.vue` — drop `VuesticLogo`, mount `NavbarSearch` in left slot
- `src/components/navbar/components/AppNavbarActions.vue` — drop `GithubButton` + `VaIconDiscord`
- `src/components/navbar/components/dropdowns/ProfileDropdown.vue` — display name → "Jane Manager"
- `src/main.ts` — remove GTM init
- `index.html` — `<title>` → "TourCraft"
- `package.json` — `name` → `tourcraft`, `version` → `0.1.0`, drop demo scripts + workspace

### Deleted

- All demo pages under `src/pages/` (404.vue, admin/, auth/, billing/, faq/, payments/, preferences/, pricing-plans/, projects/, settings/, users/)
- Demo components: `src/components/typography/`, `src/components/va-charts/`, `src/components/va-medium-editor/`, `src/components/va-timeline-item.vue`, `src/components/VuesticLogo.vue`, `src/components/VuesticLogo.stories.ts`, `src/components/NotFoundImage.vue`
- Demo navbar: `src/components/navbar/components/GitHubButton.vue`, `src/components/icons/VaIconDiscord.vue`
- Locales (non-en): `src/i18n/locales/{br,cn,es,ir}.json`
- Demo data: `src/data/charts/`, `src/data/CountriesList.ts`, `src/data/geo.json`, `src/data/pages/`, `src/data/users.json`
- Tooling: `.storybook/`, `e2e/`, `public/vuestic-admin-image.png`
- Vuestic-only docs: `docs/pre-production.md` (committed accidentally during scaffolding)

### Deps removed (uninstalled from package.json)

- `medium-editor`, `@types/medium-editor`, `chartjs-chart-geo`, `flag-icons`, `ionicons`, `register-service-worker`, `@gtm-support/vue-gtm`
- Storybook devDeps: `@storybook/addon-essentials`, `@storybook/addon-interactions`, `@storybook/addon-links`, `@storybook/blocks`, `@storybook/testing-library`, `@storybook/vue3`, `@storybook/vue3-vite`, `storybook`, `eslint-plugin-storybook`

---

## Pre-flight

Confirm working state before starting. Dev server must already be bootable on the current `main` (commit `cbc00ee`).

- [ ] **P.1** Run `git status` — verify clean working tree
- [ ] **P.2** Run `git log --oneline -5` — verify HEAD is at the spec-revision commit (`cbc00ee` or descendant)
- [ ] **P.3** Run `npm run dev` (in a background shell or separate terminal) — verify it boots clean to `http://localhost:5173/`. Leave it running for visual checks throughout the plan; it hot-reloads on each file change.

Expected for P.3: `VITE v5.4.x  ready in <ms>ms` and `Local:   http://localhost:5173/`.

---

## Task 1: Data foundation — types, tokens, formatters, fixtures

**Files:**

- Create: `src/data/types.ts` (overwrites existing demo file — see deletes for old contents)
- Create: `src/data/severity.ts`
- Create: `src/data/format.ts`
- Create: `src/data/dashboard.ts`

This task establishes the typed mock-data layer the widgets will import. All four files are pure modules — no side effects, no Vuestic dependencies, so creating them can't break dev-server boot.

- [ ] **Step 1.1: Overwrite `src/data/types.ts` with TourCraft types**

```ts
// src/data/types.ts
export type Status = 'Confirmed' | 'Pending'
export type Severity = 'High' | 'Medium' | 'Low'

export interface Kpi {
  icon: string // mso-* identifier (Material Symbols Outlined)
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

- [ ] **Step 1.2: Create `src/data/severity.ts`**

```ts
// src/data/severity.ts — severity tokens shared across sections (Issues here, future Tasks/Alerts elsewhere)
import type { Severity } from './types'

export const severityTokens: Record<Severity, { bg: string; text: string; dot: string }> = {
  High: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  Medium: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  Low: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' },
}
```

- [ ] **Step 1.3: Create `src/data/format.ts`**

```ts
// src/data/format.ts — shared formatters (used by widgets and reusable later by other sections)

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const shortDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

const longDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
})

const time12 = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

export function formatUsd(amount: number): string {
  return usd.format(amount)
}

export function formatShortDate(iso: string): string {
  // iso is yyyy-mm-dd; force UTC parse to avoid TZ drift on day boundary
  const [y, m, d] = iso.split('-').map(Number)
  return shortDate.format(new Date(Date.UTC(y, m - 1, d)))
}

export function formatLongDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return longDate.format(new Date(Date.UTC(y, m - 1, d)))
}

export function formatTimeFromIso(iso: string): string {
  return time12.format(new Date(iso))
}
```

- [ ] **Step 1.4: Create `src/data/dashboard.ts` with mock fixtures**

```ts
// src/data/dashboard.ts — fixtures matching the reference mock 1:1
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

- [ ] **Step 1.5: Verify TS compiles**

Run: `npx vue-tsc --noEmit`
Expected: zero errors. (There may be unrelated pre-existing errors in demo files — note them but don't fix here. Errors mentioning `src/data/*.ts` would be regressions in your code; fix those.)

- [ ] **Step 1.6: Verify dev server still boots**

Verify the running dev server has no errors in its log. If you see "Failed to resolve import" referencing the new files, you have a typo. Otherwise pass.

- [ ] **Step 1.7: Commit**

```bash
git add src/data/types.ts src/data/severity.ts src/data/format.ts src/data/dashboard.ts
git commit -m "feat(data): add TourCraft types, severity tokens, formatters, and dashboard mock fixtures"
```

---

## Task 2: Shared layout primitives — PageHeader, PagePlaceholder, NotFound

**Files:**

- Create: `src/components/PageHeader.vue`
- Create: `src/components/PagePlaceholder.vue`
- Create: `src/pages/NotFound.vue`

These are leaf components used by all 9 stub pages and the eventual Dashboard. No external deps beyond Vuestic UI's built-ins.

- [ ] **Step 2.1: Create `src/components/PageHeader.vue`**

```vue
<!-- src/components/PageHeader.vue -->
<template>
  <header class="page-header">
    <h1 class="page-header__title">{{ title }}</h1>
    <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<style scoped lang="scss">
.page-header {
  margin-bottom: 1.5rem;
}

.page-header__title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0;
}

.page-header__subtitle {
  margin: 0.25rem 0 0;
  color: var(--va-secondary);
  font-size: 0.875rem;
}
</style>
```

- [ ] **Step 2.2: Create `src/components/PagePlaceholder.vue`**

```vue
<!-- src/components/PagePlaceholder.vue -->
<template>
  <div class="page-placeholder">
    <PageHeader :title="name" />
    <div class="page-placeholder__panel">
      <p class="page-placeholder__copy">Coming soon — detailed design pending.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from './PageHeader.vue'

defineProps<{
  name: string
}>()
</script>

<style scoped lang="scss">
.page-placeholder {
  padding: 1.5rem;
}

.page-placeholder__panel {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 12rem;
  padding: 2rem;
  border: 1px dashed var(--va-background-border);
  border-radius: 0.5rem;
  background: var(--va-background-element);
}

.page-placeholder__copy {
  margin: 0;
  color: var(--va-secondary);
  font-size: 1rem;
}
</style>
```

- [ ] **Step 2.3: Create `src/pages/NotFound.vue`**

```vue
<!-- src/pages/NotFound.vue -->
<template>
  <div class="not-found">
    <PageHeader title="Page not found" subtitle="404" />
    <p class="not-found__copy">The page you're looking for doesn't exist.</p>
    <RouterLink :to="{ name: 'dashboard' }" class="not-found__link"> ← Back to Dashboard </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
</script>

<style scoped lang="scss">
.not-found {
  padding: 2rem;
}

.not-found__copy {
  color: var(--va-secondary);
  margin: 0 0 1rem;
}

.not-found__link {
  color: var(--va-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
```

- [ ] **Step 2.4: Verify dev server reloads cleanly**

Watch the dev server log. Should see HMR reload events with no errors. (We can't visit these routes yet — they're not registered.)

- [ ] **Step 2.5: Commit**

```bash
git add src/components/PageHeader.vue src/components/PagePlaceholder.vue src/pages/NotFound.vue
git commit -m "feat(layout): add shared PageHeader, PagePlaceholder, and NotFound primitives"
```

---

## Task 3: Page files — Dashboard placeholder + 9 section stubs

**Files:**

- Create: `src/pages/Dashboard.vue` (placeholder body for now; widgets composed in Task 22)
- Create: `src/pages/TourDates.vue`
- Create: `src/pages/Shows.vue`
- Create: `src/pages/Itinerary.vue`
- Create: `src/pages/Travel.vue`
- Create: `src/pages/Contacts.vue`
- Create: `src/pages/Tasks.vue`
- Create: `src/pages/Documents.vue`
- Create: `src/pages/Settlements.vue`
- Create: `src/pages/Notes.vue`

Until Task 22 wires real widgets in, `Dashboard.vue` looks like the other stubs. Keeping the file present from Task 3 onward means the router (Task 5) compiles immediately.

- [ ] **Step 3.1: Create `src/pages/Dashboard.vue` (placeholder body — widgets land in Task 22)**

```vue
<!-- src/pages/Dashboard.vue -->
<template>
  <PagePlaceholder name="Tour Dashboard" />
</template>

<script setup lang="ts">
import PagePlaceholder from '../components/PagePlaceholder.vue'
</script>
```

- [ ] **Step 3.2: Create the 9 section stubs**

Each file is identical except for the `name` prop. Create all nine:

```vue
<!-- src/pages/TourDates.vue -->
<template>
  <PagePlaceholder name="Tour Dates" />
</template>

<script setup lang="ts">
import PagePlaceholder from '../components/PagePlaceholder.vue'
</script>
```

```vue
<!-- src/pages/Shows.vue -->
<template>
  <PagePlaceholder name="Shows" />
</template>

<script setup lang="ts">
import PagePlaceholder from '../components/PagePlaceholder.vue'
</script>
```

```vue
<!-- src/pages/Itinerary.vue -->
<template>
  <PagePlaceholder name="Itinerary" />
</template>

<script setup lang="ts">
import PagePlaceholder from '../components/PagePlaceholder.vue'
</script>
```

```vue
<!-- src/pages/Travel.vue -->
<template>
  <PagePlaceholder name="Travel" />
</template>

<script setup lang="ts">
import PagePlaceholder from '../components/PagePlaceholder.vue'
</script>
```

```vue
<!-- src/pages/Contacts.vue -->
<template>
  <PagePlaceholder name="Contacts" />
</template>

<script setup lang="ts">
import PagePlaceholder from '../components/PagePlaceholder.vue'
</script>
```

```vue
<!-- src/pages/Tasks.vue -->
<template>
  <PagePlaceholder name="Tasks" />
</template>

<script setup lang="ts">
import PagePlaceholder from '../components/PagePlaceholder.vue'
</script>
```

```vue
<!-- src/pages/Documents.vue -->
<template>
  <PagePlaceholder name="Documents" />
</template>

<script setup lang="ts">
import PagePlaceholder from '../components/PagePlaceholder.vue'
</script>
```

```vue
<!-- src/pages/Settlements.vue -->
<template>
  <PagePlaceholder name="Settlements" />
</template>

<script setup lang="ts">
import PagePlaceholder from '../components/PagePlaceholder.vue'
</script>
```

```vue
<!-- src/pages/Notes.vue -->
<template>
  <PagePlaceholder name="Notes" />
</template>

<script setup lang="ts">
import PagePlaceholder from '../components/PagePlaceholder.vue'
</script>
```

- [ ] **Step 3.3: Verify dev server reloads cleanly**

Should see HMR reloads with no errors. Pages aren't routable yet.

- [ ] **Step 3.4: Commit**

```bash
git add src/pages/Dashboard.vue src/pages/TourDates.vue src/pages/Shows.vue src/pages/Itinerary.vue src/pages/Travel.vue src/pages/Contacts.vue src/pages/Tasks.vue src/pages/Documents.vue src/pages/Settlements.vue src/pages/Notes.vue
git commit -m "feat(pages): add Dashboard placeholder + 9 section stub pages"
```

---

## Task 4: Sidebar — NavigationRoutes rewrite + gb.json menu keys

**Files:**

- Modify: `src/components/sidebar/NavigationRoutes.ts` (full replacement)
- Modify: `src/i18n/locales/gb.json` (add `menu.*` keys)

The sidebar component runs `displayName` through `t()`, so `displayName` values must be i18n keys (e.g., `'menu.dashboard'`), and `gb.json` must contain the matching translations.

- [ ] **Step 4.1: Replace `src/components/sidebar/NavigationRoutes.ts` contents**

```ts
// src/components/sidebar/NavigationRoutes.ts
export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: { name: '/', displayName: 'navigationRoutes.home' },
  routes: [
    { name: 'dashboard', displayName: 'menu.dashboard', meta: { icon: 'mso-home' } },
    { name: 'tour-dates', displayName: 'menu.tour-dates', meta: { icon: 'mso-calendar_today' } },
    { name: 'shows', displayName: 'menu.shows', meta: { icon: 'mso-confirmation_number' } },
    { name: 'itinerary', displayName: 'menu.itinerary', meta: { icon: 'mso-map' } },
    { name: 'travel', displayName: 'menu.travel', meta: { icon: 'mso-flight' } },
    { name: 'contacts', displayName: 'menu.contacts', meta: { icon: 'mso-group' } },
    { name: 'tasks', displayName: 'menu.tasks', meta: { icon: 'mso-task_alt' } },
    { name: 'documents', displayName: 'menu.documents', meta: { icon: 'mso-folder' } },
    { name: 'settlements', displayName: 'menu.settlements', meta: { icon: 'mso-attach_money' } },
    { name: 'notes', displayName: 'menu.notes', meta: { icon: 'mso-sticky_note_2' } },
  ] as INavigationRoute[],
}
```

- [ ] **Step 4.2: Add TourCraft `menu.*` keys to `gb.json`**

Open `src/i18n/locales/gb.json`. Find the `"menu": { ... }` block (it already contains keys like `menu.dashboard`, `menu.users`, etc.). Add the TourCraft keys. The `dashboard` key likely exists — verify and keep. Orphaned demo keys (`menu.users`, `menu.projects`, `menu.faq`, etc.) can stay for now and get cleaned in a later hygiene pass.

If `gb.json` does NOT have a `"menu"` object yet (unlikely), add one. The `menu` block must contain at minimum:

```json
"menu": {
  "dashboard": "Dashboard",
  "tour-dates": "Tour Dates",
  "shows": "Shows",
  "itinerary": "Itinerary",
  "travel": "Travel",
  "contacts": "Contacts",
  "tasks": "Tasks",
  "documents": "Documents",
  "settlements": "Settlements",
  "notes": "Notes"
}
```

To merge precisely without disturbing other keys, edit by hand: locate the closing `}` of the existing `"menu"` object and add the missing keys before it. Keys you ADD (assuming existing `dashboard` already present): `tour-dates`, `shows`, `itinerary`, `travel`, `contacts`, `tasks`, `documents`, `settlements`, `notes`.

- [ ] **Step 4.3: Verify sidebar shows new items**

The dev server hot-reloads on file change. In the browser at `http://localhost:5173/`, the sidebar should now show:

- Dashboard
- Tour Dates
- Shows
- Itinerary
- Travel
- Contacts
- Tasks
- Documents
- Settlements
- Notes

(Plus any leftover demo items from before the deletes — those go away in Task 13. Until then both old and new may render side by side; that's expected.)

If a label shows literally as `"menu.tour-dates"` instead of `"Tour Dates"`, you didn't add the key correctly to `gb.json`.

If clicking a sidebar item produces a console error or 404, that's expected — the router rewrite is Task 5.

- [ ] **Step 4.4: Commit**

```bash
git add src/components/sidebar/NavigationRoutes.ts src/i18n/locales/gb.json
git commit -m "feat(nav): rewrite sidebar nav to TourCraft IA + add menu i18n keys"
```

---

## Task 5: Router rewrite

**Files:**

- Modify: `src/router/index.ts` (full replacement)

After this task, clicking any sidebar item navigates correctly. Demo Vuestic pages still exist on disk but become unreferenced (deletion in Task 13).

- [ ] **Step 5.1: Read existing `src/router/index.ts`** to understand the AppLayout import path used. Confirm it's `@/layouts/AppLayout.vue` (Vite path alias) or `../layouts/AppLayout.vue`. The Vuestic Admin scaffold uses the `@` alias.

Run: `grep -n "AppLayout\|from '@" src/router/index.ts | head -5`

- [ ] **Step 5.2: Replace `src/router/index.ts` contents**

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      redirect: { name: 'dashboard' },
      children: [
        { path: 'dashboard', name: 'dashboard', component: () => import('@/pages/Dashboard.vue') },
        { path: 'tour-dates', name: 'tour-dates', component: () => import('@/pages/TourDates.vue') },
        { path: 'shows', name: 'shows', component: () => import('@/pages/Shows.vue') },
        { path: 'itinerary', name: 'itinerary', component: () => import('@/pages/Itinerary.vue') },
        { path: 'travel', name: 'travel', component: () => import('@/pages/Travel.vue') },
        { path: 'contacts', name: 'contacts', component: () => import('@/pages/Contacts.vue') },
        { path: 'tasks', name: 'tasks', component: () => import('@/pages/Tasks.vue') },
        { path: 'documents', name: 'documents', component: () => import('@/pages/Documents.vue') },
        { path: 'settlements', name: 'settlements', component: () => import('@/pages/Settlements.vue') },
        { path: 'notes', name: 'notes', component: () => import('@/pages/Notes.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFound.vue') },
  ],
})
```

> If Step 5.1 found that the existing router does NOT use the `@/` alias, swap each `@/` for `../` (e.g., `'../layouts/AppLayout.vue'`, `'../pages/Dashboard.vue'`). The `vite.config.ts` defines an `@` alias pointing at `src/`; in a Vuestic Admin clone this is standard.

- [ ] **Step 5.3: Verify `/` redirects to `/dashboard`**

Open or refresh `http://localhost:5173/`. URL should redirect to `http://localhost:5173/dashboard`. Page renders the `Dashboard` placeholder ("Tour Dashboard" title + "Coming soon — detailed design pending.").

- [ ] **Step 5.4: Verify each sidebar item navigates**

Click each of the 10 sidebar items. Each should navigate to its respective `/<slug>` URL and render the placeholder body with the correct title (e.g., "Tour Dates", "Shows", etc.). Active item should be highlighted.

- [ ] **Step 5.5: Verify 404 fallback**

Visit `http://localhost:5173/this-route-does-not-exist`. Should render the `NotFound.vue` page with "Page not found" + "Back to Dashboard" link. Clicking the link returns to `/dashboard`.

- [ ] **Step 5.6: Commit**

```bash
git add src/router/index.ts
git commit -m "feat(routing): rewrite router with TourCraft routes, redirect, and 404 fallback"
```

---

## Task 6: NavbarSearch component

**Files:**

- Create: `src/components/navbar/components/NavbarSearch.vue`

A minimal global-search input used by `AppNavbar.vue` in Task 7. Visual only — no `@input` handler, no results panel.

- [ ] **Step 6.1: Create `src/components/navbar/components/NavbarSearch.vue`**

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

<style scoped lang="scss">
.navbar-search {
  min-width: 16rem;
  flex: 1 1 auto;
}
</style>
```

- [ ] **Step 6.2: Verify dev server reloads cleanly**

No visual change yet (component isn't mounted). HMR log should show a clean reload.

- [ ] **Step 6.3: Commit**

```bash
git add src/components/navbar/components/NavbarSearch.vue
git commit -m "feat(navbar): add NavbarSearch component"
```

---

## Task 7: AppNavbar — drop VuesticLogo, mount NavbarSearch in left slot

**Files:**

- Modify: `src/components/navbar/AppNavbar.vue`

Removes the Vuestic logo (mock has none) and wires in the new search input.

- [ ] **Step 7.1: Read current `src/components/navbar/AppNavbar.vue`**

Run: `cat src/components/navbar/AppNavbar.vue`

Confirm structure: `<template>` has `<VaNavbar>` with `#left` slot containing `<RouterLink to="/"><VuesticLogo /></RouterLink>` and `#right` slot using `<AppNavbarActions>`. Script imports `VuesticLogo` from `'../VuesticLogo.vue'`.

- [ ] **Step 7.2: Edit `src/components/navbar/AppNavbar.vue`**

Apply two changes:

**Change A — Replace the `<RouterLink ...><VuesticLogo /></RouterLink>` block** in the `#left` template with `<NavbarSearch />`. Keep the existing `<Transition>` block with the hamburger toggle untouched. The `#left` slot's inner `<div class="left">` should now contain (in order): hamburger Transition + `<NavbarSearch />`.

**Change B — Update the `<script setup>` imports.** Replace `import VuesticLogo from '../VuesticLogo.vue'` with `import NavbarSearch from './components/NavbarSearch.vue'`.

The full updated `<template>` looks like this (copy verbatim, adjusting only if your existing file has additional bespoke logic in the slots):

```vue
<template>
  <VaNavbar class="app-layout-navbar py-2 px-0">
    <template #left>
      <div class="left">
        <Transition v-if="isMobile" name="icon-fade" mode="out-in">
          <VaIcon
            color="primary"
            :name="isSidebarMinimized ? 'menu' : 'close'"
            size="24px"
            style="margin-top: 3px"
            @click="isSidebarMinimized = !isSidebarMinimized"
          />
        </Transition>
        <NavbarSearch />
      </div>
    </template>
    <template #right>
      <AppNavbarActions class="app-navbar__actions" :is-mobile="isMobile" />
    </template>
  </VaNavbar>
</template>
```

The full updated `<script setup>` block:

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '../../stores/global-store'
import AppNavbarActions from './components/AppNavbarActions.vue'
import NavbarSearch from './components/NavbarSearch.vue'

defineProps({
  isMobile: { type: Boolean, default: false },
})

const GlobalStore = useGlobalStore()

const { isSidebarMinimized } = storeToRefs(GlobalStore)
</script>
```

> The `<style>` block is unchanged from the original. The `.left` flex layout already gives child elements `flex: 1 1 auto` behavior via `NavbarSearch`'s own scoped style.

- [ ] **Step 7.3: Verify visually**

Refresh `http://localhost:5173/`. The navbar's left side should now show the global search input (with the mso-search icon, placeholder "Search shows, dates, venues, contacts, tasks, and more…"), filling most of the width up to the right-side actions. No Vuestic logo. Right side still shows the GitHub button + Discord icon + bell + profile (those go in Task 8).

- [ ] **Step 7.4: Verify no console errors**

Open browser devtools console. No errors should appear. (`Failed to resolve component: VuesticLogo` would mean a leftover reference — re-check Step 7.2.)

- [ ] **Step 7.5: Commit**

```bash
git add src/components/navbar/AppNavbar.vue
git commit -m "feat(navbar): drop VuesticLogo, mount NavbarSearch in left slot"
```

---

## Task 8: AppNavbarActions — drop GithubButton + VaIconDiscord

**Files:**

- Modify: `src/components/navbar/components/AppNavbarActions.vue`

Removes Vuestic's promotional UI (GitHub button + Discord icon) from the right slot. Bell + profile remain.

- [ ] **Step 8.1: Read current `src/components/navbar/components/AppNavbarActions.vue`**

Run: `cat src/components/navbar/components/AppNavbarActions.vue`

Locate: imports of `GithubButton` and `VaIconDiscord`; their template usages.

- [ ] **Step 8.2: Edit imports**

In the `<script setup>` block, **delete** these two lines:

```ts
import GithubButton from './GitHubButton.vue'
import VaIconDiscord from '../../icons/VaIconDiscord.vue'
```

- [ ] **Step 8.3: Edit template**

In the `<template>` block, find the elements that render `<GithubButton />` (or `<github-button />`) and `<VaIconDiscord />` (or `<va-icon-discord />`) — they're in the right-actions row.

**Delete those two elements.** Surrounding `<NotificationDropdown />` and `<ProfileDropdown />` stay.

If the icons sit inside a wrapper `<div>` with a `<a>` link that points to a Discord/GitHub URL, delete the entire `<a>` (or whatever wrapper holds only those two elements). Keep wrappers that hold elements you're keeping.

- [ ] **Step 8.4: Verify visually**

Refresh the browser. The right side of the navbar should now show only: bell icon (NotificationDropdown) + profile menu. No GitHub icon, no Discord icon.

- [ ] **Step 8.5: Verify no console errors**

No "Failed to resolve component" or undefined-reference errors in console.

- [ ] **Step 8.6: Commit**

```bash
git add src/components/navbar/components/AppNavbarActions.vue
git commit -m "feat(navbar): remove Vuestic promo (GitHub button + Discord icon) from actions"
```

---

## Task 9: ProfileDropdown — display name "Jane Manager"

**Files:**

- Modify: `src/components/navbar/components/dropdowns/ProfileDropdown.vue` (or the file/store that supplies the displayed user name)

The mock shows the navbar avatar paired with the literal name "Jane Manager." This task hardcodes that name (no auth this spec).

- [ ] **Step 9.1: Locate the source of the displayed user name**

Run: `grep -rn "displayName\|userName\|user\.name\|currentUser" src/components/navbar/components/dropdowns/ProfileDropdown.vue src/stores/user-store.ts 2>/dev/null`

Vuestic Admin commonly stores the user identity in `src/stores/user-store.ts` (Pinia) and reads it from the dropdown. The dropdown may render `{{ user.fullName }}` or similar.

- [ ] **Step 9.2: Edit so the displayed name is the literal string "Jane Manager"**

Two acceptable approaches; pick whichever requires fewer changes:

**Approach A — Edit the store's default user.** If `src/stores/user-store.ts` has a default state with `fullName` / `name` fields (e.g., `name: 'Vasili S.'`), change the value to `'Jane Manager'`.

**Approach B — Edit the dropdown template directly.** If the dropdown reads from a store but you'd rather not touch state, replace the binding `{{ user.fullName }}` with the literal `Jane Manager` in `ProfileDropdown.vue`'s template.

Approach A is preferred because it keeps the store as the single source of truth for any other consumer (e.g., a future profile page).

- [ ] **Step 9.3: Verify visually**

Refresh. Click the profile avatar in the right-side navbar. Dropdown should display "Jane Manager" (and an email if the original layout shows one — that can stay as Vuestic's default placeholder). The collapsed-state label (if any) shows "Jane Manager."

- [ ] **Step 9.4: Commit**

```bash
git add src/stores/user-store.ts src/components/navbar/components/dropdowns/ProfileDropdown.vue
git commit -m "feat(navbar): set profile display name to Jane Manager"
```

> If only one of those files actually changed, only `git add` that one. Empty commits aren't created here.

---

## Task 10: main.ts — remove GTM init

**Files:**

- Modify: `src/main.ts`

`@gtm-support/vue-gtm` is a demo analytics dep we'll uninstall in Task 14. Removing the import + init now means the build still compiles immediately after the dep is uninstalled (Task 14).

- [ ] **Step 10.1: Edit `src/main.ts`**

Delete two regions:

1. The import line: `import { createGtm } from '@gtm-support/vue-gtm'`
2. The `if (import.meta.env.VITE_APP_GTM_ENABLED) { ... }` block

The full file after editing:

```ts
// src/main.ts
import './scss/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'

import stores from './stores'
import router from './router'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'

const app = createApp(App)

app.use(stores)
app.use(router)
app.use(i18n)
app.use(createVuestic({ config: vuesticGlobalConfig }))

app.mount('#app')
```

- [ ] **Step 10.2: Verify dev server still boots**

Watch the dev server log for HMR reload. No errors. If you see a reference to GTM still resolving from somewhere else, grep `grep -rn "createGtm\|vue-gtm" src/` to find leftovers.

- [ ] **Step 10.3: Commit**

```bash
git add src/main.ts
git commit -m "chore(main): remove @gtm-support/vue-gtm init (dep uninstall coming)"
```

---

## Task 11: Branding — index.html title + package.json metadata

**Files:**

- Modify: `index.html`
- Modify: `package.json`

- [ ] **Step 11.1: Edit `index.html`**

Find: `<title>Vuestic Admin</title>`
Replace with: `<title>TourCraft</title>`

(Leave the favicon and other meta tags as-is for this spec.)

- [ ] **Step 11.2: Edit `package.json`**

Two scalar fields:

- `"name": "vuestic-admin"` → `"name": "tourcraft"`
- `"version": "3.1.0"` → `"version": "0.1.0"`

- [ ] **Step 11.3: Verify browser tab title**

Refresh `http://localhost:5173/`. Browser tab should show "TourCraft" (Vite reflects HTML changes immediately).

- [ ] **Step 11.4: Commit**

```bash
git add index.html package.json
git commit -m "chore(brand): rename to TourCraft, reset version to 0.1.0"
```

---

## Task 12: Visual checkpoint — IA shell complete

**No file changes.** A pause to confirm the layout shell, navigation, and routing are all working before we move to widget construction and demo cleanup.

- [ ] **Step 12.1: Refresh `http://localhost:5173/`**

- [ ] **Step 12.2: Walk the IA**

Click each of the 10 sidebar items in order. For each, confirm:

- The URL becomes `/<slug>` (e.g., `/tour-dates`)
- The page renders `<PagePlaceholder>` with the correct title (e.g., "Tour Dates")
- The "Coming soon — detailed design pending." panel renders inside a dashed border
- The active sidebar item highlights
- No console errors

- [ ] **Step 12.3: Confirm topbar matches the mock layout**

- Left: hamburger toggle (only visible on narrow widths) + global search input filling the available space
- Right: bell icon, profile avatar showing "Jane Manager" (open dropdown to verify)
- No VuesticLogo, no GitHub icon, no Discord icon, no locale switcher

- [ ] **Step 12.4: Confirm 404 still works**

Visit `http://localhost:5173/unknown-route`. NotFound page renders. Click "Back to Dashboard" — returns to `/dashboard`.

If anything in steps 12.2–12.4 fails, fix in a small follow-up commit before moving on.

---

## Task 13: Delete demo files

**Files:**

- Delete: `src/pages/{404.vue,admin/,auth/,billing/,faq/,payments/,preferences/,pricing-plans/,projects/,settings/,users/}`
- Delete: `src/components/{typography/,va-charts/,va-medium-editor/,va-timeline-item.vue,VuesticLogo.vue,VuesticLogo.stories.ts,NotFoundImage.vue}`
- Delete: `src/components/navbar/components/GitHubButton.vue`
- Delete: `src/components/icons/VaIconDiscord.vue`
- Delete: `src/i18n/locales/{br.json,cn.json,es.json,ir.json}`
- Delete: `src/data/{charts/,CountriesList.ts,geo.json,pages/,users.json}`
- Delete: `.storybook/`
- Delete: `e2e/`
- Delete: `public/vuestic-admin-image.png`
- Delete: `docs/pre-production.md`

**Important:** do NOT delete `src/components/icons/` wholesale. Keep all files in `src/components/icons/` EXCEPT `VaIconDiscord.vue` — `AppLayoutNavigation.vue` imports `VaIconMenuCollapsed.vue` from there.

- [ ] **Step 13.1: Verify no surviving imports of files about to be deleted**

Run each, expect zero output:

```bash
grep -rln "VuesticLogo" src/
grep -rln "VaIconDiscord" src/
grep -rln "GitHubButton\|GithubButton" src/
grep -rln "components/typography\|components/va-charts\|components/va-medium-editor\|va-timeline-item" src/
grep -rln "data/charts\|CountriesList\|users.json\|geo.json\|data/pages" src/
grep -rln "NotFoundImage" src/
grep -rln "vuestic-admin-image\.png" src/ index.html public/
```

If any returns hits, that's a surviving consumer — fix it before deleting (likely a missed reference in a kept file). If grep returns clean, proceed.

- [ ] **Step 13.2: Delete demo pages**

```bash
rm src/pages/404.vue
rm -rf src/pages/admin src/pages/auth src/pages/billing src/pages/faq src/pages/payments src/pages/preferences src/pages/pricing-plans src/pages/projects src/pages/settings src/pages/users
```

- [ ] **Step 13.3: Delete demo components**

```bash
rm -rf src/components/typography src/components/va-charts src/components/va-medium-editor
rm src/components/va-timeline-item.vue src/components/VuesticLogo.vue src/components/VuesticLogo.stories.ts src/components/NotFoundImage.vue
rm src/components/navbar/components/GitHubButton.vue
rm src/components/icons/VaIconDiscord.vue
```

- [ ] **Step 13.4: Delete non-en locales**

```bash
rm src/i18n/locales/br.json src/i18n/locales/cn.json src/i18n/locales/es.json src/i18n/locales/ir.json
```

- [ ] **Step 13.5: Delete demo data**

```bash
rm -rf src/data/charts src/data/pages
rm src/data/CountriesList.ts src/data/geo.json src/data/users.json
```

- [ ] **Step 13.6: Delete tooling and assets**

```bash
rm -rf .storybook e2e
rm public/vuestic-admin-image.png
rm docs/pre-production.md
```

- [ ] **Step 13.7: Verify dev server still boots cleanly**

Watch the dev log. If you see `Failed to resolve import "..."` referencing any of the deleted paths, that's a kept consumer that grep missed. Re-grep with the exact missing path and fix the consumer. Restart the dev server only if HMR gets stuck.

- [ ] **Step 13.8: Verify the IA still works in the browser**

Refresh `http://localhost:5173/dashboard`. Sidebar still shows the 10 TourCraft items. Each navigates correctly. 404 still works. No console errors.

- [ ] **Step 13.9: Commit**

```bash
git add -A
git commit -m "chore: delete Vuestic Admin demo pages, components, data, locales, and tooling"
```

---

## Task 14: Uninstall demo deps + remove demo scripts

**Files:**

- Modify: `package.json` (deps + devDeps + scripts + workspaces)

- [ ] **Step 14.1: Uninstall runtime deps**

```bash
npm uninstall medium-editor chartjs-chart-geo flag-icons ionicons register-service-worker @gtm-support/vue-gtm
```

- [ ] **Step 14.2: Uninstall paired devDeps**

```bash
npm uninstall @types/medium-editor @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-links @storybook/blocks @storybook/testing-library @storybook/vue3 @storybook/vue3-vite storybook eslint-plugin-storybook
```

- [ ] **Step 14.3: Edit `package.json` — remove demo scripts and workspace**

Open `package.json`. In the `"scripts"` block, remove:

- `"storybook": "storybook dev -p 6006"`
- `"build-storybook": "storybook build"`
- `"e2e": "yarn workspace e2e test"`
- `"e2e:update-snapshots": "yarn workspace e2e update"`

Remove the `"workspaces": ["e2e"]` field entirely (top-level).

The `"scripts"` block after editing should contain only: `prepare`, `dev`, `build`, `build:ci`, `start:ci`, `prelint`, `lint`, `format`, `preview`. (`lint-staged` config and other top-level fields stay.)

- [ ] **Step 14.4: Verify dev server still boots**

The dev server should hot-reload package changes. If it doesn't, restart: kill the dev shell and run `npm run dev` again. Should boot clean.

- [ ] **Step 14.5: Verify production build (skipping lint/tsc)**

Run: `npm run build:ci`
Expected: `✓ built in <duration>`. No warnings about missing modules from removed deps.

If `build:ci` errors with "Cannot find module ..." referencing one of the uninstalled packages, that's a missed import — grep the package name and remove the consumer.

- [ ] **Step 14.6: Commit**

```bash
git add package.json package-lock.json yarn.lock
git commit -m "chore(deps): uninstall demo runtime + Storybook devDeps; drop e2e workspace"
```

---

## Task 15: Dashboard widget — KpiTile

**Files:**

- Create: `src/components/dashboard/KpiTile.vue`

First of 8 dashboard widgets. After creating, mount it temporarily in `Dashboard.vue` for visual verification, then leave that wiring in place — Task 22 finalizes the full Dashboard composition.

- [ ] **Step 15.1: Create `src/components/dashboard/KpiTile.vue`**

```vue
<!-- src/components/dashboard/KpiTile.vue -->
<template>
  <VaCard class="kpi-tile">
    <div class="kpi-tile__head">
      <VaIcon :name="icon" size="20px" color="secondary" />
      <span class="kpi-tile__label">{{ label }}</span>
    </div>
    <div class="kpi-tile__value">{{ value }}</div>
    <div class="kpi-tile__sub">{{ sub }}</div>
  </VaCard>
</template>

<script setup lang="ts">
import type { Kpi } from '../../data/types'

defineProps<Kpi>()
</script>

<style scoped lang="scss">
.kpi-tile {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.kpi-tile__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.kpi-tile__label {
  font-size: 0.875rem;
  color: var(--va-secondary);
}

.kpi-tile__value {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.kpi-tile__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
</style>
```

- [ ] **Step 15.2: Mount it in Dashboard.vue for visual verification**

Replace `src/pages/Dashboard.vue` contents with:

```vue
<!-- src/pages/Dashboard.vue (in-progress; widgets being composed one at a time) -->
<template>
  <div class="dashboard-page">
    <PageHeader title="Tour Dashboard" subtitle="Today / Command Center" />

    <section class="kpi-row">
      <KpiTile v-for="k in kpis" :key="k.label" v-bind="k" />
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import KpiTile from '../components/dashboard/KpiTile.vue'
import { kpis } from '../data/dashboard'
</script>

<style scoped lang="scss">
.dashboard-page {
  padding: 1.5rem;
}

.kpi-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
```

- [ ] **Step 15.3: Verify visually**

Refresh `/dashboard`. Should now show "Tour Dashboard" header + a 4-up row of KPI tiles: "Upcoming Shows 12", "Cities This Run 8", "Open Tasks 17", "Missing Confirmations 6". Each has a small icon, the label, the big number, the sub-label. Layout collapses to 2-up on tablet, 1-up on mobile.

- [ ] **Step 15.4: Commit**

```bash
git add src/components/dashboard/KpiTile.vue src/pages/Dashboard.vue
git commit -m "feat(dashboard): add KpiTile widget + KPI row in Dashboard"
```

---

## Task 16: Dashboard widget — Next72HoursCard

**Files:**

- Create: `src/components/dashboard/Next72HoursCard.vue`

- [ ] **Step 16.1: Create `src/components/dashboard/Next72HoursCard.vue`**

```vue
<!-- src/components/dashboard/Next72HoursCard.vue -->
<template>
  <VaCard class="next72">
    <div class="next72__head">
      <VaIcon name="mso-schedule" size="18px" color="secondary" />
      <span class="next72__title">Next 72 Hours</span>
    </div>

    <ul class="next72__list">
      <li v-for="show in shows" :key="show.id" class="next72__row">
        <div class="next72__when">
          <div class="next72__date">{{ formatShortDate(show.date) }}</div>
          <div class="next72__time">{{ show.time }}</div>
        </div>
        <div class="next72__where">
          <div class="next72__city">{{ show.city }}</div>
          <div class="next72__venue">{{ show.venue }}</div>
        </div>
        <VaIcon name="mso-chevron_right" size="18px" color="secondary" />
      </li>
    </ul>

    <div class="next72__footer">
      <VaButton preset="secondary" size="small">View all shows →</VaButton>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { ShowSummary } from '../../data/types'
import { formatShortDate } from '../../data/format'

defineProps<{ shows: ShowSummary[] }>()
</script>

<style scoped lang="scss">
.next72 {
  padding: 1.25rem;
}

.next72__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.next72__title {
  font-weight: 600;
  font-size: 0.95rem;
}

.next72__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.next72__row {
  display: grid;
  grid-template-columns: minmax(7rem, auto) 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);

  &:last-child {
    border-bottom: none;
  }
}

.next72__date {
  font-weight: 600;
  font-size: 0.875rem;
}

.next72__time {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.next72__city {
  font-weight: 600;
  font-size: 0.875rem;
}

.next72__venue {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.next72__footer {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-start;
}
</style>
```

- [ ] **Step 16.2: Add it to Dashboard.vue (alongside KPI row)**

In `src/pages/Dashboard.vue`, just after the closing `</section>` of `kpi-row`, add a new `row-2` section that contains the Next72HoursCard. Update the `<script setup>` imports + data.

The Dashboard.vue body to use now:

```vue
<template>
  <div class="dashboard-page">
    <PageHeader title="Tour Dashboard" subtitle="Today / Command Center" />

    <section class="kpi-row">
      <KpiTile v-for="k in kpis" :key="k.label" v-bind="k" />
    </section>

    <section class="row-2">
      <Next72HoursCard :shows="next72h" />
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import KpiTile from '../components/dashboard/KpiTile.vue'
import Next72HoursCard from '../components/dashboard/Next72HoursCard.vue'
import { kpis, next72h } from '../data/dashboard'
</script>

<style scoped lang="scss">
.dashboard-page {
  padding: 1.5rem;
}

.kpi-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.row-2 {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
  margin-top: 1rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
```

- [ ] **Step 16.3: Verify visually**

Refresh `/dashboard`. Below the KPI row, you should see the "Next 72 Hours" card with three rows: Tue May 20 / 7:30 PM / Nashville TN / The Ryman; Wed May 21 / 8:00 PM / Atlanta GA / Tabernacle; Thu May 22 / 7:00 PM / New Orleans LA / The Fillmore. Each row has a chevron at the right. Footer has "View all shows →" button.

- [ ] **Step 16.4: Commit**

```bash
git add src/components/dashboard/Next72HoursCard.vue src/pages/Dashboard.vue
git commit -m "feat(dashboard): add Next72HoursCard widget"
```

---

## Task 17: Dashboard widget — TodayTimelineCard

**Files:**

- Create: `src/components/dashboard/TodayTimelineCard.vue`

- [ ] **Step 17.1: Create `src/components/dashboard/TodayTimelineCard.vue`**

```vue
<!-- src/components/dashboard/TodayTimelineCard.vue -->
<template>
  <VaCard class="today">
    <div class="today__head">
      <VaIcon name="mso-schedule" size="18px" color="secondary" />
      <span class="today__title">Today — {{ formatShortDate(date) }}</span>
    </div>

    <ul class="today__timeline">
      <li v-for="ev in events" :key="ev.id" class="today__item">
        <div class="today__rail">
          <span class="today__dot" />
        </div>
        <div class="today__time">{{ ev.time }}</div>
        <div class="today__body">
          <div class="today__name">{{ ev.title }}</div>
          <div class="today__sub">{{ ev.sub }}</div>
        </div>
      </li>
    </ul>

    <div class="today__footer">
      <VaButton preset="secondary" size="small">View full day →</VaButton>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { TimelineEvent } from '../../data/types'
import { formatShortDate } from '../../data/format'

defineProps<{
  date: string
  events: TimelineEvent[]
}>()
</script>

<style scoped lang="scss">
.today {
  padding: 1.25rem;
}

.today__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.today__title {
  font-weight: 600;
  font-size: 0.95rem;
}

.today__timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.today__item {
  display: grid;
  grid-template-columns: 1.25rem 4rem 1fr;
  gap: 0.75rem;
  align-items: start;
  padding: 0.5rem 0;
  position: relative;
}

.today__rail {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--va-background-border);
  }
}

.today__item:first-child .today__rail::before {
  top: 0.5rem;
}

.today__item:last-child .today__rail::before {
  bottom: calc(100% - 0.5rem);
}

.today__dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: var(--va-primary);
  margin-top: 0.5rem;
  z-index: 1;
}

.today__time {
  font-size: 0.8125rem;
  font-weight: 600;
  padding-top: 0.25rem;
}

.today__name {
  font-size: 0.875rem;
  font-weight: 600;
}

.today__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.today__footer {
  margin-top: 1rem;
}
</style>
```

- [ ] **Step 17.2: Add to Dashboard.vue's `row-2`**

Update the `<template>` in `src/pages/Dashboard.vue`:

```vue
<section class="row-2">
      <Next72HoursCard :shows="next72h" />
      <TodayTimelineCard :date="todayDate" :events="todayTimeline" />
    </section>
```

Update imports:

```ts
import TodayTimelineCard from '../components/dashboard/TodayTimelineCard.vue'
import { kpis, next72h, todayDate, todayTimeline } from '../data/dashboard'
```

- [ ] **Step 17.3: Verify visually**

Refresh `/dashboard`. Mid row now shows two cards side-by-side: "Next 72 Hours" + "Today — Tue, May 20" with a vertical timeline (5 events: Load-In 9 AM, Soundcheck 11 AM, Dinner 5 PM, Show 7:30 PM, Load-Out 11 PM), each with a dot marker and connecting rail.

- [ ] **Step 17.4: Commit**

```bash
git add src/components/dashboard/TodayTimelineCard.vue src/pages/Dashboard.vue
git commit -m "feat(dashboard): add TodayTimelineCard widget"
```

---

## Task 18: Dashboard widget — TravelHotelCard

**Files:**

- Create: `src/components/dashboard/TravelHotelCard.vue`

- [ ] **Step 18.1: Create `src/components/dashboard/TravelHotelCard.vue`**

```vue
<!-- src/components/dashboard/TravelHotelCard.vue -->
<template>
  <VaCard class="travel">
    <div class="travel__head">
      <VaIcon name="mso-luggage" size="18px" color="secondary" />
      <span class="travel__title">Travel & Hotel</span>
    </div>

    <ul class="travel__list">
      <li v-for="leg in legs" :key="leg.kind" class="travel__row">
        <VaIcon :name="iconFor(leg.kind)" size="18px" color="secondary" />
        <div class="travel__kind">{{ leg.kind }}</div>
        <div class="travel__body">
          <div class="travel__primary">{{ leg.primary }}</div>
          <div class="travel__sub">{{ leg.sub }}</div>
        </div>
        <VaBadge :text="leg.status" color="success" class="travel__badge" />
        <VaIcon name="mso-chevron_right" size="18px" color="secondary" />
      </li>
    </ul>

    <div class="travel__footer">
      <VaButton preset="secondary" size="small">View all travel →</VaButton>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { TravelLeg } from '../../data/types'

defineProps<{ legs: TravelLeg[] }>()

function iconFor(kind: TravelLeg['kind']): string {
  switch (kind) {
    case 'Flight':
      return 'mso-flight'
    case 'Hotel':
      return 'mso-hotel'
    case 'Ground':
      return 'mso-directions_car'
  }
}
</script>

<style scoped lang="scss">
.travel {
  padding: 1.25rem;
}

.travel__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.travel__title {
  font-weight: 600;
  font-size: 0.95rem;
}

.travel__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.travel__row {
  display: grid;
  grid-template-columns: 1.5rem 4rem 1fr auto auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);

  &:last-child {
    border-bottom: none;
  }
}

.travel__kind {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.travel__primary {
  font-size: 0.875rem;
  font-weight: 600;
}

.travel__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.travel__badge {
  font-size: 0.75rem;
}

.travel__footer {
  margin-top: 1rem;
}
</style>
```

- [ ] **Step 18.2: Add to Dashboard.vue's `row-2`**

```vue
<section class="row-2">
      <Next72HoursCard :shows="next72h" />
      <TodayTimelineCard :date="todayDate" :events="todayTimeline" />
      <TravelHotelCard :legs="travelLegs" />
    </section>
```

```ts
import TravelHotelCard from '../components/dashboard/TravelHotelCard.vue'
import { kpis, next72h, todayDate, todayTimeline, travelLegs } from '../data/dashboard'
```

- [ ] **Step 18.3: Verify visually**

Refresh `/dashboard`. The `row-2` should now have three cards across (on lg). The third is "Travel & Hotel" with three rows (Flight ATL → BNA / Hotel Grand Hyatt Nashville / Ground Airport Pickup), each with an icon, kind label, primary text, sub text, "Confirmed" badge, and trailing chevron.

- [ ] **Step 18.4: Commit**

```bash
git add src/components/dashboard/TravelHotelCard.vue src/pages/Dashboard.vue
git commit -m "feat(dashboard): add TravelHotelCard widget"
```

---

## Task 19: Dashboard widget — QuickContactsCard

**Files:**

- Create: `src/components/dashboard/QuickContactsCard.vue`

- [ ] **Step 19.1: Create `src/components/dashboard/QuickContactsCard.vue`**

```vue
<!-- src/components/dashboard/QuickContactsCard.vue -->
<template>
  <VaCard class="contacts">
    <div class="contacts__head">
      <VaIcon name="mso-group" size="18px" color="secondary" />
      <span class="contacts__title">Quick Contacts</span>
    </div>

    <ul class="contacts__list">
      <li v-for="c in contacts" :key="c.role" class="contacts__row">
        <div class="contacts__role">{{ c.role }}</div>
        <div class="contacts__name">{{ c.name }}</div>
        <div class="contacts__phone">{{ c.phone }}</div>
        <div class="contacts__actions">
          <VaButton preset="secondary" size="small" icon="mso-call" :aria-label="`Call ${c.name}`" />
          <VaButton preset="secondary" size="small" icon="mso-mail" :aria-label="`Email ${c.name}`" />
        </div>
      </li>
    </ul>

    <div class="contacts__footer">
      <VaButton preset="secondary" size="small">View all contacts →</VaButton>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { QuickContact } from '../../data/types'

defineProps<{ contacts: QuickContact[] }>()
</script>

<style scoped lang="scss">
.contacts {
  padding: 1.25rem;
}

.contacts__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.contacts__title {
  font-weight: 600;
  font-size: 0.95rem;
}

.contacts__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contacts__row {
  display: grid;
  grid-template-columns: 7rem 1fr auto auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);

  &:last-child {
    border-bottom: none;
  }
}

.contacts__role {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.contacts__name {
  font-size: 0.875rem;
  font-weight: 600;
}

.contacts__phone {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  white-space: nowrap;
}

.contacts__actions {
  display: flex;
  gap: 0.25rem;
}

.contacts__footer {
  margin-top: 1rem;
}
</style>
```

- [ ] **Step 19.2: Add to Dashboard.vue (new `row-3` section)**

In `src/pages/Dashboard.vue`, after `row-2`, add `row-3`:

```vue
<section class="row-3">
      <QuickContactsCard :contacts="quickContacts" />
    </section>
```

```ts
import QuickContactsCard from '../components/dashboard/QuickContactsCard.vue'
import { kpis, next72h, todayDate, todayTimeline, travelLegs, quickContacts } from '../data/dashboard'
```

Add to the `<style>` block:

```scss
.row-3 {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
  margin-top: 1rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

- [ ] **Step 19.3: Verify visually**

Refresh `/dashboard`. A new third row appears below `row-2`, currently containing only the "Quick Contacts" card with 4 rows: Venue Manager / Sarah Williams / (615) 889-3060 + call + email icon buttons; same for Promoter / Driver / Hotel.

- [ ] **Step 19.4: Commit**

```bash
git add src/components/dashboard/QuickContactsCard.vue src/pages/Dashboard.vue
git commit -m "feat(dashboard): add QuickContactsCard widget"
```

---

## Task 20: Dashboard widget — OpenIssuesCard

**Files:**

- Create: `src/components/dashboard/OpenIssuesCard.vue`

- [ ] **Step 20.1: Create `src/components/dashboard/OpenIssuesCard.vue`**

```vue
<!-- src/components/dashboard/OpenIssuesCard.vue -->
<template>
  <VaCard class="issues">
    <div class="issues__head">
      <VaIcon name="mso-warning" size="18px" color="secondary" />
      <span class="issues__title">Open Issues</span>
    </div>

    <ul class="issues__list">
      <li v-for="issue in issues" :key="issue.id" class="issues__row">
        <span class="issues__dot" :class="severityTokens[issue.severity].dot" />
        <div class="issues__body">
          <div class="issues__name">{{ issue.title }}</div>
          <div class="issues__sub">{{ issue.sub }}</div>
        </div>
        <span class="issues__pill" :class="[severityTokens[issue.severity].bg, severityTokens[issue.severity].text]">
          {{ issue.severity }}
        </span>
      </li>
    </ul>

    <div class="issues__footer">
      <VaButton preset="secondary" size="small">View all issues →</VaButton>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { Issue } from '../../data/types'
import { severityTokens } from '../../data/severity'

defineProps<{ issues: Issue[] }>()
</script>

<style scoped lang="scss">
.issues {
  padding: 1.25rem;
}

.issues__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.issues__title {
  font-weight: 600;
  font-size: 0.95rem;
}

.issues__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.issues__row {
  display: grid;
  grid-template-columns: 0.625rem 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);

  &:last-child {
    border-bottom: none;
  }
}

.issues__dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
}

.issues__name {
  font-size: 0.875rem;
  font-weight: 600;
}

.issues__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.issues__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.issues__footer {
  margin-top: 1rem;
}
</style>
```

- [ ] **Step 20.2: Add to Dashboard.vue's `row-3`**

```vue
<section class="row-3">
      <QuickContactsCard :contacts="quickContacts" />
      <OpenIssuesCard :issues="openIssues" />
    </section>
```

```ts
import OpenIssuesCard from '../components/dashboard/OpenIssuesCard.vue'
import { kpis, next72h, todayDate, todayTimeline, travelLegs, quickContacts, openIssues } from '../data/dashboard'
```

- [ ] **Step 20.3: Verify visually**

Refresh `/dashboard`. `row-3` now has two cards: Quick Contacts + Open Issues. Issues show 3 rows with severity-tinted dots on the left and severity-tinted pills on the right (red High, amber Medium, slate Low).

- [ ] **Step 20.4: Commit**

```bash
git add src/components/dashboard/OpenIssuesCard.vue src/pages/Dashboard.vue
git commit -m "feat(dashboard): add OpenIssuesCard widget with severity pills"
```

---

## Task 21: Dashboard widget — UpcomingShowsTable

**Files:**

- Create: `src/components/dashboard/UpcomingShowsTable.vue`

- [ ] **Step 21.1: Create `src/components/dashboard/UpcomingShowsTable.vue`**

```vue
<!-- src/components/dashboard/UpcomingShowsTable.vue -->
<template>
  <VaCard class="ushows">
    <div class="ushows__head">
      <VaIcon name="mso-confirmation_number" size="18px" color="secondary" />
      <span class="ushows__title">Upcoming Shows</span>
    </div>

    <table class="ushows__table">
      <thead>
        <tr>
          <th>Date</th>
          <th>City</th>
          <th>Venue</th>
          <th class="ushows__num">Advance</th>
          <th>Travel</th>
          <th>Settlement</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="show in shows" :key="show.id">
          <td>{{ formatShortDate(show.date) }}</td>
          <td>{{ show.city }}</td>
          <td>{{ show.venue }}</td>
          <td class="ushows__num">{{ show.advanceUsd != null ? formatUsd(show.advanceUsd) : '—' }}</td>
          <td>
            <VaBadge
              v-if="show.travel"
              :text="show.travel"
              :color="show.travel === 'Confirmed' ? 'success' : 'warning'"
            />
          </td>
          <td>{{ show.settlement }}</td>
        </tr>
      </tbody>
    </table>

    <div class="ushows__footer">
      <VaButton preset="secondary" size="small">View all shows →</VaButton>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { ShowSummary } from '../../data/types'
import { formatShortDate, formatUsd } from '../../data/format'

defineProps<{ shows: ShowSummary[] }>()
</script>

<style scoped lang="scss">
.ushows {
  padding: 1.25rem;
}

.ushows__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.ushows__title {
  font-weight: 600;
  font-size: 0.95rem;
}

.ushows__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;

  th,
  td {
    text-align: left;
    padding: 0.5rem 0.5rem;
    border-bottom: 1px solid var(--va-background-border);
  }

  th {
    color: var(--va-secondary);
    font-weight: 500;
    font-size: 0.75rem;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
}

.ushows__num {
  text-align: right;
}

.ushows__footer {
  margin-top: 1rem;
}
</style>
```

- [ ] **Step 21.2: Add to Dashboard.vue's `row-3`**

```vue
<section class="row-3">
      <QuickContactsCard :contacts="quickContacts" />
      <OpenIssuesCard :issues="openIssues" />
      <UpcomingShowsTable :shows="upcomingShows" />
    </section>
```

```ts
import UpcomingShowsTable from '../components/dashboard/UpcomingShowsTable.vue'
import {
  kpis,
  next72h,
  todayDate,
  todayTimeline,
  travelLegs,
  quickContacts,
  openIssues,
  upcomingShows,
} from '../data/dashboard'
```

- [ ] **Step 21.3: Verify visually**

Refresh `/dashboard`. `row-3` now has three cards across: Quick Contacts + Open Issues + Upcoming Shows. The table shows 5 rows with date, city, venue, right-aligned advance ($65,000…$48,000), travel badge (4× Confirmed green, 1× Pending amber), settlement column showing "—".

- [ ] **Step 21.4: Commit**

```bash
git add src/components/dashboard/UpcomingShowsTable.vue src/pages/Dashboard.vue
git commit -m "feat(dashboard): add UpcomingShowsTable widget"
```

---

## Task 22: Dashboard widget — RecentNotesCard

**Files:**

- Create: `src/components/dashboard/RecentNotesCard.vue`

- [ ] **Step 22.1: Create `src/components/dashboard/RecentNotesCard.vue`**

```vue
<!-- src/components/dashboard/RecentNotesCard.vue -->
<template>
  <VaCard class="notes">
    <div class="notes__head">
      <VaIcon name="mso-sticky_note_2" size="18px" color="secondary" />
      <span class="notes__title">Recent Notes</span>
    </div>

    <ul class="notes__list">
      <li v-for="note in notes" :key="note.id" class="notes__row">
        <div class="notes__body">{{ note.body }}</div>
        <div class="notes__meta">
          <span class="notes__when">{{ formatShortDate(note.at.slice(0, 10)) }}, {{ formatTimeFromIso(note.at) }}</span>
          <VaAvatar size="small" color="secondary">{{ note.authorInitials }}</VaAvatar>
        </div>
      </li>
    </ul>

    <div class="notes__footer">
      <VaButton preset="secondary" size="small">View all notes →</VaButton>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { NoteEntry } from '../../data/types'
import { formatShortDate, formatTimeFromIso } from '../../data/format'

defineProps<{ notes: NoteEntry[] }>()
</script>

<style scoped lang="scss">
.notes {
  padding: 1.25rem;
}

.notes__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.notes__title {
  font-weight: 600;
  font-size: 0.95rem;
}

.notes__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notes__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: start;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--va-background-border);

  &:last-child {
    border-bottom: none;
  }
}

.notes__body {
  font-size: 0.875rem;
  line-height: 1.4;
}

.notes__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  white-space: nowrap;
}

.notes__when {
  font-size: 0.75rem;
  color: var(--va-secondary);
}

.notes__footer {
  margin-top: 1rem;
}
</style>
```

- [ ] **Step 22.2: Add to Dashboard.vue (full-width below `row-3`)**

Final Dashboard.vue contents:

```vue
<!-- src/pages/Dashboard.vue -->
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

    <RecentNotesCard :notes="recentNotes" class="recent-notes" />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import KpiTile from '../components/dashboard/KpiTile.vue'
import Next72HoursCard from '../components/dashboard/Next72HoursCard.vue'
import TodayTimelineCard from '../components/dashboard/TodayTimelineCard.vue'
import TravelHotelCard from '../components/dashboard/TravelHotelCard.vue'
import QuickContactsCard from '../components/dashboard/QuickContactsCard.vue'
import OpenIssuesCard from '../components/dashboard/OpenIssuesCard.vue'
import UpcomingShowsTable from '../components/dashboard/UpcomingShowsTable.vue'
import RecentNotesCard from '../components/dashboard/RecentNotesCard.vue'
import {
  kpis,
  next72h,
  todayDate,
  todayTimeline,
  travelLegs,
  quickContacts,
  openIssues,
  upcomingShows,
  recentNotes,
} from '../data/dashboard'
</script>

<style scoped lang="scss">
.dashboard-page {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.kpi-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.row-2 {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.row-3 {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.recent-notes {
  width: 100%;
}
</style>
```

> Note: collapsed the `margin-top: 1rem` on `row-2`/`row-3` because `.dashboard-page` now provides `gap: 1rem` between sections — keeps spacing consistent with the rest of the page.

- [ ] **Step 22.3: Verify visually**

Refresh `/dashboard`. The full Dashboard now renders:

1. Header: "Tour Dashboard" / "Today / Command Center"
2. KPI row: 4 tiles
3. Row 2: Next 72 Hours / Today timeline / Travel & Hotel
4. Row 3: Quick Contacts / Open Issues / Upcoming Shows table
5. Below: Recent Notes (full width) with 3 entries, each with body text + right-aligned timestamp + JM avatar

Compare side-by-side with the reference mock — layout, copy, structure match. Pixel parity is not required (wireframe fidelity).

- [ ] **Step 22.4: Commit**

```bash
git add src/components/dashboard/RecentNotesCard.vue src/pages/Dashboard.vue
git commit -m "feat(dashboard): add RecentNotesCard widget; complete Dashboard composition"
```

---

## Task 23: Final verification — DoD walkthrough

**No file changes** unless issues are found. This task walks the spec's Definition of Done.

- [ ] **Step 23.1: Dev server boots clean**

Verify the running dev server has no warnings about missing modules. If you killed the dev shell at any point, restart with `npm run dev` and confirm clean boot.

- [ ] **Step 23.2: Production build succeeds**

Run: `npm run build:ci`
Expected: `✓ built in <duration>`. Output written to `dist/`. No errors.

- [ ] **Step 23.3: `/` redirects to `/dashboard`**

In the browser, navigate to `http://localhost:5173/`. URL becomes `/dashboard`. Dashboard renders.

- [ ] **Step 23.4: Dashboard mock parity**

Open the reference mock side-by-side with `/dashboard`. Walk each widget and confirm copy + layout match (numbers, names, dates, badges, severity colors). Where formatting differs cosmetically (font weights, spacing) but meaning matches, mark passing — wireframe fidelity is the bar, not pixel parity.

- [ ] **Step 23.5: Sidebar navigation**

Click each of the 10 sidebar items in order:

- Dashboard renders the full mock
- Tour Dates, Shows, Itinerary, Travel, Contacts, Tasks, Documents, Settlements, Notes — each renders `<PagePlaceholder>` with the section name + "Coming soon — detailed design pending."
- Active item highlights as you navigate

- [ ] **Step 23.6: Topbar**

Confirm: hamburger toggle (mobile), `<NavbarSearch>` filling the left slot with the placeholder text, bell (NotificationDropdown), profile menu reading "Jane Manager." No VuesticLogo, no GitHub button, no Discord icon.

- [ ] **Step 23.7: 404**

Visit `http://localhost:5173/no-such-route`. NotFound page renders with the back-link.

- [ ] **Step 23.8: No broken imports**

Run each, expect zero output:

```bash
grep -rln "VuesticLogo\|VaIconDiscord\|GitHubButton\|GithubButton" src/
grep -rln "components/typography\|components/va-charts\|components/va-medium-editor\|va-timeline-item" src/
grep -rln "data/charts\|CountriesList\|users.json\|geo.json\|data/pages" src/
grep -rln "@gtm-support\|register-service-worker\|chartjs-chart-geo\|flag-icons\|ionicons\|medium-editor" src/
```

If anything returns a hit, fix the consumer in a small follow-up commit.

- [ ] **Step 23.9: No demo Vuestic content remains**

Run: `ls src/pages/`
Expected: only `Dashboard.vue`, `TourDates.vue`, `Shows.vue`, `Itinerary.vue`, `Travel.vue`, `Contacts.vue`, `Tasks.vue`, `Documents.vue`, `Settlements.vue`, `Notes.vue`, `NotFound.vue`. No demo subdirs.

Run: `ls .storybook e2e 2>/dev/null`
Expected: both directories absent.

Run: `ls src/i18n/locales/`
Expected: only `gb.json`.

- [ ] **Step 23.10: Final commit (if any fixes were applied)**

If steps 23.1–23.9 surfaced any issues you fixed:

```bash
git add -A
git commit -m "fix: address remaining items from final verification"
```

If everything passed cleanly, no commit needed.

- [ ] **Step 23.11: Tag the milestone (optional but useful)**

```bash
git tag -a v0.1.0-skeleton -m "TourCraft Dashboard skeleton + IA shell complete"
```

---

## Spec coverage map

For each major item in the spec, the implementing task:

| Spec section                                   | Implementing task(s)    |
| ---------------------------------------------- | ----------------------- |
| §3 In scope #1 (strip demo content)            | Tasks 13, 14            |
| §3 In scope #2 (rewrite NavigationRoutes)      | Task 4                  |
| §3 In scope #3 (rewrite router)                | Task 5                  |
| §3 In scope #4 (rebrand chrome)                | Tasks 7, 11             |
| §3 In scope #5 (build Dashboard)               | Tasks 15–22             |
| §3 In scope #6 (stub 9 sections)               | Tasks 2, 3              |
| §3 In scope #7 (mock data)                     | Task 1                  |
| §3 In scope #8 (verify dev boots, mock parity) | Tasks 12, 23            |
| §4 file layout                                 | Tasks 1–3, 6, 11, 15–22 |
| §5 routing                                     | Task 5                  |
| §6 NavigationRoutes + topbar                   | Tasks 4, 6, 7, 8, 9     |
| §7 widget specs                                | Tasks 15–22             |
| §8 mock data shape                             | Task 1                  |
| §9 cleanup ops (deletes, code edits, deps)     | Tasks 8, 9, 10, 13, 14  |
| §10 branding                                   | Tasks 7, 11             |
| §11 Definition of Done                         | Task 23                 |

---

_End of plan. Begin execution at Pre-flight P.1._
