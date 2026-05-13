# TourCraft Global Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `/dashboard` with the Global Dashboard view per spec `2026-05-13-tourcraft-global-dashboard-design.md`. Multi-artist roster view with 5 KPIs, 8 widgets, and 3 stub routes for click-through destinations.

**Architecture:** Clean replacement. New `Artist*` types appended to `src/data/types.ts`. New `vaBadgeTokens` sibling export in `src/data/severity.ts` (does NOT modify the existing Tailwind-class-shaped `statusTokens`). New fixture `src/data/globalDashboard.ts`. 8 new widget components under `src/components/dashboard/`. 3 new stub pages (`Artists`, `ArtistDetail`, `Issues`). 3 new routes. 1 new sidebar entry under Tasks. 1 new i18n key. After everything is wired and dev-server-clean: inline `todayTimeline` + `quickContacts` into `src/data/shows.ts` and delete `data/dashboard.ts` plus the 7 old widget files.

**Tech stack:** Vue 3.5 + Vite 5 + TypeScript + Vuestic UI 1.10 + Tailwind 3.4 + SCSS + Pinia 2 + Vue Router 4 + vue-i18n 9.

**Spec reference:** `docs/superpowers/specs/2026-05-13-tourcraft-global-dashboard-design.md` (HEAD `24cbc6f` or descendant).

**Test posture:** No unit/e2e tests this iteration (no test infra in repo; matches prior plans). Verification per task: `npm run dev` boots clean, targeted `grep` checks, `vue-tsc --noEmit` clean by end of plan, and visual verification in browser at `http://localhost:5173/`.

**Implementation order rationale:** Foundation (types + tokens + fixture) → 8 widget files → stub pages + routes + sidebar + i18n → rewrite Dashboard.vue (this is when the page lights up visually) → inline-and-delete cleanup → final verification. Old `data/dashboard.ts` stays untouched until cleanup (Task 14) because the OLD `Dashboard.vue` still consumes it. After Task 13 (which rewrites Dashboard.vue), only `data/shows.ts` still imports from it — so Task 14 inlines those two values and then deletes the old fixture + 7 old widgets in a single commit.

---

## Pre-flight

- [ ] **P.1** Run `git status` — verify clean working tree (the spec at HEAD `24cbc6f` should already be committed).
- [ ] **P.2** Run `git log --oneline -3` — verify `24cbc6f` (or descendant) is HEAD.
- [ ] **P.3** Run `npm run dev` in a background shell — verify it boots clean to `http://localhost:5173/`. Leave running for the rest of the plan; widget tasks will rely on auto-reload + log inspection.
- [ ] **P.4** Run `grep -n "from './dashboard'" src/data/shows.ts` — verify the dependency we're going to fix in Task 14 is still present: should output `3:import { todayTimeline, quickContacts } from './dashboard'`.

---

## Task 1: Foundation — add Global Dashboard types to `src/data/types.ts`

**Files:**

- Modify: `src/data/types.ts` (append new section at end of file)

- [ ] **Step 1.1: Append the Global Dashboard types block to the bottom of `src/data/types.ts`**

Open `src/data/types.ts`. Locate the existing last line (currently `export interface DocsSelectedFile extends FileEntry { ... }`). Append, after the final `}` and a blank line, the following block:

```ts
// === Global Dashboard (added by spec 2026-05-13-tourcraft-global-dashboard) ===

export interface ArtistRef {
  id: string
  name: string
  tourName: string
  avatarInitials: string
}

export interface GlobalKpi {
  icon: string
  label: string
  value: string
  sub: string
  routeName: string
}

export type ArtistDayStatus = 'Show Day' | 'Travel Day' | 'Off Day' | 'Promo Day'
export type ArtistTrack = 'On Track' | 'Needs Attention' | 'At Risk'

export interface ArtistTodayRow {
  artist: ArtistRef
  city: string
  dayStatus: ArtistDayStatus
  nextUp: { title: string; sub: string }
  track: ArtistTrack
}

export type TimelineKind = 'Show' | 'Travel' | 'Deadline'

export interface GlobalTimelineEvent {
  id: string
  artistId: string
  title: string
  sub: string
  kind: TimelineKind
}

export interface GlobalTimelineGroup {
  label: string
  events: GlobalTimelineEvent[]
}

export interface CriticalIssue {
  id: string
  title: string
  artistId: string
  artistName: string
  due: string
  severity: Severity
}

export type ActionStatus = 'Open' | 'Due Today' | 'Overdue'

export interface RequiredAction {
  id: string
  title: string
  artistId: string
  artistName: string
  due: string
  status: ActionStatus
}

export type TravelWatchTag = 'Driver Not Assigned' | 'Pickup Unconfirmed' | 'Pending'

export interface TravelWatchRow {
  id: string
  primary: string
  sub: string
  artistId: string
  tag: TravelWatchTag
}

export interface WaitingOnRow {
  id: string
  title: string
  sub: string
  artistId: string
  waitingOn: string
}

export interface ArtistReadiness {
  artist: ArtistRef
  todayLabel: string
  readinessPct: number
  risks: number
  tasksDue: number
  daysToShow: number
}
```

- [ ] **Step 1.2: Verify type-check passes**

```bash
npx vue-tsc --noEmit
```

Expect: no output (success). If there are errors, they're in unrelated files; isolate ours by:

```bash
npx vue-tsc --noEmit 2>&1 | grep -i "types.ts" || echo "types.ts clean"
```

- [ ] **Step 1.3: Commit**

```bash
git add src/data/types.ts
git commit -m "feat(types): add Global Dashboard interfaces"
```

---

## Task 2: Foundation — add `vaBadgeTokens` to `src/data/severity.ts`

**Files:**

- Modify: `src/data/severity.ts` (append new export — do **not** touch existing `severityTokens` or `statusTokens`)

- [ ] **Step 2.1: Replace `src/data/severity.ts` with the merged-imports version**

Use the Write tool to overwrite `src/data/severity.ts` with this exact content (the existing `severityTokens` and `statusTokens` blocks are preserved verbatim; only the import line is expanded and two new exports are appended at the bottom):

```ts
// src/data/severity.ts — severity tokens shared across sections (Issues here, future Tasks/Alerts elsewhere)
import type {
  Severity,
  ArtistDayStatus,
  ArtistTrack,
  ActionStatus,
  TravelWatchTag,
  TimelineKind,
} from './types'

export const severityTokens: Record<Severity, { bg: string; text: string; dot: string }> = {
  High: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  Medium: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  Low: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' },
}

export const statusTokens = {
  Confirmed: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  Approved: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  Pending: { bg: 'bg-amber-100', text: 'text-amber-800' },
  'Action Needed': { bg: 'bg-amber-100', text: 'text-amber-800' },
  Missing: { bg: 'bg-red-100', text: 'text-red-800' },
  Disputed: { bg: 'bg-red-100', text: 'text-red-800' },
  Complete: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  'Need Follow-Up': { bg: 'bg-amber-100', text: 'text-amber-800' },
} as const

// === Vuestic VaBadge / VaChip color tokens (added by spec 2026-05-13-tourcraft-global-dashboard) ===

type VaColor = 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'primary'

export const vaBadgeTokens: Record<
  ArtistDayStatus | ArtistTrack | ActionStatus | TravelWatchTag,
  VaColor
> = {
  // ArtistDayStatus
  'Show Day': 'info',
  'Travel Day': 'warning',
  'Off Day': 'secondary',
  'Promo Day': 'info',
  // ArtistTrack
  'On Track': 'success',
  'Needs Attention': 'warning',
  'At Risk': 'danger',
  // ActionStatus
  Open: 'secondary',
  'Due Today': 'warning',
  Overdue: 'danger',
  // TravelWatchTag
  'Driver Not Assigned': 'danger',
  'Pickup Unconfirmed': 'warning',
  Pending: 'warning',
}

// Timeline kind → VaColor (for SHOW / TRAVEL / DEADLINE chips on the Next 72 Hours card)
export const timelineKindColor: Record<TimelineKind, VaColor> = {
  Show: 'info',
  Travel: 'warning',
  Deadline: 'danger',
}
```

- [ ] **Step 2.2: Verify existing exports are intact**

```bash
grep -n "export const severityTokens\|export const statusTokens" src/data/severity.ts
```

Expect: two lines printed — `severityTokens` and `statusTokens` both present.

- [ ] **Step 2.3: Verify new exports are present**

```bash
grep -n "export const vaBadgeTokens\|export const timelineKindColor" src/data/severity.ts
```

Expect: two lines printed.

- [ ] **Step 2.4: Type-check**

```bash
npx vue-tsc --noEmit
```

Expect: no output. (If `Pending` collides between `TravelWatchTag` and the existing app's `Pending` status, that's expected — `vaBadgeTokens` keys are typed as the union of new enums, while `statusTokens.Pending` is a separate map; no name conflict at the value level because they're different export bindings.)

- [ ] **Step 2.5: Commit**

```bash
git add src/data/severity.ts
git commit -m "feat(severity): add vaBadgeTokens + timelineKindColor for Vuestic chips"
```

---

## Task 3: Foundation — create `src/data/globalDashboard.ts` fixture

**Files:**

- Create: `src/data/globalDashboard.ts`

- [ ] **Step 3.1: Create `src/data/globalDashboard.ts` with full fixture content**

```ts
// src/data/globalDashboard.ts — fixtures for the Global Dashboard view
// Spec: docs/superpowers/specs/2026-05-13-tourcraft-global-dashboard-design.md §5
//
// Sub-labels on KPIs are verbatim from the mock; numbers are illustrative,
// not derived from the other fixtures in this file.

import type {
  ArtistRef,
  GlobalKpi,
  ArtistTodayRow,
  GlobalTimelineGroup,
  CriticalIssue,
  RequiredAction,
  TravelWatchRow,
  WaitingOnRow,
  ArtistReadiness,
} from './types'

// Shared artist registry — referenced by every fixture below to keep ids/names consistent.
export const artists: {
  baka: ArtistRef
  lunaRae: ArtistRef
  kofiJames: ArtistRef
  mayaStone: ArtistRef
} = {
  baka: { id: 'baka', name: 'Baka', tourName: 'Spring 2025 Run', avatarInitials: 'B' },
  lunaRae: { id: 'luna-rae', name: 'Luna Rae', tourName: 'Festival Run', avatarInitials: 'LR' },
  kofiJames: { id: 'kofi-james', name: 'Kofi James', tourName: 'KJ Promo Tour', avatarInitials: 'KJ' },
  mayaStone: { id: 'maya-stone', name: 'Maya Stone', tourName: 'Summer Club Run', avatarInitials: 'MS' },
}

export const kpis: GlobalKpi[] = [
  { icon: 'mso-group', label: 'ARTISTS ACTIVE', value: '4', sub: 'On tour', routeName: 'artists' },
  { icon: 'mso-calendar_today', label: 'SHOWS TODAY', value: '2', sub: 'Across 2 artists', routeName: 'shows' },
  { icon: 'mso-flight', label: 'TRAVEL DAYS', value: '2', sub: 'Across 2 artists', routeName: 'travel' },
  { icon: 'mso-warning', label: 'CRITICAL ISSUES', value: '4', sub: 'Requires immediate action', routeName: 'issues' },
  { icon: 'mso-task_alt', label: 'ACTIVE TASKS', value: '14', sub: 'Across 2 artists', routeName: 'tasks' },
]

export const todayAcrossArtists: ArtistTodayRow[] = [
  {
    artist: artists.baka,
    city: 'Nashville, TN',
    dayStatus: 'Show Day',
    nextUp: { title: 'Show 7:00 PM', sub: 'Ryman Auditorium' },
    track: 'On Track',
  },
  {
    artist: artists.lunaRae,
    city: 'Charlotte, NC',
    dayStatus: 'Travel Day',
    nextUp: { title: 'Flight BNA → CLT', sub: '11:15 AM' },
    track: 'On Track',
  },
  {
    artist: artists.kofiJames,
    city: 'London, UK',
    dayStatus: 'Off Day',
    nextUp: { title: 'Free day, recovery', sub: '—' },
    track: 'On Track',
  },
  {
    artist: artists.mayaStone,
    city: 'Joshua Tree, CA',
    dayStatus: 'Show Day',
    nextUp: { title: 'House of Blues', sub: 'Doors 7:30 PM' },
    track: 'Needs Attention',
  },
]

export const next72h: GlobalTimelineGroup[] = [
  {
    label: 'TODAY • MAY 19',
    events: [
      { id: 'e1', artistId: 'baka', title: 'Baka — Nashville show', sub: 'Ryman Auditorium', kind: 'Show' },
      { id: 'e2', artistId: 'luna-rae', title: 'Luna Rae — BNA → CLT', sub: '11:15 AM', kind: 'Travel' },
      { id: 'e3', artistId: 'maya-stone', title: 'Maya Stone — Chicago show', sub: 'House of Blues', kind: 'Show' },
    ],
  },
  {
    label: 'TOMORROW • MAY 20',
    events: [
      { id: 'e4', artistId: 'luna-rae', title: 'Luna Rae — Charlotte show', sub: 'The Fillmore', kind: 'Show' },
      { id: 'e5', artistId: 'kofi-james', title: 'Kofi James — Berlin show', sub: 'Virgil Music Hall', kind: 'Show' },
      { id: 'e6', artistId: 'baka', title: 'Baka — Atlanta hotel confirmation due', sub: '—', kind: 'Deadline' },
    ],
  },
  {
    label: 'MAY 21',
    events: [
      { id: 'e7', artistId: 'maya-stone', title: 'Maya Stone — Detroit travel', sub: '—', kind: 'Travel' },
      { id: 'e8', artistId: 'kofi-james', title: 'Kofi James — London show', sub: '—', kind: 'Show' },
    ],
  },
]

export const criticalIssues: CriticalIssue[] = [
  { id: 'i1', title: 'Hotel not confirmed', artistId: 'baka', artistName: 'Baka', due: 'May 19', severity: 'High' },
  { id: 'i2', title: 'Off-load contract missing', artistId: 'luna-rae', artistName: 'Luna Rae', due: 'May 19', severity: 'High' },
  { id: 'i3', title: 'Settlement terms missing', artistId: 'maya-stone', artistName: 'Maya Stone', due: 'May 19', severity: 'Medium' },
  { id: 'i4', title: 'Guest list not received', artistId: 'kofi-james', artistName: 'Kofi James', due: 'May 19', severity: 'Medium' },
]

export const requiredActions: RequiredAction[] = [
  { id: 'a1', title: 'Confirm guest pickup', artistId: 'baka', artistName: 'Baka', due: 'May 19', status: 'Due Today' },
  { id: 'a2', title: 'Send Charlotte routing list', artistId: 'luna-rae', artistName: 'Luna Rae', due: 'May 19', status: 'Open' },
  { id: 'a3', title: 'Upload signed settlement sheet', artistId: 'kofi-james', artistName: 'Kofi James', due: 'May 19', status: 'Overdue' },
  { id: 'a4', title: 'Approve rider', artistId: 'maya-stone', artistName: 'Maya Stone', due: 'May 20', status: 'Open' },
  { id: 'a5', title: 'Tour manager check-in', artistId: 'baka', artistName: 'Baka', due: 'May 19', status: 'Open' },
]

export const travelWatch: TravelWatchRow[] = [
  { id: 'tw1', primary: 'Luna Rae — BNA → CLT', sub: 'May 19 • 11:15 AM', artistId: 'luna-rae', tag: 'Driver Not Assigned' },
  { id: 'tw2', primary: 'Maya Stone — DTW arrival', sub: 'May 20', artistId: 'maya-stone', tag: 'Pickup Unconfirmed' },
  { id: 'tw3', primary: 'Baka — Charlotte hotel check-in', sub: 'May 20', artistId: 'baka', tag: 'Pending' },
]

export const waitingOn: WaitingOnRow[] = [
  { id: 'w1', title: 'Hilton Atlanta hotel confirmation', sub: 'Baka — May 22', artistId: 'baka', waitingOn: 'Hilton Sales' },
  { id: 'w2', title: 'Berlin settlement approval', sub: 'Kofi James — May 19', artistId: 'kofi-james', waitingOn: 'Promoter' },
  { id: 'w3', title: 'Guest list', sub: 'Maya Stone — May 19', artistId: 'maya-stone', waitingOn: 'Artist Team' },
  { id: 'w4', title: 'Driver assignment', sub: 'Luna Rae — May 19', artistId: 'luna-rae', waitingOn: 'Transport Co.' },
  { id: 'w5', title: 'Rider approval', sub: 'Baka — May 20', artistId: 'baka', waitingOn: 'Venue Production' },
]

export const artistReadiness: ArtistReadiness[] = [
  { artist: artists.baka, todayLabel: 'Today: Charlotte travel', readinessPct: 76, risks: 3, tasksDue: 6, daysToShow: 3 },
  { artist: artists.lunaRae, todayLabel: 'Today: Charlotte show', readinessPct: 64, risks: 2, tasksDue: 4, daysToShow: 2 },
  { artist: artists.kofiJames, todayLabel: 'Today: Off day', readinessPct: 82, risks: 1, tasksDue: 3, daysToShow: 4 },
  { artist: artists.mayaStone, todayLabel: 'Today: Detroit travel', readinessPct: 69, risks: 2, tasksDue: 5, daysToShow: 2 },
]
```

- [ ] **Step 3.2: Verify type-check passes**

```bash
npx vue-tsc --noEmit
```

Expect: no output.

- [ ] **Step 3.3: Commit**

```bash
git add src/data/globalDashboard.ts
git commit -m "feat(data): add globalDashboard fixture"
```

---

## Task 4: Widget — `ArtistKpiRow.vue`

**Files:**

- Create: `src/components/dashboard/ArtistKpiRow.vue`

- [ ] **Step 4.1: Create the file with full content**

```vue
<!-- src/components/dashboard/ArtistKpiRow.vue -->
<template>
  <div class="artist-kpi-row">
    <RouterLink
      v-for="kpi in kpis"
      :key="kpi.label"
      :to="{ name: kpi.routeName }"
      class="artist-kpi-row__link"
    >
      <KpiTile
        :icon="kpi.icon"
        :label="kpi.label"
        :value="kpi.value"
        :sub="kpi.sub"
      />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { GlobalKpi } from '../../data/types'
import KpiTile from '../KpiTile.vue'

defineProps<{
  kpis: GlobalKpi[]
}>()
</script>

<style scoped lang="scss">
.artist-kpi-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(5, 1fr);
  }
}

.artist-kpi-row__link {
  display: block;
  color: inherit;
  text-decoration: none;
}
</style>
```

- [ ] **Step 4.2: Verify file compiles (dev server auto-reload should show no error)**

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/
```

Expect: `HTTP 200`. (The component is not yet mounted by any page; Vite only reports parse errors at this stage.)

- [ ] **Step 4.3: Type-check**

```bash
npx vue-tsc --noEmit
```

Expect: no output.

- [ ] **Step 4.4: Commit**

```bash
git add src/components/dashboard/ArtistKpiRow.vue
git commit -m "feat(dashboard): add ArtistKpiRow widget"
```

---

## Task 5: Widget — `TodayAcrossArtistsTable.vue`

**Files:**

- Create: `src/components/dashboard/TodayAcrossArtistsTable.vue`

- [ ] **Step 5.1: Create the file with full content**

```vue
<!-- src/components/dashboard/TodayAcrossArtistsTable.vue -->
<template>
  <VaCard class="today-artists">
    <header class="today-artists__head">
      <h2 class="today-artists__title">Today Across Artists</h2>
    </header>

    <RouterLink
      v-for="row in rows"
      :key="row.artist.id"
      :to="{ name: 'artist-detail', params: { id: row.artist.id } }"
      class="today-artists__row"
    >
      <div class="today-artists__avatar">{{ row.artist.avatarInitials }}</div>
      <div class="today-artists__artist">
        <div class="today-artists__artist-name">{{ row.artist.name }}</div>
        <div class="today-artists__artist-tour">{{ row.artist.tourName }}</div>
      </div>
      <div class="today-artists__city">{{ row.city }}</div>
      <VaBadge :text="row.dayStatus" :color="vaBadgeTokens[row.dayStatus]" />
      <div class="today-artists__next">
        <div class="today-artists__next-title">{{ row.nextUp.title }}</div>
        <div class="today-artists__next-sub">{{ row.nextUp.sub }}</div>
      </div>
      <VaBadge :text="row.track" :color="vaBadgeTokens[row.track]" class="today-artists__track" />
    </RouterLink>

    <footer class="today-artists__footer">
      <RouterLink :to="{ name: 'tour-dates' }" class="today-artists__footer-link">
        View Full Run Overview →
      </RouterLink>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { ArtistTodayRow } from '../../data/types'
import { vaBadgeTokens } from '../../data/severity'

defineProps<{
  rows: ArtistTodayRow[]
}>()
</script>

<style scoped lang="scss">
.today-artists {
  padding: 1.25rem 1.25rem 0.5rem;
}

.today-artists__head {
  margin-bottom: 0.75rem;
}

.today-artists__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.today-artists__row {
  display: grid;
  grid-template-columns: 2.25rem 1.5fr 1fr auto 1.5fr auto;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 0;
  border-top: 1px solid var(--va-background-border);
  color: inherit;
  text-decoration: none;

  &:hover {
    background: var(--va-background-element);
  }
}

.today-artists__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background: var(--va-primary);
  color: white;
  font-size: 0.8125rem;
  font-weight: 700;
}

.today-artists__artist-name {
  font-weight: 600;
  font-size: 0.9375rem;
}

.today-artists__artist-tour {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.today-artists__city {
  font-size: 0.875rem;
  color: var(--va-secondary);
}

.today-artists__next-title {
  font-weight: 600;
  font-size: 0.9375rem;
}

.today-artists__next-sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.today-artists__track {
  justify-self: end;
}

.today-artists__footer {
  padding: 0.875rem 0;
  border-top: 1px solid var(--va-background-border);
  text-align: right;
}

.today-artists__footer-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--va-primary);
  text-decoration: none;
}
</style>
```

- [ ] **Step 5.2: Type-check + dev server**

```bash
npx vue-tsc --noEmit && curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/
```

Expect: `HTTP 200`.

- [ ] **Step 5.3: Commit**

```bash
git add src/components/dashboard/TodayAcrossArtistsTable.vue
git commit -m "feat(dashboard): add TodayAcrossArtistsTable widget"
```

---

## Task 6: Widget — `GlobalNext72HoursCard.vue`

**Files:**

- Create: `src/components/dashboard/GlobalNext72HoursCard.vue`

- [ ] **Step 6.1: Create the file with full content**

```vue
<!-- src/components/dashboard/GlobalNext72HoursCard.vue -->
<template>
  <VaCard class="next72">
    <header class="next72__head">
      <VaIcon name="mso-schedule" size="20px" color="secondary" />
      <h2 class="next72__title">Next 72 Hours</h2>
    </header>

    <div v-for="group in groups" :key="group.label" class="next72__group">
      <div class="next72__day-label">{{ group.label }}</div>

      <RouterLink
        v-for="ev in group.events"
        :key="ev.id"
        :to="routeFor(ev.kind)"
        class="next72__row"
      >
        <div class="next72__row-body">
          <div class="next72__row-title">{{ ev.title }}</div>
          <div v-if="ev.sub && ev.sub !== '—'" class="next72__row-sub">{{ ev.sub }}</div>
        </div>
        <VaBadge
          :text="kindLabel(ev.kind)"
          :color="timelineKindColor[ev.kind]"
          class="next72__row-chip"
        />
      </RouterLink>
    </div>

    <footer class="next72__footer">
      <RouterLink :to="{ name: 'itinerary' }" class="next72__footer-link">
        View Full Timeline →
      </RouterLink>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import type { GlobalTimelineGroup, TimelineKind } from '../../data/types'
import { timelineKindColor } from '../../data/severity'

defineProps<{
  groups: GlobalTimelineGroup[]
}>()

function routeFor(kind: TimelineKind): RouteLocationRaw {
  if (kind === 'Show') return { name: 'shows' }
  if (kind === 'Travel') return { name: 'travel' }
  return { name: 'tasks' } // Deadline
}

function kindLabel(kind: TimelineKind): string {
  return kind.toUpperCase()
}
</script>

<style scoped lang="scss">
.next72 {
  padding: 1.25rem 1.25rem 0.5rem;
}

.next72__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.next72__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.next72__group + .next72__group {
  margin-top: 1rem;
}

.next72__day-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--va-secondary);
  padding: 0.5rem 0 0.25rem;
  border-top: 1px solid var(--va-background-border);
}

.next72__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: inherit;
  text-decoration: none;

  &:hover {
    background: var(--va-background-element);
  }
}

.next72__row-body {
  min-width: 0;
}

.next72__row-title {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
}

.next72__row-sub {
  font-size: 0.75rem;
  color: var(--va-secondary);
  margin-top: 0.125rem;
}

.next72__row-chip {
  flex-shrink: 0;
}

.next72__footer {
  padding: 0.875rem 0 0.25rem;
  border-top: 1px solid var(--va-background-border);
  text-align: right;
  margin-top: 0.75rem;
}

.next72__footer-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--va-primary);
  text-decoration: none;
}
</style>
```

- [ ] **Step 6.2: Type-check + dev server**

```bash
npx vue-tsc --noEmit && curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/
```

Expect: `HTTP 200`.

- [ ] **Step 6.3: Commit**

```bash
git add src/components/dashboard/GlobalNext72HoursCard.vue
git commit -m "feat(dashboard): add GlobalNext72HoursCard widget"
```

---

## Task 7: Widget — `CriticalIssuesCard.vue`

**Files:**

- Create: `src/components/dashboard/CriticalIssuesCard.vue`

- [ ] **Step 7.1: Create the file with full content**

```vue
<!-- src/components/dashboard/CriticalIssuesCard.vue -->
<template>
  <VaCard class="critical">
    <header class="critical__head">
      <VaIcon name="mso-warning" size="20px" color="danger" />
      <h2 class="critical__title">Critical Issues</h2>
    </header>

    <div v-for="issue in issues" :key="issue.id" class="critical__row">
      <span class="critical__dot" :class="severityTokens[issue.severity].dot" />
      <div class="critical__body">
        <div class="critical__row-title">{{ issue.title }}</div>
        <div class="critical__row-sub">{{ issue.artistName }} — {{ issue.due }}</div>
      </div>
      <VaButton
        :to="{ name: 'issues' }"
        size="small"
        preset="secondary"
        class="critical__resolve"
      >
        Resolve
      </VaButton>
    </div>

    <footer class="critical__footer">
      <RouterLink :to="{ name: 'issues' }" class="critical__footer-link">
        View All Issues & Risks →
      </RouterLink>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { CriticalIssue } from '../../data/types'
import { severityTokens } from '../../data/severity'

defineProps<{
  issues: CriticalIssue[]
}>()
</script>

<style scoped lang="scss">
.critical {
  padding: 1.25rem 1.25rem 0.5rem;
}

.critical__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.critical__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.critical__row {
  display: grid;
  grid-template-columns: 0.5rem 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-top: 1px solid var(--va-background-border);
}

.critical__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  display: inline-block;
}

.critical__row-title {
  font-weight: 600;
  font-size: 0.9375rem;
}

.critical__row-sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  margin-top: 0.125rem;
}

.critical__footer {
  padding: 0.875rem 0;
  border-top: 1px solid var(--va-background-border);
  text-align: right;
}

.critical__footer-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--va-primary);
  text-decoration: none;
}
</style>
```

- [ ] **Step 7.2: Type-check + dev server**

```bash
npx vue-tsc --noEmit && curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/
```

Expect: `HTTP 200`.

- [ ] **Step 7.3: Commit**

```bash
git add src/components/dashboard/CriticalIssuesCard.vue
git commit -m "feat(dashboard): add CriticalIssuesCard widget"
```

---

## Task 8: Widget — `RequiredActionsCard.vue`

**Files:**

- Create: `src/components/dashboard/RequiredActionsCard.vue`

- [ ] **Step 8.1: Create the file with full content**

```vue
<!-- src/components/dashboard/RequiredActionsCard.vue -->
<template>
  <VaCard class="actions-card">
    <header class="actions-card__head">
      <VaIcon name="mso-checklist" size="20px" color="secondary" />
      <h2 class="actions-card__title">Today's Required Actions</h2>
    </header>

    <RouterLink
      v-for="action in actions"
      :key="action.id"
      :to="{ name: 'tasks' }"
      class="actions-card__row"
    >
      <div class="actions-card__title-cell">{{ action.title }}</div>
      <div class="actions-card__artist">{{ action.artistName }}</div>
      <div class="actions-card__due">{{ action.due }}</div>
      <VaBadge :text="action.status" :color="vaBadgeTokens[action.status]" />
    </RouterLink>

    <footer class="actions-card__footer">
      <RouterLink :to="{ name: 'tasks' }" class="actions-card__footer-link">
        View All Tasks →
      </RouterLink>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { RequiredAction } from '../../data/types'
import { vaBadgeTokens } from '../../data/severity'

defineProps<{
  actions: RequiredAction[]
}>()
</script>

<style scoped lang="scss">
.actions-card {
  padding: 1.25rem 1.25rem 0.5rem;
}

.actions-card__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.actions-card__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.actions-card__row {
  display: grid;
  grid-template-columns: 1.5fr 1fr auto auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-top: 1px solid var(--va-background-border);
  color: inherit;
  text-decoration: none;

  &:hover {
    background: var(--va-background-element);
  }
}

.actions-card__title-cell {
  font-weight: 600;
  font-size: 0.9375rem;
}

.actions-card__artist {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.actions-card__due {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  white-space: nowrap;
}

.actions-card__footer {
  padding: 0.875rem 0;
  border-top: 1px solid var(--va-background-border);
  text-align: right;
}

.actions-card__footer-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--va-primary);
  text-decoration: none;
}
</style>
```

- [ ] **Step 8.2: Type-check + dev server**

```bash
npx vue-tsc --noEmit && curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/
```

Expect: `HTTP 200`.

- [ ] **Step 8.3: Commit**

```bash
git add src/components/dashboard/RequiredActionsCard.vue
git commit -m "feat(dashboard): add RequiredActionsCard widget"
```

---

## Task 9: Widget — `TravelMovementCard.vue`

**Files:**

- Create: `src/components/dashboard/TravelMovementCard.vue`

- [ ] **Step 9.1: Create the file with full content**

```vue
<!-- src/components/dashboard/TravelMovementCard.vue -->
<template>
  <VaCard class="travel-watch">
    <header class="travel-watch__head">
      <VaIcon name="mso-flight" size="20px" color="secondary" />
      <h2 class="travel-watch__title">Travel & Movement Watch</h2>
    </header>

    <RouterLink
      v-for="row in rows"
      :key="row.id"
      :to="{ name: 'travel' }"
      class="travel-watch__row"
    >
      <div class="travel-watch__body">
        <div class="travel-watch__primary">{{ row.primary }}</div>
        <div class="travel-watch__sub">{{ row.sub }}</div>
      </div>
      <VaBadge :text="tagLabel(row.tag)" :color="vaBadgeTokens[row.tag]" class="travel-watch__chip" />
    </RouterLink>

    <footer class="travel-watch__footer">
      <RouterLink :to="{ name: 'travel' }" class="travel-watch__footer-link">
        View All Travel →
      </RouterLink>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { TravelWatchRow, TravelWatchTag } from '../../data/types'
import { vaBadgeTokens } from '../../data/severity'

defineProps<{
  rows: TravelWatchRow[]
}>()

function tagLabel(tag: TravelWatchTag): string {
  return tag.toUpperCase()
}
</script>

<style scoped lang="scss">
.travel-watch {
  padding: 1.25rem 1.25rem 0.5rem;
}

.travel-watch__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.travel-watch__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.travel-watch__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0;
  border-top: 1px solid var(--va-background-border);
  color: inherit;
  text-decoration: none;

  &:hover {
    background: var(--va-background-element);
  }
}

.travel-watch__body {
  min-width: 0;
}

.travel-watch__primary {
  font-weight: 600;
  font-size: 0.875rem;
}

.travel-watch__sub {
  font-size: 0.75rem;
  color: var(--va-secondary);
  margin-top: 0.125rem;
}

.travel-watch__chip {
  flex-shrink: 0;
}

.travel-watch__footer {
  padding: 0.875rem 0;
  border-top: 1px solid var(--va-background-border);
  text-align: right;
  margin-top: 0.5rem;
}

.travel-watch__footer-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--va-primary);
  text-decoration: none;
}
</style>
```

- [ ] **Step 9.2: Type-check + dev server**

```bash
npx vue-tsc --noEmit && curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/
```

Expect: `HTTP 200`.

- [ ] **Step 9.3: Commit**

```bash
git add src/components/dashboard/TravelMovementCard.vue
git commit -m "feat(dashboard): add TravelMovementCard widget"
```

---

## Task 10: Widget — `WaitingOnCard.vue`

**Files:**

- Create: `src/components/dashboard/WaitingOnCard.vue`

- [ ] **Step 10.1: Create the file with full content**

```vue
<!-- src/components/dashboard/WaitingOnCard.vue -->
<template>
  <VaCard class="waiting-on">
    <header class="waiting-on__head">
      <VaIcon name="mso-pending" size="20px" color="secondary" />
      <h2 class="waiting-on__title">Waiting On</h2>
    </header>

    <RouterLink
      v-for="row in rows"
      :key="row.id"
      :to="{ name: 'tasks' }"
      class="waiting-on__row"
    >
      <div class="waiting-on__body">
        <div class="waiting-on__title-cell">{{ row.title }}</div>
        <div class="waiting-on__sub">{{ row.sub }}</div>
      </div>
      <VaBadge :text="row.waitingOn" color="secondary" class="waiting-on__chip" />
    </RouterLink>

    <footer class="waiting-on__footer">
      <RouterLink :to="{ name: 'tasks' }" class="waiting-on__footer-link">
        View All Waiting On →
      </RouterLink>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { WaitingOnRow } from '../../data/types'

defineProps<{
  rows: WaitingOnRow[]
}>()
</script>

<style scoped lang="scss">
.waiting-on {
  padding: 1.25rem 1.25rem 0.5rem;
}

.waiting-on__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.waiting-on__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.waiting-on__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0;
  border-top: 1px solid var(--va-background-border);
  color: inherit;
  text-decoration: none;

  &:hover {
    background: var(--va-background-element);
  }
}

.waiting-on__body {
  min-width: 0;
}

.waiting-on__title-cell {
  font-weight: 600;
  font-size: 0.875rem;
}

.waiting-on__sub {
  font-size: 0.75rem;
  color: var(--va-secondary);
  margin-top: 0.125rem;
}

.waiting-on__chip {
  flex-shrink: 0;
}

.waiting-on__footer {
  padding: 0.875rem 0;
  border-top: 1px solid var(--va-background-border);
  text-align: right;
  margin-top: 0.5rem;
}

.waiting-on__footer-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--va-primary);
  text-decoration: none;
}
</style>
```

- [ ] **Step 10.2: Type-check + dev server**

```bash
npx vue-tsc --noEmit && curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/
```

Expect: `HTTP 200`.

- [ ] **Step 10.3: Commit**

```bash
git add src/components/dashboard/WaitingOnCard.vue
git commit -m "feat(dashboard): add WaitingOnCard widget"
```

---

## Task 11: Widget — `ArtistReadinessGrid.vue` (incl. SVG readiness ring)

**Files:**

- Create: `src/components/dashboard/ArtistReadinessGrid.vue`

- [ ] **Step 11.1: Create the file with full content**

```vue
<!-- src/components/dashboard/ArtistReadinessGrid.vue -->
<template>
  <VaCard class="readiness">
    <header class="readiness__head">
      <h2 class="readiness__title">Artist Readiness Overview</h2>
    </header>

    <div class="readiness__grid">
      <RouterLink
        v-for="card in cards"
        :key="card.artist.id"
        :to="{ name: 'artist-detail', params: { id: card.artist.id } }"
        class="readiness__card"
      >
        <div class="readiness__top">
          <div class="readiness__avatar">{{ card.artist.avatarInitials }}</div>
          <div class="readiness__identity">
            <div class="readiness__name">{{ card.artist.name }}</div>
            <div class="readiness__tour">{{ card.artist.tourName }}</div>
            <div class="readiness__today">{{ card.todayLabel }}</div>
          </div>
          <svg viewBox="0 0 36 36" class="readiness__ring" aria-hidden="true">
            <!-- track -->
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="var(--va-background-element)"
              stroke-width="3"
            />
            <!-- progress: rotate -90° around center so the dash starts at 12 o'clock and fills clockwise -->
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="var(--va-primary)"
              stroke-width="3"
              stroke-linecap="round"
              :stroke-dasharray="`${card.readinessPct} ${100 - card.readinessPct}`"
              transform="rotate(-90 18 18)"
            />
            <text x="18" y="20.5" text-anchor="middle" font-size="9" font-weight="700">
              {{ card.readinessPct }}%
            </text>
          </svg>
        </div>
        <div class="readiness__stats">
          <div class="readiness__stat">
            <div class="readiness__stat-value">{{ card.risks }}</div>
            <div class="readiness__stat-label">Risks</div>
          </div>
          <div class="readiness__stat">
            <div class="readiness__stat-value">{{ card.tasksDue }}</div>
            <div class="readiness__stat-label">Tasks Due</div>
          </div>
          <div class="readiness__stat">
            <div class="readiness__stat-value">{{ card.daysToShow }}</div>
            <div class="readiness__stat-label">Days to Show</div>
          </div>
        </div>
      </RouterLink>
    </div>

    <footer class="readiness__footer">
      <RouterLink :to="{ name: 'artists' }" class="readiness__footer-link">
        View All Artist Details →
      </RouterLink>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { ArtistReadiness } from '../../data/types'

defineProps<{
  cards: ArtistReadiness[]
}>()
</script>

<style scoped lang="scss">
.readiness {
  padding: 1.25rem;
}

.readiness__head {
  margin-bottom: 1rem;
}

.readiness__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.readiness__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.readiness__card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--va-background-border);
  border-radius: 0.5rem;
  color: inherit;
  text-decoration: none;
  background: var(--va-background-secondary);

  &:hover {
    background: var(--va-background-element);
  }
}

.readiness__top {
  display: grid;
  grid-template-columns: 2.5rem 1fr 3.5rem;
  gap: 0.75rem;
  align-items: center;
}

.readiness__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: var(--va-primary);
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
}

.readiness__name {
  font-weight: 700;
  font-size: 0.9375rem;
}

.readiness__tour {
  font-size: 0.75rem;
  color: var(--va-secondary);
  margin-top: 0.125rem;
}

.readiness__today {
  font-size: 0.75rem;
  color: var(--va-secondary);
}

.readiness__ring {
  width: 3.5rem;
  height: 3.5rem;
}

.readiness__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.readiness__stat {
  text-align: center;
}

.readiness__stat-value {
  font-size: 1.25rem;
  font-weight: 700;
}

.readiness__stat-label {
  font-size: 0.6875rem;
  color: var(--va-secondary);
  letter-spacing: 0.02em;
}

.readiness__footer {
  margin-top: 1rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--va-background-border);
  text-align: right;
}

.readiness__footer-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--va-primary);
  text-decoration: none;
}
</style>
```

- [ ] **Step 11.2: Type-check + dev server**

```bash
npx vue-tsc --noEmit && curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/
```

Expect: `HTTP 200`.

- [ ] **Step 11.3: Commit**

```bash
git add src/components/dashboard/ArtistReadinessGrid.vue
git commit -m "feat(dashboard): add ArtistReadinessGrid widget with SVG ring"
```

---

## Task 12: Plumbing — stub pages + routes + sidebar + i18n

**Files:**

- Create: `src/pages/Artists.vue`
- Create: `src/pages/ArtistDetail.vue`
- Create: `src/pages/Issues.vue`
- Modify: `src/router/index.ts`
- Modify: `src/components/sidebar/NavigationRoutes.ts`
- Modify: `src/i18n/locales/gb.json`

- [ ] **Step 12.1: Create `src/pages/Artists.vue`**

```vue
<template>
  <PagePlaceholder name="Artists" />
</template>

<script setup lang="ts">
import PagePlaceholder from '../components/PagePlaceholder.vue'
</script>
```

- [ ] **Step 12.2: Create `src/pages/ArtistDetail.vue`**

```vue
<template>
  <PagePlaceholder name="Artist Detail" />
</template>

<script setup lang="ts">
import PagePlaceholder from '../components/PagePlaceholder.vue'
</script>
```

- [ ] **Step 12.3: Create `src/pages/Issues.vue`**

```vue
<template>
  <PagePlaceholder name="Issues" />
</template>

<script setup lang="ts">
import PagePlaceholder from '../components/PagePlaceholder.vue'
</script>
```

- [ ] **Step 12.4: Insert 3 new routes into `src/router/index.ts`**

Open `src/router/index.ts`. Locate the `tasks` route line (currently line 23):

```ts
        { path: 'tasks', name: 'tasks', component: () => import('../pages/Tasks.vue') },
```

Directly **after** that line, insert these three lines:

```ts
        { path: 'issues', name: 'issues', component: () => import('../pages/Issues.vue') },
        { path: 'artists', name: 'artists', component: () => import('../pages/Artists.vue') },
        { path: 'artists/:id', name: 'artist-detail', component: () => import('../pages/ArtistDetail.vue') },
```

Final router children block should read (in order): `dashboard, tour-dates, shows, itinerary, travel, contacts, tasks, issues, artists, artist-detail, documents, settlements, notes`.

- [ ] **Step 12.5: Insert Issues entry into `src/components/sidebar/NavigationRoutes.ts`**

Open `src/components/sidebar/NavigationRoutes.ts`. Locate the `tasks` entry (currently line 18):

```ts
    { name: 'tasks', displayName: 'menu.tasks', meta: { icon: 'mso-task_alt' } },
```

Directly **after** that line, insert:

```ts
    { name: 'issues', displayName: 'menu.issues', meta: { icon: 'mso-priority_high' } },
```

(Do **not** add `artists` or `artist-detail` to the sidebar — they're dashboard-only destinations per spec §8.)

- [ ] **Step 12.6: Add Issues i18n key to `src/i18n/locales/gb.json`**

Open `src/i18n/locales/gb.json`. Locate the `"tasks": "Tasks",` line (currently line 63):

```json
    "tasks": "Tasks",
```

Directly **after** that line, insert:

```json
    "issues": "Issues",
```

- [ ] **Step 12.7: Verify routing + sidebar load cleanly**

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/issues && \
  curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/artists && \
  curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/artists/baka
```

Expect: three `HTTP 200` responses.

- [ ] **Step 12.8: Type-check**

```bash
npx vue-tsc --noEmit
```

Expect: no output.

- [ ] **Step 12.9: Commit**

```bash
git add src/pages/Artists.vue src/pages/ArtistDetail.vue src/pages/Issues.vue \
  src/router/index.ts src/components/sidebar/NavigationRoutes.ts src/i18n/locales/gb.json
git commit -m "feat(routing): add Issues sidebar entry and Artists/ArtistDetail/Issues stub routes"
```

---

## Task 13: Rewrite `src/pages/Dashboard.vue` to compose the Global Dashboard

**Files:**

- Modify: `src/pages/Dashboard.vue` (full rewrite)

- [ ] **Step 13.1: Replace `src/pages/Dashboard.vue` contents in full**

Use the Write tool to overwrite the file with:

```vue
<!-- src/pages/Dashboard.vue -->
<template>
  <div class="global-dashboard">
    <PageHeader title="Global Dashboard" subtitle="Overview across all artists and tours">
      <template #actions>
        <VaButton preset="secondary" icon="mso-tune" disabled>Customize Dashboard</VaButton>
      </template>
    </PageHeader>

    <section class="global-dashboard__kpi-row">
      <ArtistKpiRow :kpis="kpis" />
    </section>

    <div class="global-dashboard__body">
      <div class="global-dashboard__main">
        <section class="global-dashboard__today">
          <TodayAcrossArtistsTable :rows="todayAcrossArtists" />
        </section>
        <div class="global-dashboard__main-row">
          <section class="global-dashboard__critical">
            <CriticalIssuesCard :issues="criticalIssues" />
          </section>
          <section class="global-dashboard__actions">
            <RequiredActionsCard :actions="requiredActions" />
          </section>
        </div>
      </div>

      <div class="global-dashboard__rail">
        <section class="global-dashboard__next72">
          <GlobalNext72HoursCard :groups="next72h" />
        </section>
        <section class="global-dashboard__travel">
          <TravelMovementCard :rows="travelWatch" />
        </section>
        <section class="global-dashboard__waiting">
          <WaitingOnCard :rows="waitingOn" />
        </section>
      </div>
    </div>

    <section class="global-dashboard__readiness">
      <ArtistReadinessGrid :cards="artistReadiness" />
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import ArtistKpiRow from '../components/dashboard/ArtistKpiRow.vue'
import TodayAcrossArtistsTable from '../components/dashboard/TodayAcrossArtistsTable.vue'
import GlobalNext72HoursCard from '../components/dashboard/GlobalNext72HoursCard.vue'
import CriticalIssuesCard from '../components/dashboard/CriticalIssuesCard.vue'
import RequiredActionsCard from '../components/dashboard/RequiredActionsCard.vue'
import TravelMovementCard from '../components/dashboard/TravelMovementCard.vue'
import WaitingOnCard from '../components/dashboard/WaitingOnCard.vue'
import ArtistReadinessGrid from '../components/dashboard/ArtistReadinessGrid.vue'
import {
  kpis,
  todayAcrossArtists,
  next72h,
  criticalIssues,
  requiredActions,
  travelWatch,
  waitingOn,
  artistReadiness,
} from '../data/globalDashboard'
</script>

<style scoped lang="scss">
.global-dashboard {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.global-dashboard__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  }
}

.global-dashboard__main,
.global-dashboard__rail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.global-dashboard__main-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
```

- [ ] **Step 13.2: Type-check**

```bash
npx vue-tsc --noEmit
```

Expect: no output. If errors mention the old fixture imports (e.g., `todayDate`, `travelLegs`, `openIssues`, `upcomingShows`, `recentNotes`), they should not appear because the old imports were removed in this overwrite. If a widget prop type errors, fix the matching widget per Tasks 4–11.

- [ ] **Step 13.3: Verify /dashboard renders**

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/dashboard
```

Expect: `HTTP 200`. Open the URL in a browser and visually confirm:
- Title: **Global Dashboard**
- Subtitle: **Overview across all artists and tours**
- "Customize Dashboard" button visible and **disabled** (greyed out)
- 5 KPI tiles in order: Artists Active / Shows Today / Travel Days / Critical Issues / Active Tasks
- "Today Across Artists" table with 4 rows
- "Next 72 Hours" card with 3 day-group headers and 8 events total
- "Critical Issues" + "Today's Required Actions" side-by-side below the table
- "Travel & Movement Watch" + "Waiting On" stacked in the right column
- "Artist Readiness Overview" full-width at the bottom with 4 cards, each with an SVG ring filling clockwise from 12 o'clock
- No empty grid cells anywhere

- [ ] **Step 13.4: Spot-check click-throughs (manual)**

In the browser at `/dashboard`:
- Click "ARTISTS ACTIVE" KPI → URL becomes `/artists`, page shows "Artists" placeholder
- Click "CRITICAL ISSUES" KPI → URL becomes `/issues`, page shows "Issues" placeholder
- Click a row in "Today Across Artists" → URL becomes `/artists/<id>`, page shows "Artist Detail" placeholder
- Click a Resolve button → URL becomes `/issues`
- Click "View Full Timeline" footer in Next 72 Hours → URL becomes `/itinerary`
- Use browser back button to return to `/dashboard` each time

- [ ] **Step 13.5: Commit**

```bash
git add src/pages/Dashboard.vue
git commit -m "feat(dashboard): rewrite Dashboard.vue as Global Dashboard composition"
```

---

## Task 14: Cleanup — inline two fixtures into `shows.ts`, then delete old dashboard fixture + 7 old widgets

**Files:**

- Modify: `src/data/shows.ts` (replace the `import { todayTimeline, quickContacts } from './dashboard'` with inlined literal const declarations)
- Delete: `src/data/dashboard.ts`
- Delete: `src/components/dashboard/Next72HoursCard.vue`
- Delete: `src/components/dashboard/OpenIssuesCard.vue`
- Delete: `src/components/dashboard/QuickContactsCard.vue`
- Delete: `src/components/dashboard/RecentNotesCard.vue`
- Delete: `src/components/dashboard/TodayTimelineCard.vue`
- Delete: `src/components/dashboard/TravelHotelCard.vue`
- Delete: `src/components/dashboard/UpcomingShowsTable.vue`

- [ ] **Step 14.1: Open `src/data/shows.ts` and replace lines 1–3**

Current lines 1–3:

```ts
// src/data/shows.ts — Show Detail fixture (matches mock 3 — The Ryman)
import type { ShowDetail } from './types'
import { todayTimeline, quickContacts } from './dashboard'
```

Replace with:

```ts
// src/data/shows.ts — Show Detail fixture (matches mock 3 — The Ryman)
import type { ShowDetail, TimelineEvent, QuickContact } from './types'

// Inlined from former src/data/dashboard.ts (deleted in same commit).
// Kept here because /shows depends on these as part of the Show Detail mock.
const todayTimeline: TimelineEvent[] = [
  { id: 't1', time: '9:00 AM', title: 'Load-In', sub: 'Ryman Auditorium' },
  { id: 't2', time: '11:00 AM', title: 'Soundcheck', sub: 'Stage' },
  { id: 't3', time: '5:00 PM', title: 'Dinner', sub: 'Crew & Band' },
  { id: 't4', time: '7:30 PM', title: 'Show', sub: 'The Ryman' },
  { id: 't5', time: '11:00 PM', title: 'Load-Out', sub: 'Ryman Auditorium' },
]

const quickContacts: QuickContact[] = [
  { role: 'Venue Manager', name: 'Sarah Williams', phone: '(615) 889-3060' },
  { role: 'Promoter', name: 'Mike Reynolds', phone: '(615) 555-2194' },
  { role: 'Driver', name: 'Derrick Johnson', phone: '(615) 555-7788' },
  { role: 'Hotel', name: 'Grand Hyatt Nashville', phone: '(615) 724-1234' },
]
```

The rest of `shows.ts` (the `export const showDetail: ShowDetail = { ... }` block) is unchanged; it still references `schedule: todayTimeline` and `contacts: quickContacts` from its now-local scope.

- [ ] **Step 14.2: Verify /shows still renders BEFORE deleting anything else**

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/shows && \
  npx vue-tsc --noEmit
```

Expect: `HTTP 200` AND no type-check output. If type-check fails, fix the inlining before continuing. Do not proceed to deletion until both succeed.

- [ ] **Step 14.3: Delete the old fixture and 7 old widgets**

```bash
rm src/data/dashboard.ts \
   src/components/dashboard/Next72HoursCard.vue \
   src/components/dashboard/OpenIssuesCard.vue \
   src/components/dashboard/QuickContactsCard.vue \
   src/components/dashboard/RecentNotesCard.vue \
   src/components/dashboard/TodayTimelineCard.vue \
   src/components/dashboard/TravelHotelCard.vue \
   src/components/dashboard/UpcomingShowsTable.vue
```

- [ ] **Step 14.4: Verify no broken imports remain**

```bash
grep -rnE "from\s+['\"]\.\.?/dashboard['\"]" src/ || echo "no relative './dashboard' or '../dashboard' imports remain"
grep -rn "data/dashboard" src/ || echo "no 'data/dashboard' references remain"
grep -rnE "Next72HoursCard|OpenIssuesCard|QuickContactsCard|RecentNotesCard|TodayTimelineCard|TravelHotelCard|UpcomingShowsTable" src/ || echo "no references to deleted widgets remain"
```

Each command should print the "no … remain" message. Any actual output indicates a leftover import to fix.

- [ ] **Step 14.5: Type-check + dev server + build**

```bash
npx vue-tsc --noEmit && \
  curl -s -o /dev/null -w "/dashboard HTTP %{http_code}\n" http://localhost:5173/dashboard && \
  curl -s -o /dev/null -w "/shows HTTP %{http_code}\n" http://localhost:5173/shows && \
  npm run build
```

Expect: type-check clean; both routes `HTTP 200`; `npm run build` exits 0.

- [ ] **Step 14.6: Commit the deletions and the inlining in one atomic commit**

```bash
git add src/data/shows.ts
git add -u src/data/dashboard.ts \
  src/components/dashboard/Next72HoursCard.vue \
  src/components/dashboard/OpenIssuesCard.vue \
  src/components/dashboard/QuickContactsCard.vue \
  src/components/dashboard/RecentNotesCard.vue \
  src/components/dashboard/TodayTimelineCard.vue \
  src/components/dashboard/TravelHotelCard.vue \
  src/components/dashboard/UpcomingShowsTable.vue
git commit -m "chore(dashboard): inline shows fixtures, remove old dashboard.ts + 7 widgets"
```

---

## Task 15: Final verification — full acceptance walkthrough

**Files:** none (verification only)

- [ ] **Step 15.1: Acceptance criteria walkthrough**

Open `http://localhost:5173/dashboard` in a browser. Confirm each item in spec §10:

1. `/dashboard` renders without console errors (DevTools Console pane empty of red errors).
2. Title is "Global Dashboard"; subtitle is "Overview across all artists and tours"; "Customize Dashboard" button to the right of the header (disabled state).
3. KPI row shows 5 tiles in order: ARTISTS ACTIVE 4 / SHOWS TODAY 2 / TRAVEL DAYS 2 / CRITICAL ISSUES 4 / ACTIVE TASKS 14. Each tile is a clickable `RouterLink`.
4. "Today Across Artists" shows 4 rows in order: Baka, Luna Rae, Kofi James, Maya Stone.
5. "Next 72 Hours" shows 3 day groups (TODAY • MAY 19, TOMORROW • MAY 20, MAY 21) with events from §5 fixture.
6. Critical Issues, Today's Required Actions, Travel & Movement Watch, Waiting On all render in fixture order.
7. Artist Readiness Overview shows 4 cards: Baka 76%, Luna Rae 64%, Kofi James 82%, Maya Stone 69%. Each ring **fills clockwise from 12 o'clock** (visually verify).
8. Click-through map sanity-check (spec §9):
   - KPI "Artists Active" → `/artists`
   - KPI "Critical Issues" → `/issues`
   - Today row "Baka" → `/artists/baka`
   - Next 72 Hours show event → `/shows`
   - Travel & Movement Watch row → `/travel`
   - Waiting On row → `/tasks`
   - Artist Readiness "Maya Stone" card → `/artists/maya-stone`
9. Sidebar shows "Issues" directly under "Tasks". Click it → `/issues` PagePlaceholder titled "Issues".
10. `/artists` and `/artists/maya-stone` render PagePlaceholders; they are not in the sidebar.
11. Run `npm run build` (full pipeline: lint + type-check + build).

```bash
npm run build
```

Expect: exit 0 with `dist/` produced. No lint or type errors.

12. Grep verifies no broken imports:

```bash
grep -rn "data/dashboard" src/ || echo "OK: no data/dashboard refs"
grep -rnE "from\s+['\"]\.\.?/dashboard['\"]" src/ || echo "OK: no relative dashboard imports"
```

13. `/shows` still renders.

```bash
curl -s -o /dev/null -w "/shows HTTP %{http_code}\n" http://localhost:5173/shows
```

Expect: `HTTP 200`.

14. Layout at ≥ 1024px matches mock; no empty grid cells. Resize the browser to ~1100px wide and 700px wide — both layouts should be coherent (desktop 2-col + rail at 1100px; full 1-col stack at 700px).

- [ ] **Step 15.2: Final clean working tree**

```bash
git status --short && git log --oneline -16
```

Expect: clean working tree. Log shows 15+ new commits since `24cbc6f`, one per task.

- [ ] **Step 15.3: Done**

No commit needed for this task — it's verification only. The plan is complete. Discuss next steps (push, tag, etc.) with the user.

---

## Definition of Done

- [ ] All 15 task checkboxes above are checked.
- [ ] `npm run build` exits 0.
- [ ] `/dashboard` renders the Global Dashboard mock faithfully at ≥ 1024px.
- [ ] `/shows`, `/tour-dates`, and every other existing route still renders.
- [ ] Sidebar has a new "Issues" entry under "Tasks".
- [ ] `git log --oneline` shows clean, well-scoped conventional commits per task.
- [ ] Working tree is clean.

---

End of plan.
