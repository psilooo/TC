# TourCraft Additional Skeleton Screens — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 6 new skeleton pages (Tour Dates, Shows, Travel, Contacts, Tasks, Documents/Settlements) on top of the v0.1.0-skeleton dashboard, faithfully rendering the mocks in `screens/` with mock data only.

**Architecture:** One big spec implementation. Per-page widget folders under `src/components/<section>/`. Per-section data fixture files under `src/data/<section>.ts`. Shared `KpiRow` extracted; `KpiTile` migrated from `components/dashboard/` to `components/` root. Settlements re-renders the same combined `DocsSettlementsView` as Documents. Itinerary + Notes stay as `<PagePlaceholder>` stubs.

**Tech stack:** Vue 3.5 + Vite 5 + TypeScript + Vuestic UI 1.10 + Tailwind 3.4 + SCSS + Pinia 2 + Vue Router 4.

**Spec reference:** `docs/superpowers/specs/2026-05-05-tourcraft-additional-screens-design.md` (HEAD `2f1dc7e`).

**Test posture:** No unit/e2e tests this iteration (per spec §3 out-of-scope). Verification per task: dev-server boot + targeted `grep` checks + visual confirmation in browser at `http://localhost:5173/`.

**Implementation order rationale:** Foundation refactors first (so all subsequent pages can use `KpiRow`, the extended `PageHeader`, the new types). Then per-page in this order: Tour Dates → Shows → Travel → Contacts → Tasks → Documents/Settlements. Each commit keeps dev server bootable; each completed page is independently visible.

---

## Pre-flight

- [ ] **P.1** Run `git status` — verify clean working tree
- [ ] **P.2** Run `git log --oneline -5` — verify HEAD is at `2f1dc7e` (the spec revision) or descendant
- [ ] **P.3** Run `npm run dev` in a background shell — verify it boots clean to `http://localhost:5173/`. Leave running for visual checks.

---

## Task 1: Foundation refactor — types, severity, format, KpiTile move

**Files:**

- Move: `src/components/dashboard/KpiTile.vue` → `src/components/KpiTile.vue`
- Modify: `src/pages/Dashboard.vue` (update KpiTile import path only)
- Modify: `src/data/types.ts` (append new interfaces)
- Modify: `src/data/severity.ts` (append `statusTokens`)
- Modify: `src/data/format.ts` (append `formatRelativeDateTime`)

- [ ] **Step 1.1: Move KpiTile**

```bash
git mv src/components/dashboard/KpiTile.vue src/components/KpiTile.vue
```

- [ ] **Step 1.2: Update Dashboard.vue import path**

In `src/pages/Dashboard.vue`, find:

```ts
import KpiTile from '../components/dashboard/KpiTile.vue'
```

Replace with:

```ts
import KpiTile from '../components/KpiTile.vue'
```

(Use Edit tool. Only that one line changes.)

- [ ] **Step 1.3: Append types to `src/data/types.ts`**

Read the existing file first, then append (do NOT remove existing exports):

```ts
// === Additional Screens (added by spec 2026-05-05-tourcraft-additional-screens) ===

export type AdvanceStatus = 'Complete' | 'Need Follow-Up' | 'Missing'

export interface AdvanceSection {
  id: string
  name: string
  icon: string
  sub?: string
  done: number
  total: number
  status: AdvanceStatus
}

export interface AdvanceMissingItem {
  id: string
  title: string
  sub: string
  severity: Severity
}

export interface AdvanceUpdate {
  id: string
  body: string
  at: string
}

export interface ShowSnapshot {
  venue: string
  address: string
  capacity: number
  doors: string
  showStart: string
  setLength: string
  support: string
  ageRestriction?: string
  ticketSales?: { sold: number; capacity: number }
}

export interface ShowGuestListData {
  capacity: number
  sold: number
  holds: number
  comps: number
  onList: number
}

export interface ShowSettlementSnapshot {
  gross: number
  expenses: number
  net: number
  status: 'Estimated' | 'Pending' | 'Settled'
}

export interface ShowAttachment {
  id: string
  name: string
  type: string
  sizeKb: number
}

export interface ShowActivityEntry {
  id: string
  body: string
  at: string
}

export interface ShowDetail {
  id: string
  title: string
  dateIso: string
  dateLong: string
  snapshot: ShowSnapshot
  schedule: TimelineEvent[]
  contacts: QuickContact[]
  guestList: ShowGuestListData
  hospitality: { rider: string; bullets: string[] }
  openTasks: { id: string; title: string; due: string; severity?: Severity }[]
  settlement: ShowSettlementSnapshot
  attachments: ShowAttachment[]
  recentActivity: ShowActivityEntry[]
}

export type TravelMode = 'Flight' | 'Drive' | 'Train' | 'Bus'

export interface TravelSegment {
  id: string
  date: string
  tripNumber: string
  origin: string
  destination: string
  mode: TravelMode
  hotel?: string
  status: Status
  confirmation?: string
  notes?: string
}

export interface TravelTrip {
  id: string
  origin: { city: string; airport: string; date: string }
  destination: { city: string; airport: string; date: string }
  hotel: { name: string; address: string; checkIn: string; checkOut: string }
  confirmations: { kind: string; code: string }[]
  party: { name: string; role: string }[]
}

export interface TravelCheckIn {
  id: string
  hotel: string
  city: string
  arrival: string
  departure: string
  status: Status
}

export interface TravelIssue {
  id: string
  title: string
  sub: string
  severity: Severity
}

export type ContactRole =
  | 'Venue Manager'
  | 'Promoter'
  | 'Driver'
  | 'Hotel'
  | 'Production'
  | 'Catering'
  | 'Sound'
  | 'Lighting'
  | 'Other'

export interface Contact {
  id: string
  role: ContactRole
  name: string
  company: string
  city: string
  phones: string[]
  email: string
  lastShowDate?: string
  notes?: string
}

export interface ContactDetail extends Contact {
  address: string
  altEmails: string[]
  showHistory: { id: string; date: string; venue: string; city: string }[]
  recentActivity: { id: string; body: string; at: string }[]
}

export type TaskColumn = 'todo' | 'waiting' | 'duesoon' | 'done'

export interface TaskItem {
  id: string
  title: string
  due?: string
  tags: string[]
  assigneeInitials: string
  column: TaskColumn
}

export interface TaskDeadline {
  id: string
  title: string
  date: string
}

export interface TaskCategory {
  name: string
  count: number
}

export type FileType = 'PDF' | 'Doc' | 'Image' | 'Sheet'
export type FileStatus = 'Approved' | 'Pending' | 'Missing' | 'Action Needed'

export interface FileEntry {
  id: string
  type: FileType
  name: string
  category: string
  show: string
  uploadedBy: string
  uploadedDate: string
  status: FileStatus
}

export interface Settlement {
  id: string
  show: string
  date: string
  grossUsd: number
  expensesUsd: number
  netUsd: number
  status: 'Confirmed' | 'Pending' | 'Disputed'
}

export interface DocsMissingItem {
  id: string
  title: string
  show: string
  severity: Severity
}

export interface DocsSelectedFile extends FileEntry {
  sizeKb: number
  preview: string
  signers?: string[]
}
```

- [ ] **Step 1.4: Append `statusTokens` to `src/data/severity.ts`**

Append:

```ts
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
```

- [ ] **Step 1.5: Append `formatRelativeDateTime` to `src/data/format.ts`**

Append at the end:

```ts
const relDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const relTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

export function formatRelativeDateTime(iso: string): string {
  const d = new Date(iso)
  return `${relDate.format(d)} · ${relTime.format(d)}`
}
```

- [ ] **Step 1.6: Verify**

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/dashboard
```

Expect: HTTP 200 (Dashboard still renders with KpiTile from new path).

```bash
grep -rln "components/dashboard/KpiTile" src/
```

Expect: zero output (no surviving references to old path).

- [ ] **Step 1.7: Commit**

```bash
git add -A
git commit -m "refactor(foundation): move KpiTile to components/ root; extend types/severity/format for new screens"
```

---

## Task 2: Foundation refactor — PageHeader + KpiRow + ShowSwitcher + Breadcrumb

**Files:**

- Modify: `src/components/PageHeader.vue` (add slots; keep backward-compat)
- Create: `src/components/KpiRow.vue`
- Create: `src/components/ShowSwitcher.vue`
- Create: `src/components/Breadcrumb.vue`

- [ ] **Step 2.1: Rewrite `src/components/PageHeader.vue`**

```vue
<!-- src/components/PageHeader.vue -->
<template>
  <header class="page-header">
    <div class="page-header__top">
      <div class="page-header__heading">
        <slot name="breadcrumb" />
        <h1 class="page-header__title">
          <slot name="title">{{ title }}</slot>
        </h1>
        <slot name="subtitle">
          <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
        </slot>
      </div>
      <div v-if="$slots.actions" class="page-header__actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Invariant: callers must provide either the `title` prop OR a `#title` slot.
// Both omitted = empty <h1> rendered (caught by visual review, not by TS).
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<style scoped lang="scss">
.page-header {
  margin-bottom: 1.5rem;
}

.page-header__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
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

.page-header__actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
```

- [ ] **Step 2.2: Create `src/components/KpiRow.vue`**

```vue
<!-- src/components/KpiRow.vue -->
<template>
  <section class="kpi-row" :class="{ 'kpi-row--three': kpis.length === 3 }">
    <KpiTile v-for="k in kpis" :key="k.label" v-bind="k" />
  </section>
</template>

<script setup lang="ts">
import type { Kpi } from '../data/types'
import KpiTile from './KpiTile.vue'

defineProps<{ kpis: Kpi[] }>()
</script>

<style scoped lang="scss">
.kpi-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .kpi-row {
    grid-template-columns: repeat(4, 1fr);
  }

  .kpi-row--three {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
```

- [ ] **Step 2.3: Create `src/components/ShowSwitcher.vue`**

```vue
<!-- src/components/ShowSwitcher.vue -->
<template>
  <button class="show-switcher" type="button" :aria-label="`Switch show (currently ${name})`">
    <span>{{ name }}</span>
    <VaIcon name="mso-expand_more" size="20px" />
  </button>
</template>

<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<style scoped lang="scss">
.show-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}
</style>
```

- [ ] **Step 2.4: Create `src/components/Breadcrumb.vue`**

```vue
<!-- src/components/Breadcrumb.vue -->
<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <ol>
      <li v-for="(crumb, i) in items" :key="i">
        <span class="breadcrumb__crumb" :class="{ 'is-current': i === items.length - 1 }">
          {{ crumb }}
        </span>
        <VaIcon v-if="i < items.length - 1" name="mso-chevron_right" size="14px" color="secondary" />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
defineProps<{ items: string[] }>()
</script>

<style scoped lang="scss">
.breadcrumb ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 0.25rem;
  align-items: center;
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.breadcrumb li {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.breadcrumb__crumb.is-current {
  color: var(--va-text-primary);
}
</style>
```

- [ ] **Step 2.5: Verify Dashboard still renders**

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/dashboard
```

Expect: HTTP 200. `<PageHeader title="Tour Dashboard" subtitle="Today / Command Center" />` continues to work via the `#title` slot fallback.

- [ ] **Step 2.6: Commit**

```bash
git add src/components/PageHeader.vue src/components/KpiRow.vue src/components/ShowSwitcher.vue src/components/Breadcrumb.vue
git commit -m "feat(foundation): extend PageHeader with slots; add KpiRow, ShowSwitcher, Breadcrumb primitives"
```

---

## Task 3: Tour Dates fixtures

**Files:**

- Create: `src/data/tourDates.ts`

- [ ] **Step 3.1: Create `src/data/tourDates.ts`**

```ts
// src/data/tourDates.ts — Advance Checklist fixtures (matches mock 1)
import type { AdvanceMissingItem, AdvanceSection, AdvanceUpdate, Kpi, NoteEntry, QuickContact } from './types'

export const advanceCurrentShow = {
  id: 'show-may-21',
  label: 'Atlanta, GA — Tabernacle',
  date: 'Wed, May 21',
}

export const advanceKpis: Kpi[] = [
  { icon: 'mso-percent', label: '% Complete', value: '75%', sub: 'Sections progress' },
  { icon: 'mso-check_circle', label: 'Sections Complete', value: '8 of 11', sub: 'Sections complete' },
  { icon: 'mso-warning', label: 'Missing Items', value: '3', sub: 'Need follow-up' },
]

export const advanceSections: AdvanceSection[] = [
  {
    id: 'venue',
    name: 'Venue Info',
    icon: 'mso-stadium',
    sub: 'Capacity, address, load-in',
    done: 6,
    total: 6,
    status: 'Complete',
  },
  {
    id: 'local',
    name: 'Local Contacts',
    icon: 'mso-group',
    sub: 'Promoter, runner, security',
    done: 5,
    total: 5,
    status: 'Complete',
  },
  {
    id: 'hosp',
    name: 'Hospitality',
    icon: 'mso-restaurant',
    sub: 'Catering, dressing rooms, riders',
    done: 2,
    total: 4,
    status: 'Need Follow-Up',
  },
  {
    id: 'sched',
    name: 'Schedule Confirmation',
    icon: 'mso-schedule',
    sub: 'Load-in, soundcheck, doors',
    done: 3,
    total: 3,
    status: 'Complete',
  },
  {
    id: 'travel',
    name: 'Travel & Hotel',
    icon: 'mso-flight',
    sub: 'Flights and hotel rooms',
    done: 5,
    total: 5,
    status: 'Complete',
  },
  {
    id: 'crew',
    name: 'Crew Accommodations',
    icon: 'mso-hotel',
    sub: 'Crew rooms and per-diems',
    done: 4,
    total: 4,
    status: 'Complete',
  },
  {
    id: 'tech',
    name: 'Production / Tech Rider',
    icon: 'mso-build',
    sub: 'Sound, lighting, backline',
    done: 6,
    total: 6,
    status: 'Complete',
  },
  {
    id: 'guest',
    name: 'Guest List',
    icon: 'mso-list_alt',
    sub: 'Comps and holds',
    done: 1,
    total: 2,
    status: 'Need Follow-Up',
  },
  {
    id: 'sett',
    name: 'Settlement Terms',
    icon: 'mso-attach_money',
    sub: 'Deal points and deductions',
    done: 4,
    total: 4,
    status: 'Complete',
  },
  {
    id: 'mpl',
    name: 'Merch / Parking / Load-In',
    icon: 'mso-local_shipping',
    sub: 'Vendor, lot, dock access',
    done: 3,
    total: 3,
    status: 'Complete',
  },
  {
    id: 'promo',
    name: 'Promo / Marketing',
    icon: 'mso-campaign',
    sub: 'Press release, socials, ads',
    done: 0,
    total: 2,
    status: 'Missing',
  },
]

export const advanceMissing: AdvanceMissingItem[] = [
  { id: 'm1', title: 'Sound spec sheet', sub: 'Hospitality', severity: 'High' },
  { id: 'm2', title: 'Production rider', sub: 'Logistics', severity: 'Medium' },
  { id: 'm3', title: 'Press release', sub: 'Promo', severity: 'Low' },
]

export const advanceQuickContacts: QuickContact[] = [
  { role: 'Promoter', name: 'Mike Reynolds', phone: '(615) 555-2194' },
  { role: 'Hospitality', name: 'Tabernacle Catering', phone: '(404) 555-0143' },
  { role: 'Production', name: 'Lou Carter', phone: '(404) 555-7710' },
]

export const advanceNotes: NoteEntry[] = [
  {
    id: 'n1',
    body: 'Update load-in entrance: use 6th Ave dock per venue email.',
    at: '2026-05-19T11:30:00',
    authorInitials: 'JM',
  },
  {
    id: 'n2',
    body: 'Promoter prefers 7:30 PM doors. Confirm with crew.',
    at: '2026-05-18T15:10:00',
    authorInitials: 'JM',
  },
]

export const advanceUpdates: AdvanceUpdate[] = [
  { id: 'u1', body: 'Sound spec sheet uploaded by JM', at: '2026-05-20T13:05:00' },
  { id: 'u2', body: 'Hotel block confirmed (5 rooms)', at: '2026-05-20T09:42:00' },
  { id: 'u3', body: 'Promoter sent updated runner info', at: '2026-05-19T17:18:00' },
]
```

- [ ] **Step 3.2: Verify TS compiles**

```bash
npx vue-tsc --noEmit 2>&1 | grep -E "tourDates|types" | head -10
```

Expect: zero errors related to your new file.

- [ ] **Step 3.3: Commit**

```bash
git add src/data/tourDates.ts
git commit -m "feat(data): add Tour Dates Advance Checklist fixtures"
```

---

## Task 4: Tour Dates — `AdvanceSectionRow` component

**Files:**

- Create: `src/components/tour-dates/AdvanceSectionRow.vue`

- [ ] **Step 4.1: Create `src/components/tour-dates/AdvanceSectionRow.vue`**

```vue
<!-- src/components/tour-dates/AdvanceSectionRow.vue -->
<template>
  <VaCard class="advance-row">
    <div class="advance-row__icon">
      <VaIcon :name="icon" size="22px" color="secondary" />
    </div>
    <div class="advance-row__body">
      <div class="advance-row__name">{{ name }}</div>
      <div v-if="sub" class="advance-row__sub">{{ sub }}</div>
    </div>
    <div class="advance-row__progress">
      <div class="advance-row__progress-bar">
        <span class="advance-row__progress-fill" :style="{ width: pct + '%' }" />
      </div>
      <div class="advance-row__progress-label">{{ done }} / {{ total }}</div>
    </div>
    <span class="advance-row__pill" :class="[pillClass.bg, pillClass.text]">{{ status }}</span>
    <VaIcon name="mso-chevron_right" size="20px" color="secondary" />
  </VaCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AdvanceStatus } from '../../data/types'
import { statusTokens } from '../../data/severity'

const props = defineProps<{
  id: string
  name: string
  icon: string
  sub?: string
  done: number
  total: number
  status: AdvanceStatus
}>()

const pct = computed(() => Math.round((props.done / Math.max(props.total, 1)) * 100))
const pillClass = computed(() => statusTokens[props.status])
</script>

<style scoped lang="scss">
.advance-row {
  display: grid;
  grid-template-columns: 2.5rem 1fr 12rem auto auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  margin-bottom: 0.5rem;
}

.advance-row__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: var(--va-background-element);
}

.advance-row__name {
  font-weight: 600;
  font-size: 0.95rem;
}

.advance-row__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.advance-row__progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.advance-row__progress-bar {
  flex: 1;
  height: 0.5rem;
  background: var(--va-background-element);
  border-radius: 9999px;
  overflow: hidden;
}

.advance-row__progress-fill {
  display: block;
  height: 100%;
  background: var(--va-primary);
}

.advance-row__progress-label {
  font-size: 0.75rem;
  color: var(--va-secondary);
  white-space: nowrap;
}

.advance-row__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  white-space: nowrap;
}
</style>
```

- [ ] **Step 4.2: Verify dev server**

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/
```

Expect: HTTP 200. (Component not mounted yet — Tour Dates page composition is Task 6.)

- [ ] **Step 4.3: Commit**

```bash
git add src/components/tour-dates/AdvanceSectionRow.vue
git commit -m "feat(tour-dates): add AdvanceSectionRow component"
```

---

## Task 5: Tour Dates — right-rail cards (4 components)

**Files:**

- Create: `src/components/tour-dates/AdvanceMissingCard.vue`
- Create: `src/components/tour-dates/AdvanceQuickContactsCard.vue`
- Create: `src/components/tour-dates/AdvanceNotesCard.vue`
- Create: `src/components/tour-dates/AdvanceUpdatesCard.vue`

- [ ] **Step 5.1: Create `AdvanceMissingCard.vue`**

```vue
<!-- src/components/tour-dates/AdvanceMissingCard.vue -->
<template>
  <VaCard class="amc">
    <div class="amc__head">
      <VaIcon name="mso-warning" size="18px" color="secondary" />
      <span class="amc__title">Missing Items</span>
    </div>
    <ul class="amc__list">
      <li v-for="item in items" :key="item.id" class="amc__row">
        <div class="amc__body">
          <div class="amc__name">{{ item.title }}</div>
          <div class="amc__sub">{{ item.sub }}</div>
        </div>
        <span class="amc__pill" :class="[severityTokens[item.severity].bg, severityTokens[item.severity].text]">
          {{ item.severity }}
        </span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { AdvanceMissingItem } from '../../data/types'
import { severityTokens } from '../../data/severity'

defineProps<{ items: AdvanceMissingItem[] }>()
</script>

<style scoped lang="scss">
.amc {
  padding: 1.25rem;
}
.amc__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.amc__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.amc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.amc__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.amc__row:last-child {
  border-bottom: none;
}
.amc__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.amc__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.amc__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
</style>
```

- [ ] **Step 5.2: Create `AdvanceQuickContactsCard.vue`**

```vue
<!-- src/components/tour-dates/AdvanceQuickContactsCard.vue -->
<template>
  <VaCard class="aqc">
    <div class="aqc__head">
      <VaIcon name="mso-group" size="18px" color="secondary" />
      <span class="aqc__title">Quick Contacts</span>
    </div>
    <ul class="aqc__list">
      <li v-for="c in contacts" :key="c.role" class="aqc__row">
        <div class="aqc__body">
          <div class="aqc__name">{{ c.name }}</div>
          <div class="aqc__sub">{{ c.role }}</div>
        </div>
        <VaButton preset="secondary" size="small" icon="mso-call" :aria-label="`Call ${c.name}`" />
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { QuickContact } from '../../data/types'

defineProps<{ contacts: QuickContact[] }>()
</script>

<style scoped lang="scss">
.aqc {
  padding: 1.25rem;
}
.aqc__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.aqc__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.aqc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.aqc__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.aqc__row:last-child {
  border-bottom: none;
}
.aqc__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.aqc__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
</style>
```

- [ ] **Step 5.3: Create `AdvanceNotesCard.vue`**

```vue
<!-- src/components/tour-dates/AdvanceNotesCard.vue -->
<template>
  <VaCard class="anc">
    <div class="anc__head">
      <VaIcon name="mso-sticky_note_2" size="18px" color="secondary" />
      <span class="anc__title">Notes</span>
    </div>
    <ul class="anc__list">
      <li v-for="note in notes" :key="note.id" class="anc__row">
        <div class="anc__body">{{ note.body }}</div>
        <div class="anc__meta">
          <span class="anc__when">{{ formatRelativeDateTime(note.at) }}</span>
          <VaAvatar size="small" color="secondary">{{ note.authorInitials }}</VaAvatar>
        </div>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { NoteEntry } from '../../data/types'
import { formatRelativeDateTime } from '../../data/format'

defineProps<{ notes: NoteEntry[] }>()
</script>

<style scoped lang="scss">
.anc {
  padding: 1.25rem;
}
.anc__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.anc__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.anc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.anc__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: start;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.anc__row:last-child {
  border-bottom: none;
}
.anc__body {
  font-size: 0.875rem;
  line-height: 1.4;
}
.anc__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  white-space: nowrap;
}
.anc__when {
  font-size: 0.75rem;
  color: var(--va-secondary);
}
</style>
```

- [ ] **Step 5.4: Create `AdvanceUpdatesCard.vue`**

```vue
<!-- src/components/tour-dates/AdvanceUpdatesCard.vue -->
<template>
  <VaCard class="auc">
    <div class="auc__head">
      <VaIcon name="mso-history" size="18px" color="secondary" />
      <span class="auc__title">Recent Updates</span>
    </div>
    <ul class="auc__list">
      <li v-for="u in updates" :key="u.id" class="auc__row">
        <span class="auc__dot" />
        <div class="auc__body">{{ u.body }}</div>
        <span class="auc__when">{{ formatRelativeDateTime(u.at) }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { AdvanceUpdate } from '../../data/types'
import { formatRelativeDateTime } from '../../data/format'

defineProps<{ updates: AdvanceUpdate[] }>()
</script>

<style scoped lang="scss">
.auc {
  padding: 1.25rem;
}
.auc__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.auc__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.auc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.auc__row {
  display: grid;
  grid-template-columns: 0.5rem 1fr auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.auc__row:last-child {
  border-bottom: none;
}
.auc__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--va-primary);
}
.auc__body {
  font-size: 0.875rem;
}
.auc__when {
  font-size: 0.75rem;
  color: var(--va-secondary);
  white-space: nowrap;
}
</style>
```

- [ ] **Step 5.5: Verify + commit**

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/
git add src/components/tour-dates/
git commit -m "feat(tour-dates): add 4 right-rail cards (Missing, QuickContacts, Notes, Updates)"
```

---

## Task 6: Tour Dates page composition

**Files:**

- Modify: `src/pages/TourDates.vue` (replace stub with full page)

- [ ] **Step 6.1: Overwrite `src/pages/TourDates.vue`**

```vue
<!-- src/pages/TourDates.vue -->
<template>
  <div class="page page--tour-dates">
    <PageHeader>
      <template #title>Advance Checklist</template>
      <template #subtitle>
        <div class="page--tour-dates__sub">
          <ShowSwitcher :name="advanceCurrentShow.label" />
          <span class="page--tour-dates__date">{{ advanceCurrentShow.date }}</span>
        </div>
      </template>
    </PageHeader>

    <KpiRow :kpis="advanceKpis" />

    <div class="page--tour-dates__body">
      <section class="page--tour-dates__main">
        <AdvanceSectionRow v-for="s in advanceSections" :key="s.id" v-bind="s" />
      </section>

      <aside class="page--tour-dates__rail">
        <AdvanceMissingCard :items="advanceMissing" />
        <AdvanceQuickContactsCard :contacts="advanceQuickContacts" />
        <AdvanceNotesCard :notes="advanceNotes" />
        <AdvanceUpdatesCard :updates="advanceUpdates" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import ShowSwitcher from '../components/ShowSwitcher.vue'
import KpiRow from '../components/KpiRow.vue'
import AdvanceSectionRow from '../components/tour-dates/AdvanceSectionRow.vue'
import AdvanceMissingCard from '../components/tour-dates/AdvanceMissingCard.vue'
import AdvanceQuickContactsCard from '../components/tour-dates/AdvanceQuickContactsCard.vue'
import AdvanceNotesCard from '../components/tour-dates/AdvanceNotesCard.vue'
import AdvanceUpdatesCard from '../components/tour-dates/AdvanceUpdatesCard.vue'
import {
  advanceCurrentShow,
  advanceKpis,
  advanceSections,
  advanceMissing,
  advanceQuickContacts,
  advanceNotes,
  advanceUpdates,
} from '../data/tourDates'
</script>

<style scoped lang="scss">
.page--tour-dates {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page--tour-dates__sub {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.page--tour-dates__date {
  font-size: 0.875rem;
  color: var(--va-secondary);
}

.page--tour-dates__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 1024px) {
  .page--tour-dates__body {
    grid-template-columns: 2fr 1fr;
  }
}

.page--tour-dates__rail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
```

- [ ] **Step 6.2: Verify + commit**

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/tour-dates
```

Expect: HTTP 200. Browser at `/tour-dates` shows the Advance Checklist with header, 3 KPIs, 11 advance sections, and 4 right-rail cards.

```bash
git add src/pages/TourDates.vue
git commit -m "feat(tour-dates): compose Advance Checklist page"
```

---

## Task 7: Shows fixtures

**Files:**

- Create: `src/data/shows.ts`

- [ ] **Step 7.1: Create `src/data/shows.ts`**

```ts
// src/data/shows.ts — Show Detail fixture (matches mock 3 — The Ryman)
import type { ShowDetail } from './types'
import { todayTimeline, quickContacts } from './dashboard'

export const showDetail: ShowDetail = {
  id: 'show-may-20',
  title: 'The Ryman — Nashville, TN',
  dateIso: '2026-05-20',
  dateLong: 'Tuesday, May 20',
  snapshot: {
    venue: 'The Ryman',
    address: '116 5th Ave N, Nashville, TN 37219',
    capacity: 2362,
    doors: '7:00 PM',
    showStart: '7:30 PM',
    setLength: '90 min',
    support: 'Local opener — TBA',
    ageRestriction: 'All ages',
    ticketSales: { sold: 2210, capacity: 2362 },
  },
  schedule: todayTimeline, // reuses dashboard's todayTimeline (5 events for May 20)
  contacts: quickContacts, // reuses dashboard's 4-contact set
  guestList: { capacity: 2362, sold: 2210, holds: 24, comps: 16, onList: 8 },
  hospitality: {
    rider: 'Standard rider — see attachments. Vegetarian options required for 3 of 8 crew.',
    bullets: [
      'Two cases bottled water in green room',
      'Hot meal at 5:00 PM for 12',
      'Coffee + tea service from load-in through soundcheck',
    ],
  },
  openTasks: [
    { id: 'ot1', title: 'Confirm runner pickup time', due: 'Today', severity: 'High' },
    { id: 'ot2', title: 'Send guest list update to box office', due: 'Tomorrow', severity: 'Medium' },
    { id: 'ot3', title: 'Print stage plot for crew', due: 'May 20', severity: 'Low' },
  ],
  settlement: { gross: 165400, expenses: 22300, net: 143100, status: 'Estimated' },
  attachments: [
    { id: 'a1', name: 'Ryman_Contract.pdf', type: 'PDF', sizeKb: 412 },
    { id: 'a2', name: 'StagePlot_v3.pdf', type: 'PDF', sizeKb: 88 },
    { id: 'a3', name: 'TechRider.pdf', type: 'PDF', sizeKb: 156 },
    { id: 'a4', name: 'Hospitality_v2.doc', type: 'Doc', sizeKb: 24 },
  ],
  recentActivity: [
    { id: 'r1', body: 'Stage plot v3 uploaded by JM', at: '2026-05-19T14:22:00' },
    { id: 'r2', body: 'Hotel block reconfirmed (5 rooms)', at: '2026-05-19T10:08:00' },
    { id: 'r3', body: 'Hospitality rider revised by promoter', at: '2026-05-18T16:40:00' },
    { id: 'r4', body: 'Guest list opened for additions', at: '2026-05-17T09:15:00' },
  ],
}
```

- [ ] **Step 7.2: Verify TS + commit**

```bash
npx vue-tsc --noEmit 2>&1 | grep -E "shows\.ts" | head -5
git add src/data/shows.ts
git commit -m "feat(data): add Shows show-detail fixture"
```

---

## Task 8: Shows row 1 — Snapshot, Schedule, Contacts cards

**Files:**

- Create: `src/components/shows/ShowSnapshotCard.vue`
- Create: `src/components/shows/ShowScheduleCard.vue`
- Create: `src/components/shows/ShowContactsCard.vue`

- [ ] **Step 8.1: Create `ShowSnapshotCard.vue`**

```vue
<!-- src/components/shows/ShowSnapshotCard.vue -->
<template>
  <VaCard class="show-snap">
    <div class="show-snap__head">
      <VaIcon name="mso-stadium" size="18px" color="secondary" />
      <span class="show-snap__title">Show Snapshot</span>
    </div>
    <dl class="show-snap__list">
      <div class="show-snap__row">
        <dt>Venue</dt>
        <dd>{{ venue }}</dd>
      </div>
      <div class="show-snap__row">
        <dt>Address</dt>
        <dd>{{ address }}</dd>
      </div>
      <div class="show-snap__row">
        <dt>Capacity</dt>
        <dd>{{ capacity.toLocaleString() }}</dd>
      </div>
      <div class="show-snap__row">
        <dt>Doors</dt>
        <dd>{{ doors }}</dd>
      </div>
      <div class="show-snap__row">
        <dt>Show Start</dt>
        <dd>{{ showStart }}</dd>
      </div>
      <div class="show-snap__row">
        <dt>Set Length</dt>
        <dd>{{ setLength }}</dd>
      </div>
      <div class="show-snap__row">
        <dt>Support</dt>
        <dd>{{ support }}</dd>
      </div>
      <div v-if="ageRestriction" class="show-snap__row">
        <dt>Age</dt>
        <dd>{{ ageRestriction }}</dd>
      </div>
      <div v-if="ticketSales" class="show-snap__row">
        <dt>Sold</dt>
        <dd>{{ ticketSales.sold.toLocaleString() }} / {{ ticketSales.capacity.toLocaleString() }}</dd>
      </div>
    </dl>
  </VaCard>
</template>

<script setup lang="ts">
import type { ShowSnapshot } from '../../data/types'

defineProps<ShowSnapshot>()
</script>

<style scoped lang="scss">
.show-snap {
  padding: 1.25rem;
}
.show-snap__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-snap__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-snap__list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.show-snap__row {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 0.75rem;
  padding: 0.25rem 0;
}
.show-snap__row dt {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  margin: 0;
}
.show-snap__row dd {
  font-size: 0.875rem;
  margin: 0;
  font-weight: 500;
}
</style>
```

- [ ] **Step 8.2: Create `ShowScheduleCard.vue`**

```vue
<!-- src/components/shows/ShowScheduleCard.vue -->
<template>
  <VaCard class="show-sched">
    <div class="show-sched__head">
      <VaIcon name="mso-schedule" size="18px" color="secondary" />
      <span class="show-sched__title">Schedule</span>
    </div>
    <ul class="show-sched__timeline">
      <li v-for="ev in events" :key="ev.id" class="show-sched__item">
        <div class="show-sched__rail"><span class="show-sched__dot" /></div>
        <div class="show-sched__time">{{ ev.time }}</div>
        <div class="show-sched__body">
          <div class="show-sched__name">{{ ev.title }}</div>
          <div class="show-sched__sub">{{ ev.sub }}</div>
        </div>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { TimelineEvent } from '../../data/types'

defineProps<{ events: TimelineEvent[] }>()
</script>

<style scoped lang="scss">
.show-sched {
  padding: 1.25rem;
}
.show-sched__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-sched__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-sched__timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.show-sched__item {
  display: grid;
  grid-template-columns: 1rem 4rem 1fr;
  gap: 0.75rem;
  align-items: start;
  padding: 0.5rem 0;
  position: relative;
}
.show-sched__rail {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
}
.show-sched__rail::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--va-background-border);
}
.show-sched__item:first-child .show-sched__rail::before {
  top: 0.5rem;
}
.show-sched__item:last-child .show-sched__rail::before {
  bottom: calc(100% - 0.5rem);
}
.show-sched__dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: var(--va-primary);
  margin-top: 0.5rem;
  z-index: 1;
}
.show-sched__time {
  font-size: 0.8125rem;
  font-weight: 600;
  padding-top: 0.25rem;
}
.show-sched__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.show-sched__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
</style>
```

- [ ] **Step 8.3: Create `ShowContactsCard.vue`**

```vue
<!-- src/components/shows/ShowContactsCard.vue -->
<template>
  <VaCard class="show-contacts">
    <div class="show-contacts__head">
      <VaIcon name="mso-group" size="18px" color="secondary" />
      <span class="show-contacts__title">Contacts</span>
    </div>
    <ul class="show-contacts__list">
      <li v-for="c in contacts" :key="c.role" class="show-contacts__row">
        <div class="show-contacts__role">{{ c.role }}</div>
        <div class="show-contacts__name">{{ c.name }}</div>
        <div class="show-contacts__phone">{{ c.phone }}</div>
        <VaButton preset="secondary" size="small" icon="mso-call" :aria-label="`Call ${c.name}`" />
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { QuickContact } from '../../data/types'

defineProps<{ contacts: QuickContact[] }>()
</script>

<style scoped lang="scss">
.show-contacts {
  padding: 1.25rem;
}
.show-contacts__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-contacts__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-contacts__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.show-contacts__row {
  display: grid;
  grid-template-columns: 6rem 1fr auto auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.show-contacts__row:last-child {
  border-bottom: none;
}
.show-contacts__role {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.show-contacts__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.show-contacts__phone {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  white-space: nowrap;
}
</style>
```

- [ ] **Step 8.4: Verify + commit**

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/
git add src/components/shows/
git commit -m "feat(shows): add Snapshot, Schedule, Contacts cards (row 1)"
```

---

## Task 9: Shows row 2 — GuestList, Hospitality, OpenTasks cards

**Files:**

- Create: `src/components/shows/ShowGuestListCard.vue`
- Create: `src/components/shows/ShowHospitalityCard.vue`
- Create: `src/components/shows/ShowOpenTasksCard.vue`

- [ ] **Step 9.1: Create `ShowGuestListCard.vue`**

```vue
<!-- src/components/shows/ShowGuestListCard.vue -->
<template>
  <VaCard class="show-gl">
    <div class="show-gl__head">
      <VaIcon name="mso-list_alt" size="18px" color="secondary" />
      <span class="show-gl__title">Guest List & Holds</span>
    </div>
    <dl class="show-gl__list">
      <div class="show-gl__row">
        <dt>Capacity</dt>
        <dd>{{ data.capacity.toLocaleString() }}</dd>
      </div>
      <div class="show-gl__row">
        <dt>Sold</dt>
        <dd>{{ data.sold.toLocaleString() }}</dd>
      </div>
      <div class="show-gl__row">
        <dt>Holds</dt>
        <dd>{{ data.holds }}</dd>
      </div>
      <div class="show-gl__row">
        <dt>Comps</dt>
        <dd>{{ data.comps }}</dd>
      </div>
      <div class="show-gl__row">
        <dt>On List</dt>
        <dd>{{ data.onList }}</dd>
      </div>
    </dl>
  </VaCard>
</template>

<script setup lang="ts">
import type { ShowGuestListData } from '../../data/types'

defineProps<{ data: ShowGuestListData }>()
</script>

<style scoped lang="scss">
.show-gl {
  padding: 1.25rem;
}
.show-gl__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-gl__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-gl__list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.show-gl__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.show-gl__row:last-child {
  border-bottom: none;
}
.show-gl__row dt {
  font-size: 0.875rem;
  color: var(--va-secondary);
  margin: 0;
}
.show-gl__row dd {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}
</style>
```

- [ ] **Step 9.2: Create `ShowHospitalityCard.vue`**

```vue
<!-- src/components/shows/ShowHospitalityCard.vue -->
<template>
  <VaCard class="show-hosp">
    <div class="show-hosp__head">
      <VaIcon name="mso-restaurant" size="18px" color="secondary" />
      <span class="show-hosp__title">Hospitality / Notes</span>
    </div>
    <p class="show-hosp__rider">{{ notes.rider }}</p>
    <ul class="show-hosp__bullets">
      <li v-for="(b, i) in notes.bullets" :key="i">{{ b }}</li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
defineProps<{ notes: { rider: string; bullets: string[] } }>()
</script>

<style scoped lang="scss">
.show-hosp {
  padding: 1.25rem;
}
.show-hosp__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.show-hosp__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-hosp__rider {
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 0 0 0.75rem;
}
.show-hosp__bullets {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.5;
}
.show-hosp__bullets li {
  margin-bottom: 0.25rem;
}
</style>
```

- [ ] **Step 9.3: Create `ShowOpenTasksCard.vue`**

```vue
<!-- src/components/shows/ShowOpenTasksCard.vue -->
<template>
  <VaCard class="show-tasks">
    <div class="show-tasks__head">
      <VaIcon name="mso-task_alt" size="18px" color="secondary" />
      <span class="show-tasks__title">Open Tasks</span>
    </div>
    <ul class="show-tasks__list">
      <li v-for="t in tasks" :key="t.id" class="show-tasks__row">
        <span class="show-tasks__check"><VaIcon name="mso-radio_button_unchecked" size="16px" /></span>
        <div class="show-tasks__body">{{ t.title }}</div>
        <span
          v-if="t.severity"
          class="show-tasks__pill"
          :class="[severityTokens[t.severity].bg, severityTokens[t.severity].text]"
        >
          {{ t.due }}
        </span>
        <span v-else class="show-tasks__due">{{ t.due }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { Severity } from '../../data/types'
import { severityTokens } from '../../data/severity'

defineProps<{
  tasks: { id: string; title: string; due: string; severity?: Severity }[]
}>()
</script>

<style scoped lang="scss">
.show-tasks {
  padding: 1.25rem;
}
.show-tasks__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-tasks__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-tasks__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.show-tasks__row {
  display: grid;
  grid-template-columns: 1.25rem 1fr auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.show-tasks__row:last-child {
  border-bottom: none;
}
.show-tasks__body {
  font-size: 0.875rem;
}
.show-tasks__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  white-space: nowrap;
}
.show-tasks__due {
  font-size: 0.75rem;
  color: var(--va-secondary);
  white-space: nowrap;
}
</style>
```

- [ ] **Step 9.4: Verify + commit**

```bash
git add src/components/shows/
git commit -m "feat(shows): add GuestList, Hospitality, OpenTasks cards (row 2)"
```

---

## Task 10: Shows row 3 — Settlement, Attachments, RecentActivity cards

**Files:**

- Create: `src/components/shows/ShowSettlementCard.vue`
- Create: `src/components/shows/ShowAttachmentsCard.vue`
- Create: `src/components/shows/ShowRecentActivityCard.vue`

- [ ] **Step 10.1: Create `ShowSettlementCard.vue`**

```vue
<!-- src/components/shows/ShowSettlementCard.vue -->
<template>
  <VaCard class="show-sett">
    <div class="show-sett__head">
      <VaIcon name="mso-attach_money" size="18px" color="secondary" />
      <span class="show-sett__title">Settlement Snapshot</span>
      <span
        class="show-sett__pill"
        :class="[
          statusTokens[data.status === 'Settled' ? 'Confirmed' : data.status === 'Pending' ? 'Pending' : 'Pending'].bg,
          statusTokens[data.status === 'Settled' ? 'Confirmed' : data.status === 'Pending' ? 'Pending' : 'Pending']
            .text,
        ]"
      >
        {{ data.status }}
      </span>
    </div>
    <dl class="show-sett__list">
      <div class="show-sett__row">
        <dt>Gross</dt>
        <dd>{{ formatUsd(data.gross) }}</dd>
      </div>
      <div class="show-sett__row">
        <dt>Expenses</dt>
        <dd>{{ formatUsd(data.expenses) }}</dd>
      </div>
      <div class="show-sett__row show-sett__row--net">
        <dt>Net</dt>
        <dd>{{ formatUsd(data.net) }}</dd>
      </div>
    </dl>
  </VaCard>
</template>

<script setup lang="ts">
import type { ShowSettlementSnapshot } from '../../data/types'
import { statusTokens } from '../../data/severity'
import { formatUsd } from '../../data/format'

defineProps<{ data: ShowSettlementSnapshot }>()
</script>

<style scoped lang="scss">
.show-sett {
  padding: 1.25rem;
}
.show-sett__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-sett__title {
  font-weight: 600;
  font-size: 0.95rem;
  flex: 1;
}
.show-sett__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
.show-sett__list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.show-sett__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.show-sett__row:last-child {
  border-bottom: none;
}
.show-sett__row dt {
  font-size: 0.875rem;
  color: var(--va-secondary);
  margin: 0;
}
.show-sett__row dd {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}
.show-sett__row--net dt,
.show-sett__row--net dd {
  font-size: 1rem;
  font-weight: 700;
}
</style>
```

- [ ] **Step 10.2: Create `ShowAttachmentsCard.vue`**

```vue
<!-- src/components/shows/ShowAttachmentsCard.vue -->
<template>
  <VaCard class="show-att">
    <div class="show-att__head">
      <VaIcon name="mso-attach_file" size="18px" color="secondary" />
      <span class="show-att__title">Attachments / Documents</span>
    </div>
    <ul class="show-att__list">
      <li v-for="f in files" :key="f.id" class="show-att__row">
        <VaIcon name="mso-description" size="18px" color="secondary" />
        <div class="show-att__body">
          <div class="show-att__name">{{ f.name }}</div>
          <div class="show-att__sub">{{ f.type }} · {{ f.sizeKb }} KB</div>
        </div>
        <VaIcon name="mso-download" size="18px" color="secondary" />
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { ShowAttachment } from '../../data/types'

defineProps<{ files: ShowAttachment[] }>()
</script>

<style scoped lang="scss">
.show-att {
  padding: 1.25rem;
}
.show-att__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-att__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-att__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.show-att__row {
  display: grid;
  grid-template-columns: 1.25rem 1fr auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.show-att__row:last-child {
  border-bottom: none;
}
.show-att__name {
  font-size: 0.875rem;
  font-weight: 500;
}
.show-att__sub {
  font-size: 0.75rem;
  color: var(--va-secondary);
}
</style>
```

- [ ] **Step 10.3: Create `ShowRecentActivityCard.vue`**

```vue
<!-- src/components/shows/ShowRecentActivityCard.vue -->
<template>
  <VaCard class="show-act">
    <div class="show-act__head">
      <VaIcon name="mso-history" size="18px" color="secondary" />
      <span class="show-act__title">Recent Activity</span>
    </div>
    <ul class="show-act__list">
      <li v-for="e in entries" :key="e.id" class="show-act__row">
        <span class="show-act__dot" />
        <div class="show-act__body">{{ e.body }}</div>
        <span class="show-act__when">{{ formatRelativeDateTime(e.at) }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { ShowActivityEntry } from '../../data/types'
import { formatRelativeDateTime } from '../../data/format'

defineProps<{ entries: ShowActivityEntry[] }>()
</script>

<style scoped lang="scss">
.show-act {
  padding: 1.25rem;
}
.show-act__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-act__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-act__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.show-act__row {
  display: grid;
  grid-template-columns: 0.5rem 1fr auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.show-act__row:last-child {
  border-bottom: none;
}
.show-act__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--va-primary);
}
.show-act__body {
  font-size: 0.875rem;
}
.show-act__when {
  font-size: 0.75rem;
  color: var(--va-secondary);
  white-space: nowrap;
}
</style>
```

- [ ] **Step 10.4: Verify + commit**

```bash
git add src/components/shows/
git commit -m "feat(shows): add Settlement, Attachments, RecentActivity cards (row 3)"
```

---

## Task 11: Shows page composition

**Files:**

- Modify: `src/pages/Shows.vue`

- [ ] **Step 11.1: Overwrite `src/pages/Shows.vue`**

```vue
<!-- src/pages/Shows.vue -->
<template>
  <div class="page page--shows">
    <PageHeader>
      <template #breadcrumb>
        <Breadcrumb :items="['Tour Dashboard', 'Shows', 'May 20']" />
      </template>
      <template #title>
        <ShowSwitcher :name="showDetail.title" />
      </template>
      <template #subtitle>
        <span class="page--shows__date">{{ showDetail.dateLong }}</span>
      </template>
      <template #actions>
        <VaButton preset="secondary" size="small" icon="mso-edit">Edit Show</VaButton>
        <VaButton preset="secondary" size="small" icon="mso-more_horiz">Show Actions</VaButton>
      </template>
    </PageHeader>

    <section class="page--shows__row">
      <ShowSnapshotCard v-bind="showDetail.snapshot" />
      <ShowScheduleCard :events="showDetail.schedule" />
      <ShowContactsCard :contacts="showDetail.contacts" />
    </section>

    <section class="page--shows__row">
      <ShowGuestListCard :data="showDetail.guestList" />
      <ShowHospitalityCard :notes="showDetail.hospitality" />
      <ShowOpenTasksCard :tasks="showDetail.openTasks" />
    </section>

    <section class="page--shows__row">
      <ShowSettlementCard :data="showDetail.settlement" />
      <ShowAttachmentsCard :files="showDetail.attachments" />
      <ShowRecentActivityCard :entries="showDetail.recentActivity" />
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import ShowSwitcher from '../components/ShowSwitcher.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import ShowSnapshotCard from '../components/shows/ShowSnapshotCard.vue'
import ShowScheduleCard from '../components/shows/ShowScheduleCard.vue'
import ShowContactsCard from '../components/shows/ShowContactsCard.vue'
import ShowGuestListCard from '../components/shows/ShowGuestListCard.vue'
import ShowHospitalityCard from '../components/shows/ShowHospitalityCard.vue'
import ShowOpenTasksCard from '../components/shows/ShowOpenTasksCard.vue'
import ShowSettlementCard from '../components/shows/ShowSettlementCard.vue'
import ShowAttachmentsCard from '../components/shows/ShowAttachmentsCard.vue'
import ShowRecentActivityCard from '../components/shows/ShowRecentActivityCard.vue'
import { showDetail } from '../data/shows'
</script>

<style scoped lang="scss">
.page--shows {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page--shows__date {
  font-size: 0.875rem;
  color: var(--va-secondary);
  margin-top: 0.25rem;
  display: inline-block;
}
.page--shows__row {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}
@media (min-width: 1024px) {
  .page--shows__row {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
```

- [ ] **Step 11.2: Verify + commit**

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/shows
git add src/pages/Shows.vue
git commit -m "feat(shows): compose Show Detail page"
```

---

## Task 12: Travel fixtures

**Files:**

- Create: `src/data/travel.ts`

- [ ] **Step 12.1: Create `src/data/travel.ts`**

```ts
// src/data/travel.ts — Travel & Hotels fixtures (matches mock 4)
import type { Kpi, TravelCheckIn, TravelIssue, TravelSegment, TravelTrip } from './types'

export const travelKpis: Kpi[] = [
  { icon: 'mso-flight_takeoff', label: 'Upcoming Travel Days', value: '14', sub: 'Next 30 days' },
  { icon: 'mso-flight', label: 'Flights Booked', value: '12', sub: 'Confirmed' },
  { icon: 'mso-hotel', label: 'Hotels Confirmed', value: '10', sub: 'All cities' },
  { icon: 'mso-warning', label: 'Travel Changes', value: '3', sub: 'Need review' },
]

export const travelSelectedId = 'sel'

export const travelSegments: TravelSegment[] = [
  {
    id: 't1',
    date: '2026-05-20',
    tripNumber: 'T-101',
    origin: 'ATL',
    destination: 'BNA',
    mode: 'Flight',
    hotel: 'Grand Hyatt Nashville',
    status: 'Confirmed',
    confirmation: 'DL-7820',
  },
  {
    id: 't2',
    date: '2026-05-21',
    tripNumber: 'T-102',
    origin: 'BNA',
    destination: 'ATL',
    mode: 'Flight',
    hotel: 'Tabernacle Suites',
    status: 'Confirmed',
    confirmation: 'DL-7821',
  },
  {
    id: 't3',
    date: '2026-05-22',
    tripNumber: 'T-103',
    origin: 'ATL',
    destination: 'MSY',
    mode: 'Flight',
    hotel: 'NOLA Garden Hotel',
    status: 'Confirmed',
    confirmation: 'DL-7842',
  },
  {
    id: 'sel',
    date: '2026-05-23',
    tripNumber: 'T-104',
    origin: 'MSY',
    destination: 'BHM',
    mode: 'Drive',
    hotel: 'Iron City Hotel',
    status: 'Pending',
    confirmation: '—',
    notes: 'Driver to confirm',
  },
  {
    id: 't5',
    date: '2026-05-24',
    tripNumber: 'T-105',
    origin: 'BHM',
    destination: 'CLT',
    mode: 'Flight',
    hotel: 'Charlotte Marriott',
    status: 'Confirmed',
    confirmation: 'DL-7861',
  },
  {
    id: 't6',
    date: '2026-05-25',
    tripNumber: 'T-106',
    origin: 'CLT',
    destination: 'RDU',
    mode: 'Drive',
    hotel: 'Raleigh Inn',
    status: 'Pending',
  },
]

export const travelSelectedTrip: TravelTrip = {
  id: 'sel',
  origin: { city: 'New Orleans, LA', airport: 'MSY', date: '2026-05-23' },
  destination: { city: 'Birmingham, AL', airport: 'BHM', date: '2026-05-23' },
  hotel: { name: 'Iron City Hotel', address: '513 22nd St S, Birmingham, AL', checkIn: 'May 23', checkOut: 'May 24' },
  confirmations: [
    { kind: 'Flight', code: 'DRV-NOLA-BHM' },
    { kind: 'Hotel', code: 'HYT-22189' },
    { kind: 'Ground', code: 'PICKUP-0830' },
  ],
  party: [
    { name: 'Jane Manager', role: 'Tour Manager' },
    { name: 'Derrick Johnson', role: 'Driver' },
    { name: 'Lou Carter', role: 'Production' },
    { name: 'Sam Reyes', role: 'Sound' },
    { name: 'Eli Park', role: 'Lighting' },
  ],
}

export const travelCheckIns: TravelCheckIn[] = [
  {
    id: 'c1',
    hotel: 'Grand Hyatt Nashville',
    city: 'Nashville, TN',
    arrival: '2026-05-20',
    departure: '2026-05-21',
    status: 'Confirmed',
  },
  {
    id: 'c2',
    hotel: 'Tabernacle Suites',
    city: 'Atlanta, GA',
    arrival: '2026-05-21',
    departure: '2026-05-22',
    status: 'Confirmed',
  },
  {
    id: 'c3',
    hotel: 'NOLA Garden Hotel',
    city: 'New Orleans, LA',
    arrival: '2026-05-22',
    departure: '2026-05-23',
    status: 'Confirmed',
  },
  {
    id: 'c4',
    hotel: 'Iron City Hotel',
    city: 'Birmingham, AL',
    arrival: '2026-05-23',
    departure: '2026-05-24',
    status: 'Pending',
  },
]

export const travelIssues: TravelIssue[] = [
  { id: 'ti1', title: 'Flight time changed', sub: 'NOLA → BHM · May 23', severity: 'High' },
  { id: 'ti2', title: 'Hotel oversold', sub: 'Iron City · May 23', severity: 'Medium' },
  { id: 'ti3', title: 'Driver confirmation pending', sub: 'NOLA pickup', severity: 'Low' },
]
```

- [ ] **Step 12.2: Verify + commit**

```bash
npx vue-tsc --noEmit 2>&1 | grep -E "travel\.ts" | head -5
git add src/data/travel.ts
git commit -m "feat(data): add Travel fixtures"
```

---

## Task 13: Travel — `TravelSegmentsTable` + `TravelTripDetailsPanel`

**Files:**

- Create: `src/components/travel/TravelSegmentsTable.vue`
- Create: `src/components/travel/TravelTripDetailsPanel.vue`

- [ ] **Step 13.1: Create `TravelSegmentsTable.vue`**

```vue
<!-- src/components/travel/TravelSegmentsTable.vue -->
<template>
  <VaCard class="tst">
    <div class="tst__head">
      <span class="tst__title">Travel Segments</span>
      <div class="tst__actions">
        <VaButton preset="secondary" size="small" icon="mso-filter_list">Filters</VaButton>
        <VaButton preset="secondary" size="small" icon="mso-download">Export</VaButton>
      </div>
    </div>
    <table class="tst__table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Trip #</th>
          <th>Route</th>
          <th>Mode</th>
          <th>Hotel</th>
          <th>Status</th>
          <th>Confirmation</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in segments" :key="s.id" :class="{ 'tst__row--selected': s.id === selectedId }">
          <td>{{ formatShortDate(s.date) }}</td>
          <td>{{ s.tripNumber }}</td>
          <td>{{ s.origin }} → {{ s.destination }}</td>
          <td>{{ s.mode }}</td>
          <td>{{ s.hotel ?? '—' }}</td>
          <td>
            <span class="tst__pill" :class="[statusTokens[s.status].bg, statusTokens[s.status].text]">{{
              s.status
            }}</span>
          </td>
          <td>{{ s.confirmation ?? '—' }}</td>
        </tr>
      </tbody>
    </table>
  </VaCard>
</template>

<script setup lang="ts">
import type { TravelSegment } from '../../data/types'
import { statusTokens } from '../../data/severity'
import { formatShortDate } from '../../data/format'

defineProps<{
  segments: TravelSegment[]
  selectedId: string
}>()
</script>

<style scoped lang="scss">
.tst {
  padding: 1.25rem;
}
.tst__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.tst__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.tst__actions {
  display: flex;
  gap: 0.5rem;
}
.tst__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.tst__table th,
.tst__table td {
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid var(--va-background-border);
}
.tst__table th {
  color: var(--va-secondary);
  font-weight: 500;
  font-size: 0.75rem;
}
.tst__table tbody tr:last-child td {
  border-bottom: none;
}
.tst__row--selected {
  background: var(--va-background-element);
}
.tst__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
</style>
```

- [ ] **Step 13.2: Create `TravelTripDetailsPanel.vue`**

```vue
<!-- src/components/travel/TravelTripDetailsPanel.vue -->
<template>
  <VaCard class="ttd">
    <div class="ttd__head">
      <VaIcon name="mso-info" size="18px" color="secondary" />
      <span class="ttd__title">Selected Trip Details</span>
    </div>
    <div class="ttd__grid">
      <div class="ttd__col">
        <div class="ttd__label">Origin</div>
        <div class="ttd__primary">{{ trip.origin.city }} ({{ trip.origin.airport }})</div>
        <div class="ttd__sub">{{ trip.origin.date }}</div>
      </div>
      <div class="ttd__col">
        <div class="ttd__label">Destination</div>
        <div class="ttd__primary">{{ trip.destination.city }} ({{ trip.destination.airport }})</div>
        <div class="ttd__sub">{{ trip.destination.date }}</div>
      </div>
      <div class="ttd__col">
        <div class="ttd__label">Hotel</div>
        <div class="ttd__primary">{{ trip.hotel.name }}</div>
        <div class="ttd__sub">{{ trip.hotel.address }}</div>
        <div class="ttd__sub">{{ trip.hotel.checkIn }} – {{ trip.hotel.checkOut }}</div>
      </div>
      <div class="ttd__col">
        <div class="ttd__label">Confirmations</div>
        <ul class="ttd__list">
          <li v-for="c in trip.confirmations" :key="c.kind">
            <span>{{ c.kind }}</span
            ><code>{{ c.code }}</code>
          </li>
        </ul>
      </div>
      <div class="ttd__col ttd__col--wide">
        <div class="ttd__label">Travel Party</div>
        <ul class="ttd__list ttd__party">
          <li v-for="p in trip.party" :key="p.name">
            <span>{{ p.name }}</span
            ><span class="ttd__sub">{{ p.role }}</span>
          </li>
        </ul>
      </div>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { TravelTrip } from '../../data/types'

defineProps<{ trip: TravelTrip }>()
</script>

<style scoped lang="scss">
.ttd {
  padding: 1.25rem;
}
.ttd__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.ttd__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.ttd__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
@media (min-width: 768px) {
  .ttd__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.ttd__col--wide {
  grid-column: 1 / -1;
}
.ttd__label {
  font-size: 0.75rem;
  color: var(--va-secondary);
  margin-bottom: 0.25rem;
}
.ttd__primary {
  font-size: 0.875rem;
  font-weight: 600;
}
.ttd__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.ttd__list {
  list-style: none;
  margin: 0.25rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8125rem;
}
.ttd__list li {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}
.ttd__list code {
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  color: var(--va-secondary);
}
.ttd__party li {
  justify-content: flex-start;
  gap: 0.5rem;
}
</style>
```

- [ ] **Step 13.3: Verify + commit**

```bash
git add src/components/travel/
git commit -m "feat(travel): add TravelSegmentsTable + TravelTripDetailsPanel"
```

---

## Task 14: Travel — `TravelCheckInsCard` + `TravelIssuesCard`

**Files:**

- Create: `src/components/travel/TravelCheckInsCard.vue`
- Create: `src/components/travel/TravelIssuesCard.vue`

- [ ] **Step 14.1: Create `TravelCheckInsCard.vue`**

```vue
<!-- src/components/travel/TravelCheckInsCard.vue -->
<template>
  <VaCard class="tci">
    <div class="tci__head">
      <VaIcon name="mso-hotel" size="18px" color="secondary" />
      <span class="tci__title">Upcoming Check-Ins</span>
    </div>
    <ul class="tci__list">
      <li v-for="c in checkins" :key="c.id" class="tci__row">
        <div class="tci__body">
          <div class="tci__name">{{ c.hotel }}</div>
          <div class="tci__sub">
            {{ c.city }} · {{ formatShortDate(c.arrival) }} – {{ formatShortDate(c.departure) }}
          </div>
        </div>
        <span class="tci__pill" :class="[statusTokens[c.status].bg, statusTokens[c.status].text]">{{ c.status }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { TravelCheckIn } from '../../data/types'
import { statusTokens } from '../../data/severity'
import { formatShortDate } from '../../data/format'

defineProps<{ checkins: TravelCheckIn[] }>()
</script>

<style scoped lang="scss">
.tci {
  padding: 1.25rem;
}
.tci__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tci__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.tci__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tci__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.tci__row:last-child {
  border-bottom: none;
}
.tci__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.tci__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.tci__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
</style>
```

- [ ] **Step 14.2: Create `TravelIssuesCard.vue`**

```vue
<!-- src/components/travel/TravelIssuesCard.vue -->
<template>
  <VaCard class="tic">
    <div class="tic__head">
      <VaIcon name="mso-warning" size="18px" color="secondary" />
      <span class="tic__title">Travel Issues</span>
    </div>
    <ul class="tic__list">
      <li v-for="i in issues" :key="i.id" class="tic__row">
        <span class="tic__dot" :class="severityTokens[i.severity].dot" />
        <div class="tic__body">
          <div class="tic__name">{{ i.title }}</div>
          <div class="tic__sub">{{ i.sub }}</div>
        </div>
        <span class="tic__pill" :class="[severityTokens[i.severity].bg, severityTokens[i.severity].text]">{{
          i.severity
        }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { TravelIssue } from '../../data/types'
import { severityTokens } from '../../data/severity'

defineProps<{ issues: TravelIssue[] }>()
</script>

<style scoped lang="scss">
.tic {
  padding: 1.25rem;
}
.tic__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tic__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.tic__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tic__row {
  display: grid;
  grid-template-columns: 0.625rem 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.tic__row:last-child {
  border-bottom: none;
}
.tic__dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
}
.tic__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.tic__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.tic__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
</style>
```

- [ ] **Step 14.3: Commit**

```bash
git add src/components/travel/
git commit -m "feat(travel): add TravelCheckInsCard + TravelIssuesCard"
```

---

## Task 15: Travel page composition

**Files:**

- Modify: `src/pages/Travel.vue`

- [ ] **Step 15.1: Overwrite `src/pages/Travel.vue`**

```vue
<!-- src/pages/Travel.vue -->
<template>
  <div class="page page--travel">
    <PageHeader title="Travel & Hotels">
      <template #breadcrumb>
        <Breadcrumb :items="['Tour Dashboard', 'Travel']" />
      </template>
    </PageHeader>

    <KpiRow :kpis="travelKpis" />

    <section class="page--travel__body">
      <div class="page--travel__main">
        <TravelSegmentsTable :segments="travelSegments" :selected-id="travelSelectedId" />
        <TravelTripDetailsPanel :trip="travelSelectedTrip" />
      </div>

      <aside class="page--travel__rail">
        <TravelCheckInsCard :checkins="travelCheckIns" />
        <TravelIssuesCard :issues="travelIssues" />
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import KpiRow from '../components/KpiRow.vue'
import TravelSegmentsTable from '../components/travel/TravelSegmentsTable.vue'
import TravelTripDetailsPanel from '../components/travel/TravelTripDetailsPanel.vue'
import TravelCheckInsCard from '../components/travel/TravelCheckInsCard.vue'
import TravelIssuesCard from '../components/travel/TravelIssuesCard.vue'
import {
  travelKpis,
  travelSegments,
  travelSelectedId,
  travelSelectedTrip,
  travelCheckIns,
  travelIssues,
} from '../data/travel'
</script>

<style scoped lang="scss">
.page--travel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page--travel__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 1024px) {
  .page--travel__body {
    grid-template-columns: 2fr 1fr;
  }
}
.page--travel__main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page--travel__rail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
```

- [ ] **Step 15.2: Verify + commit**

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/travel
git add src/pages/Travel.vue
git commit -m "feat(travel): compose Travel & Hotels page"
```

---

## Task 16: Contacts fixtures

**Files:**

- Create: `src/data/contacts.ts`

- [ ] **Step 16.1: Create `src/data/contacts.ts`**

```ts
// src/data/contacts.ts — Contacts directory + selected contact (matches mock 5)
import type { Contact, ContactDetail, Kpi } from './types'

export const contactsKpis: Kpi[] = [
  { icon: 'mso-group', label: 'Total Contacts', value: '642', sub: 'All contacts' },
  { icon: 'mso-stadium', label: 'Venues', value: '185', sub: '29% of total' },
  { icon: 'mso-campaign', label: 'Promoters', value: '218', sub: '34% of total' },
  { icon: 'mso-flight', label: 'Travel/Hotel', value: '96', sub: '15% of total' },
]

export const contactsSelectedId = 'sel'

export const contactsDirectory: Contact[] = [
  {
    id: 'sel',
    role: 'Venue Manager',
    name: 'Sarah Williams',
    company: 'The Ryman',
    city: 'Nashville, TN',
    phones: ['(615) 889-3060'],
    email: 'sarah@ryman.com',
    lastShowDate: '2026-05-20',
  },
  {
    id: 'c2',
    role: 'Promoter',
    name: 'Mike Reynolds',
    company: 'AC Entertainment',
    city: 'Nashville, TN',
    phones: ['(615) 555-2194'],
    email: 'mike@acentertainment.com',
    lastShowDate: '2026-05-20',
  },
  {
    id: 'c3',
    role: 'Driver',
    name: 'Derrick Johnson',
    company: 'JD Tour Logistics',
    city: 'Nashville, TN',
    phones: ['(615) 555-7788'],
    email: 'derrick@jdtour.com',
    lastShowDate: '2026-05-20',
  },
  {
    id: 'c4',
    role: 'Hotel',
    name: 'Grand Hyatt Nashville',
    company: 'Hyatt',
    city: 'Nashville, TN',
    phones: ['(615) 724-1234'],
    email: 'concierge@hyattnashville.com',
    lastShowDate: '2026-05-20',
  },
  {
    id: 'c5',
    role: 'Venue Manager',
    name: 'Trent Davis',
    company: 'Tabernacle',
    city: 'Atlanta, GA',
    phones: ['(404) 659-9022'],
    email: 'trent@tabernacleatl.com',
    lastShowDate: '2026-05-21',
  },
  {
    id: 'c6',
    role: 'Promoter',
    name: 'Carla Reed',
    company: 'Live Nation Atlanta',
    city: 'Atlanta, GA',
    phones: ['(404) 555-1182'],
    email: 'carla@livenation.com',
    lastShowDate: '2026-05-21',
  },
  {
    id: 'c7',
    role: 'Production',
    name: 'Lou Carter',
    company: 'Carter Production',
    city: 'Atlanta, GA',
    phones: ['(404) 555-7710'],
    email: 'lou@carterprod.com',
    lastShowDate: '2026-05-21',
  },
  {
    id: 'c8',
    role: 'Venue Manager',
    name: 'Maya Pierre',
    company: 'The Fillmore NOLA',
    city: 'New Orleans, LA',
    phones: ['(504) 555-8810'],
    email: 'maya@fillmorenola.com',
    lastShowDate: '2026-05-22',
  },
  {
    id: 'c9',
    role: 'Hotel',
    name: 'NOLA Garden Hotel',
    company: 'Marriott',
    city: 'New Orleans, LA',
    phones: ['(504) 555-3120'],
    email: 'rooms@nolagardenhotel.com',
    lastShowDate: '2026-05-22',
  },
  {
    id: 'c10',
    role: 'Catering',
    name: 'Big Easy Catering',
    company: 'Independent',
    city: 'New Orleans, LA',
    phones: ['(504) 555-7012'],
    email: 'orders@bigeasycatering.com',
  },
  {
    id: 'c11',
    role: 'Venue Manager',
    name: 'Owen Park',
    company: 'Iron City',
    city: 'Birmingham, AL',
    phones: ['(205) 555-2024'],
    email: 'owen@ironcityalabama.com',
    lastShowDate: '2026-05-23',
  },
  {
    id: 'c12',
    role: 'Promoter',
    name: 'Jenna Hayes',
    company: 'Magic City Live',
    city: 'Birmingham, AL',
    phones: ['(205) 555-9988'],
    email: 'jenna@magiccitylive.com',
    lastShowDate: '2026-05-23',
  },
  {
    id: 'c13',
    role: 'Venue Manager',
    name: 'Dean Foster',
    company: 'The Fillmore Charlotte',
    city: 'Charlotte, NC',
    phones: ['(704) 555-4400'],
    email: 'dean@fillmorecharlotte.com',
    lastShowDate: '2026-05-24',
  },
  {
    id: 'c14',
    role: 'Sound',
    name: 'Ravi Patel',
    company: 'PA Pros',
    city: 'Charlotte, NC',
    phones: ['(704) 555-6612'],
    email: 'ravi@papros.com',
  },
  {
    id: 'c15',
    role: 'Lighting',
    name: 'Kim Tran',
    company: 'LightWorks',
    city: 'Charlotte, NC',
    phones: ['(704) 555-2255'],
    email: 'kim@lightworks.com',
  },
]

export const contactsSelectedContact: ContactDetail = {
  id: 'sel',
  role: 'Venue Manager',
  name: 'Sarah Williams',
  company: 'The Ryman',
  city: 'Nashville, TN',
  phones: ['(615) 889-3060', '(615) 555-0102'],
  email: 'sarah@ryman.com',
  altEmails: ['sarah.williams@rymanmgmt.com'],
  address: '116 5th Ave N, Nashville, TN 37219',
  notes: 'Prefers calls between 10 AM and 4 PM CT. Send all advance via email.',
  lastShowDate: '2026-05-20',
  showHistory: [
    { id: 'sh1', date: '2026-05-20', venue: 'The Ryman', city: 'Nashville, TN' },
    { id: 'sh2', date: '2025-11-08', venue: 'The Ryman', city: 'Nashville, TN' },
    { id: 'sh3', date: '2025-08-22', venue: 'The Ryman', city: 'Nashville, TN' },
    { id: 'sh4', date: '2025-04-14', venue: 'The Ryman', city: 'Nashville, TN' },
    { id: 'sh5', date: '2024-10-30', venue: 'The Ryman', city: 'Nashville, TN' },
  ],
  recentActivity: [
    { id: 'ra1', body: 'Confirmed soundcheck moved to 11:00 AM', at: '2026-05-19T16:08:00' },
    { id: 'ra2', body: 'Sent updated stage plot v3', at: '2026-05-19T14:22:00' },
    { id: 'ra3', body: 'Reconfirmed hotel block (5 rooms)', at: '2026-05-19T10:08:00' },
  ],
}
```

- [ ] **Step 16.2: Verify + commit**

```bash
npx vue-tsc --noEmit 2>&1 | grep -E "contacts\.ts" | head -5
git add src/data/contacts.ts
git commit -m "feat(data): add Contacts fixtures (directory + selected contact)"
```

---

## Task 17: Contacts — `ContactsTable`

**Files:**

- Create: `src/components/contacts/ContactsTable.vue`

- [ ] **Step 17.1: Create `src/components/contacts/ContactsTable.vue`**

```vue
<!-- src/components/contacts/ContactsTable.vue -->
<template>
  <VaCard class="ct">
    <div class="ct__filters">
      <VaInput class="ct__search" placeholder="Search contacts, venues, cities, emails…" aria-label="Search contacts">
        <template #prependInner><VaIcon name="mso-search" color="secondary" /></template>
      </VaInput>
      <VaSelect class="ct__select" placeholder="All Roles" :options="['All Roles']" />
      <VaSelect class="ct__select" placeholder="All Cities" :options="['All Cities']" />
      <VaSelect class="ct__select" placeholder="Show Type" :options="['Show Type']" />
      <VaButton preset="secondary" size="small" icon="mso-filter_list">Filters</VaButton>
      <VaButton preset="secondary" size="small">Clear All</VaButton>
    </div>

    <table class="ct__table">
      <thead>
        <tr>
          <th class="ct__th-check"><input type="checkbox" aria-label="Select all" /></th>
          <th>Role</th>
          <th>Name</th>
          <th>Company</th>
          <th>City</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Last Show</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in contacts" :key="c.id" :class="{ 'ct__row--selected': c.id === selectedId }">
          <td><input type="checkbox" :aria-label="`Select ${c.name}`" /></td>
          <td>
            <span class="ct__role">{{ c.role }}</span>
          </td>
          <td>{{ c.name }}</td>
          <td>{{ c.company }}</td>
          <td>{{ c.city }}</td>
          <td>{{ c.phones[0] }}</td>
          <td class="ct__email">{{ c.email }}</td>
          <td>{{ c.lastShowDate ? formatShortDate(c.lastShowDate) : '—' }}</td>
          <td><VaIcon name="mso-more_vert" size="18px" color="secondary" /></td>
        </tr>
      </tbody>
    </table>

    <div class="ct__footer">
      <span>Showing 1–{{ contacts.length }} of {{ total }}</span>
      <div class="ct__pages">
        <VaButton preset="secondary" size="small">‹</VaButton>
        <VaButton preset="primary" size="small">1</VaButton>
        <VaButton preset="secondary" size="small">2</VaButton>
        <VaButton preset="secondary" size="small">3</VaButton>
        <span>…</span>
        <VaButton preset="secondary" size="small">›</VaButton>
      </div>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { Contact } from '../../data/types'
import { formatShortDate } from '../../data/format'

defineProps<{
  contacts: Contact[]
  selectedId: string
  total: string
}>()
</script>

<style scoped lang="scss">
.ct {
  padding: 1.25rem;
}
.ct__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
}
.ct__search {
  flex: 1 1 16rem;
  min-width: 12rem;
}
.ct__select {
  width: 9rem;
}
.ct__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.ct__table th,
.ct__table td {
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid var(--va-background-border);
}
.ct__table th {
  color: var(--va-secondary);
  font-weight: 500;
  font-size: 0.75rem;
}
.ct__th-check {
  width: 2rem;
}
.ct__email {
  color: var(--va-secondary);
}
.ct__role {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--va-background-element);
  color: var(--va-secondary);
  white-space: nowrap;
}
.ct__row--selected {
  background: var(--va-background-element);
}
.ct__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.ct__pages {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}
</style>
```

- [ ] **Step 17.2: Commit**

```bash
git add src/components/contacts/
git commit -m "feat(contacts): add ContactsTable"
```

---

## Task 18: Contacts — three detail-rail sub-cards

**Files:**

- Create: `src/components/contacts/ContactInfoCard.vue`
- Create: `src/components/contacts/ContactShowHistoryCard.vue`
- Create: `src/components/contacts/ContactRecentActivityCard.vue`

- [ ] **Step 18.1: Create `ContactInfoCard.vue`**

```vue
<!-- src/components/contacts/ContactInfoCard.vue -->
<template>
  <VaCard class="ci">
    <div class="ci__head">
      <span class="ci__title">Contact Information</span>
    </div>
    <dl class="ci__list">
      <div class="ci__row" v-for="(p, i) in contact.phones" :key="`p-${i}`">
        <dt>Phone {{ i === 0 ? '(primary)' : '' }}</dt>
        <dd>{{ p }}</dd>
      </div>
      <div class="ci__row">
        <dt>Email</dt>
        <dd>{{ contact.email }}</dd>
      </div>
      <div class="ci__row" v-for="(e, i) in contact.altEmails" :key="`e-${i}`">
        <dt>Alt Email</dt>
        <dd>{{ e }}</dd>
      </div>
      <div class="ci__row">
        <dt>Address</dt>
        <dd>{{ contact.address }}</dd>
      </div>
      <div v-if="contact.notes" class="ci__row">
        <dt>Notes</dt>
        <dd>{{ contact.notes }}</dd>
      </div>
    </dl>
  </VaCard>
</template>

<script setup lang="ts">
import type { ContactDetail } from '../../data/types'

defineProps<{ contact: ContactDetail }>()
</script>

<style scoped lang="scss">
.ci {
  padding: 1.25rem;
}
.ci__head {
  margin-bottom: 0.75rem;
}
.ci__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.ci__list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.ci__row {
  display: grid;
  grid-template-columns: 8rem 1fr;
  gap: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.ci__row:last-child {
  border-bottom: none;
}
.ci__row dt {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  margin: 0;
}
.ci__row dd {
  font-size: 0.875rem;
  margin: 0;
}
</style>
```

- [ ] **Step 18.2: Create `ContactShowHistoryCard.vue`**

```vue
<!-- src/components/contacts/ContactShowHistoryCard.vue -->
<template>
  <VaCard class="csh">
    <div class="csh__head">
      <VaIcon name="mso-confirmation_number" size="18px" color="secondary" />
      <span class="csh__title">Show History</span>
    </div>
    <ul class="csh__list">
      <li v-for="s in shows" :key="s.id" class="csh__row">
        <div class="csh__date">{{ formatShortDate(s.date) }}</div>
        <div class="csh__body">
          <div class="csh__venue">{{ s.venue }}</div>
          <div class="csh__city">{{ s.city }}</div>
        </div>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import { formatShortDate } from '../../data/format'

defineProps<{
  shows: { id: string; date: string; venue: string; city: string }[]
}>()
</script>

<style scoped lang="scss">
.csh {
  padding: 1.25rem;
}
.csh__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.csh__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.csh__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.csh__row {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 0.5rem;
  align-items: start;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.csh__row:last-child {
  border-bottom: none;
}
.csh__date {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.csh__venue {
  font-size: 0.875rem;
  font-weight: 600;
}
.csh__city {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
</style>
```

- [ ] **Step 18.3: Create `ContactRecentActivityCard.vue`**

```vue
<!-- src/components/contacts/ContactRecentActivityCard.vue -->
<template>
  <VaCard class="cra">
    <div class="cra__head">
      <VaIcon name="mso-history" size="18px" color="secondary" />
      <span class="cra__title">Recent Activity</span>
    </div>
    <ul class="cra__list">
      <li v-for="e in entries" :key="e.id" class="cra__row">
        <span class="cra__dot" />
        <div class="cra__body">{{ e.body }}</div>
        <span class="cra__when">{{ formatRelativeDateTime(e.at) }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import { formatRelativeDateTime } from '../../data/format'

defineProps<{
  entries: { id: string; body: string; at: string }[]
}>()
</script>

<style scoped lang="scss">
.cra {
  padding: 1.25rem;
}
.cra__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.cra__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.cra__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.cra__row {
  display: grid;
  grid-template-columns: 0.5rem 1fr auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.cra__row:last-child {
  border-bottom: none;
}
.cra__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--va-primary);
}
.cra__body {
  font-size: 0.875rem;
}
.cra__when {
  font-size: 0.75rem;
  color: var(--va-secondary);
  white-space: nowrap;
}
</style>
```

- [ ] **Step 18.4: Commit**

```bash
git add src/components/contacts/
git commit -m "feat(contacts): add ContactInfo, ShowHistory, RecentActivity sub-cards"
```

---

## Task 19: Contacts — `ContactDetailRail`

**Files:**

- Create: `src/components/contacts/ContactDetailRail.vue`

- [ ] **Step 19.1: Create `src/components/contacts/ContactDetailRail.vue`**

```vue
<!-- src/components/contacts/ContactDetailRail.vue -->
<template>
  <aside class="cdr">
    <header class="cdr__header">
      <VaAvatar size="large" color="secondary">{{ initials }}</VaAvatar>
      <div class="cdr__heading">
        <div class="cdr__name">{{ contact.name }}</div>
        <div class="cdr__role">
          <span class="cdr__role-pill">{{ contact.role }}</span>
        </div>
        <div class="cdr__sub">{{ contact.company }} · {{ contact.city }}</div>
      </div>
      <div class="cdr__actions">
        <VaButton preset="secondary" size="small" icon="mso-call" :aria-label="`Call ${contact.name}`" />
        <VaButton preset="secondary" size="small" icon="mso-mail" :aria-label="`Email ${contact.name}`" />
        <VaButton preset="secondary" size="small" icon="mso-visibility" :aria-label="`View profile`" />
        <VaButton preset="secondary" size="small" icon="mso-more_horiz" :aria-label="`More actions`" />
      </div>
    </header>

    <ContactInfoCard :contact="contact" />
    <ContactShowHistoryCard :shows="contact.showHistory" />
    <ContactRecentActivityCard :entries="contact.recentActivity" />
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ContactDetail } from '../../data/types'
import ContactInfoCard from './ContactInfoCard.vue'
import ContactShowHistoryCard from './ContactShowHistoryCard.vue'
import ContactRecentActivityCard from './ContactRecentActivityCard.vue'

const props = defineProps<{ contact: ContactDetail }>()

const initials = computed(() =>
  props.contact.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join(''),
)
</script>

<style scoped lang="scss">
.cdr {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.cdr__header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  align-items: start;
  padding: 1rem 1.25rem;
  background: var(--va-background-element);
  border-radius: 0.5rem;
}
.cdr__name {
  font-size: 1.125rem;
  font-weight: 700;
}
.cdr__role-pill {
  display: inline-block;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--va-background-primary);
  color: var(--va-secondary);
  margin-top: 0.25rem;
}
.cdr__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  margin-top: 0.25rem;
}
.cdr__actions {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}
</style>
```

- [ ] **Step 19.2: Commit**

```bash
git add src/components/contacts/ContactDetailRail.vue
git commit -m "feat(contacts): add ContactDetailRail (composes 3 sub-cards)"
```

---

## Task 20: Contacts page composition

**Files:**

- Modify: `src/pages/Contacts.vue`

- [ ] **Step 20.1: Overwrite `src/pages/Contacts.vue`**

```vue
<!-- src/pages/Contacts.vue -->
<template>
  <div class="page page--contacts">
    <PageHeader title="Contacts" />

    <KpiRow :kpis="contactsKpis" />

    <section class="page--contacts__body">
      <ContactsTable :contacts="contactsDirectory" :selected-id="contactsSelectedId" :total="contactsKpis[0].value" />
      <ContactDetailRail :contact="contactsSelectedContact" />
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import KpiRow from '../components/KpiRow.vue'
import ContactsTable from '../components/contacts/ContactsTable.vue'
import ContactDetailRail from '../components/contacts/ContactDetailRail.vue'
import { contactsKpis, contactsDirectory, contactsSelectedId, contactsSelectedContact } from '../data/contacts'
</script>

<style scoped lang="scss">
.page--contacts {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page--contacts__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 1024px) {
  .page--contacts__body {
    grid-template-columns: 2fr 1fr;
  }
}
</style>
```

- [ ] **Step 20.2: Verify + commit**

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/contacts
git add src/pages/Contacts.vue
git commit -m "feat(contacts): compose Contacts page"
```

---

## Task 21: Tasks fixtures

**Files:**

- Create: `src/data/tasks.ts`

- [ ] **Step 21.1: Create `src/data/tasks.ts`**

```ts
// src/data/tasks.ts — Tasks & Follow-Ups fixtures (matches mock 6)
import type { Kpi, TaskCategory, TaskDeadline, TaskItem } from './types'

export const tasksKpis: Kpi[] = [
  { icon: 'mso-task_alt', label: 'Open Tasks', value: '27', sub: 'Across all shows' },
  { icon: 'mso-event', label: 'Due Today', value: '6', sub: 'Need attention' },
  { icon: 'mso-mail', label: 'Waiting on Reply', value: '9', sub: 'Pending response' },
  { icon: 'mso-trending_up', label: 'Completed This Week', value: '14', sub: 'Last 7 days' },
]

export const tasksTodo: TaskItem[] = [
  {
    id: 'td1',
    title: 'Send guest list update to box office',
    due: 'Today',
    tags: ['Box Office', 'Nashville'],
    assigneeInitials: 'JM',
    column: 'todo',
  },
  {
    id: 'td2',
    title: 'Confirm runner pickup time',
    due: 'Today',
    tags: ['Logistics'],
    assigneeInitials: 'JM',
    column: 'todo',
  },
  {
    id: 'td3',
    title: 'Finalize merch quantities for Atlanta',
    due: 'May 21',
    tags: ['Merch'],
    assigneeInitials: 'TS',
    column: 'todo',
  },
  {
    id: 'td4',
    title: 'Update advance for Charlotte',
    due: 'May 22',
    tags: ['Advance'],
    assigneeInitials: 'JM',
    column: 'todo',
  },
]

export const tasksWaiting: TaskItem[] = [
  {
    id: 'w1',
    title: 'Hospitality rider sign-off — promoter',
    due: 'May 21',
    tags: ['Hospitality', 'Atlanta'],
    assigneeInitials: 'JM',
    column: 'waiting',
  },
  {
    id: 'w2',
    title: 'Hotel block contract — NOLA',
    due: 'May 22',
    tags: ['Hotel'],
    assigneeInitials: 'JM',
    column: 'waiting',
  },
  {
    id: 'w3',
    title: 'Press release approval — label',
    due: 'May 23',
    tags: ['Promo'],
    assigneeInitials: 'AC',
    column: 'waiting',
  },
]

export const tasksDueSoon: TaskItem[] = [
  {
    id: 'ds1',
    title: 'Submit settlement for The Ryman',
    due: 'May 22',
    tags: ['Settlement'],
    assigneeInitials: 'JM',
    column: 'duesoon',
  },
  {
    id: 'ds2',
    title: 'Confirm soundcheck for Iron City',
    due: 'May 23',
    tags: ['Production', 'Birmingham'],
    assigneeInitials: 'LC',
    column: 'duesoon',
  },
  {
    id: 'ds3',
    title: 'Send tech rider to Charlotte',
    due: 'May 24',
    tags: ['Production'],
    assigneeInitials: 'LC',
    column: 'duesoon',
  },
]

export const tasksDone: TaskItem[] = [
  {
    id: 'd1',
    title: 'Confirm Nashville hotel block',
    due: 'May 19',
    tags: ['Hotel'],
    assigneeInitials: 'JM',
    column: 'done',
  },
  {
    id: 'd2',
    title: 'Approve Tabernacle stage plot',
    due: 'May 18',
    tags: ['Production'],
    assigneeInitials: 'LC',
    column: 'done',
  },
  {
    id: 'd3',
    title: 'Send guest list invites — Nashville',
    due: 'May 17',
    tags: ['Box Office'],
    assigneeInitials: 'JM',
    column: 'done',
  },
]

export const tasksDeadlines: TaskDeadline[] = [
  { id: 'dd1', title: 'Submit advance — Atlanta', date: '2026-05-21' },
  { id: 'dd2', title: 'Hotel block — Birmingham', date: '2026-05-22' },
  { id: 'dd3', title: 'Settlement — The Ryman', date: '2026-05-22' },
  { id: 'dd4', title: 'Press release — May 24 show', date: '2026-05-23' },
  { id: 'dd5', title: 'Tour merch reorder', date: '2026-05-26' },
]

export const tasksCategories: TaskCategory[] = [
  { name: 'Advance', count: 9 },
  { name: 'Travel', count: 6 },
  { name: 'Hotel', count: 5 },
  { name: 'Settlement', count: 4 },
  { name: 'Promo', count: 2 },
  { name: 'Other', count: 1 },
]
```

- [ ] **Step 21.2: Verify + commit**

```bash
npx vue-tsc --noEmit 2>&1 | grep -E "tasks\.ts" | head -5
git add src/data/tasks.ts
git commit -m "feat(data): add Tasks fixtures"
```

---

## Task 22: Tasks — `TaskCard` + `TaskKanbanColumn`

**Files:**

- Create: `src/components/tasks/TaskCard.vue`
- Create: `src/components/tasks/TaskKanbanColumn.vue`

- [ ] **Step 22.1: Create `TaskCard.vue`**

```vue
<!-- src/components/tasks/TaskCard.vue -->
<template>
  <div class="tcard">
    <div class="tcard__title">{{ task.title }}</div>
    <div class="tcard__meta">
      <span v-if="task.due" class="tcard__due">{{ task.due }}</span>
      <span v-for="t in task.tags" :key="t" class="tcard__tag">{{ t }}</span>
      <VaAvatar size="small" color="secondary">{{ task.assigneeInitials }}</VaAvatar>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskItem } from '../../data/types'

defineProps<{ task: TaskItem }>()
</script>

<style scoped lang="scss">
.tcard {
  padding: 0.75rem;
  border: 1px solid var(--va-background-border);
  border-radius: 0.5rem;
  background: var(--va-background-primary);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tcard__title {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;
}
.tcard__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
}
.tcard__due {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--va-background-element);
  color: var(--va-secondary);
}
.tcard__tag {
  font-size: 0.7rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--va-background-element);
  color: var(--va-secondary);
}
</style>
```

- [ ] **Step 22.2: Create `TaskKanbanColumn.vue`**

```vue
<!-- src/components/tasks/TaskKanbanColumn.vue -->
<template>
  <VaCard class="tkc">
    <header class="tkc__head">
      <span class="tkc__title">{{ title }}</span>
      <span class="tkc__count">{{ count }}</span>
    </header>
    <div class="tkc__body">
      <TaskCard v-for="t in tasks" :key="t.id" :task="t" />
    </div>
    <footer class="tkc__footer">
      <button type="button" class="tkc__add">+ Add task</button>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import type { TaskItem } from '../../data/types'
import TaskCard from './TaskCard.vue'

defineProps<{
  title: string
  count: number
  tasks: TaskItem[]
}>()
</script>

<style scoped lang="scss">
.tkc {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.tkc__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tkc__title {
  font-size: 0.875rem;
  font-weight: 600;
}
.tkc__count {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--va-background-element);
  color: var(--va-secondary);
}
.tkc__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 4rem;
}
.tkc__footer {
  padding-top: 0.5rem;
  border-top: 1px dashed var(--va-background-border);
}
.tkc__add {
  background: transparent;
  border: 0;
  color: var(--va-secondary);
  font: inherit;
  font-size: 0.8125rem;
  cursor: pointer;
  padding: 0;
}
</style>
```

- [ ] **Step 22.3: Commit**

```bash
git add src/components/tasks/
git commit -m "feat(tasks): add TaskCard + TaskKanbanColumn"
```

---

## Task 23: Tasks — `TaskUpcomingDeadlinesCard` + `TaskCategoriesCard`

**Files:**

- Create: `src/components/tasks/TaskUpcomingDeadlinesCard.vue`
- Create: `src/components/tasks/TaskCategoriesCard.vue`

- [ ] **Step 23.1: Create `TaskUpcomingDeadlinesCard.vue`**

```vue
<!-- src/components/tasks/TaskUpcomingDeadlinesCard.vue -->
<template>
  <VaCard class="tud">
    <div class="tud__head">
      <VaIcon name="mso-event" size="18px" color="secondary" />
      <span class="tud__title">Upcoming Deadlines</span>
    </div>
    <ul class="tud__list">
      <li v-for="d in deadlines" :key="d.id" class="tud__row">
        <div class="tud__date">{{ formatShortDate(d.date) }}</div>
        <div class="tud__body">{{ d.title }}</div>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { TaskDeadline } from '../../data/types'
import { formatShortDate } from '../../data/format'

defineProps<{ deadlines: TaskDeadline[] }>()
</script>

<style scoped lang="scss">
.tud {
  padding: 1.25rem;
}
.tud__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tud__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.tud__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.tud__row {
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.tud__row:last-child {
  border-bottom: none;
}
.tud__date {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.tud__body {
  font-size: 0.875rem;
}
</style>
```

- [ ] **Step 23.2: Create `TaskCategoriesCard.vue`**

```vue
<!-- src/components/tasks/TaskCategoriesCard.vue -->
<template>
  <VaCard class="tcc">
    <div class="tcc__head">
      <VaIcon name="mso-category" size="18px" color="secondary" />
      <span class="tcc__title">Task Categories</span>
    </div>
    <ul class="tcc__list">
      <li v-for="c in categories" :key="c.name" class="tcc__row">
        <span class="tcc__name">{{ c.name }}</span>
        <span class="tcc__count">{{ c.count }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { TaskCategory } from '../../data/types'

defineProps<{ categories: TaskCategory[] }>()
</script>

<style scoped lang="scss">
.tcc {
  padding: 1.25rem;
}
.tcc__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tcc__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.tcc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.tcc__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.tcc__row:last-child {
  border-bottom: none;
}
.tcc__name {
  font-size: 0.875rem;
}
.tcc__count {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--va-background-element);
  color: var(--va-secondary);
}
</style>
```

- [ ] **Step 23.3: Commit**

```bash
git add src/components/tasks/
git commit -m "feat(tasks): add UpcomingDeadlines + Categories cards"
```

---

## Task 24: Tasks page composition

**Files:**

- Modify: `src/pages/Tasks.vue`

- [ ] **Step 24.1: Overwrite `src/pages/Tasks.vue`**

```vue
<!-- src/pages/Tasks.vue -->
<template>
  <div class="page page--tasks">
    <PageHeader title="Tasks & Follow-Ups" subtitle="Stay on top of your responsibilities" />

    <KpiRow :kpis="tasksKpis" />

    <section class="page--tasks__body">
      <div class="page--tasks__columns">
        <TaskKanbanColumn title="To Do" :count="tasksTodo.length" :tasks="tasksTodo" />
        <TaskKanbanColumn title="Waiting" :count="tasksWaiting.length" :tasks="tasksWaiting" />
        <TaskKanbanColumn title="Due Soon" :count="tasksDueSoon.length" :tasks="tasksDueSoon" />
        <TaskKanbanColumn title="Done" :count="tasksDone.length" :tasks="tasksDone" />
      </div>

      <aside class="page--tasks__rail">
        <TaskUpcomingDeadlinesCard :deadlines="tasksDeadlines" />
        <TaskCategoriesCard :categories="tasksCategories" />
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import KpiRow from '../components/KpiRow.vue'
import TaskKanbanColumn from '../components/tasks/TaskKanbanColumn.vue'
import TaskUpcomingDeadlinesCard from '../components/tasks/TaskUpcomingDeadlinesCard.vue'
import TaskCategoriesCard from '../components/tasks/TaskCategoriesCard.vue'
import {
  tasksKpis,
  tasksTodo,
  tasksWaiting,
  tasksDueSoon,
  tasksDone,
  tasksDeadlines,
  tasksCategories,
} from '../data/tasks'
</script>

<style scoped lang="scss">
.page--tasks {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page--tasks__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 1024px) {
  .page--tasks__body {
    grid-template-columns: 3fr 1fr;
  }
}
.page--tasks__columns {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 768px) {
  .page--tasks__columns {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1280px) {
  .page--tasks__columns {
    grid-template-columns: repeat(4, 1fr);
  }
}
.page--tasks__rail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
```

- [ ] **Step 24.2: Verify + commit**

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/tasks
git add src/pages/Tasks.vue
git commit -m "feat(tasks): compose Tasks & Follow-Ups page"
```

---

## Task 25: Documents fixtures

**Files:**

- Create: `src/data/documents.ts`

- [ ] **Step 25.1: Create `src/data/documents.ts`**

```ts
// src/data/documents.ts — Documents & Settlements fixtures (matches mock 7)
import type { DocsMissingItem, DocsSelectedFile, FileEntry, Kpi, Settlement, TravelIssue } from './types'

export const docsKpis: Kpi[] = [
  { icon: 'mso-folder', label: 'Total Files', value: '132', sub: 'All shows' },
  { icon: 'mso-warning', label: 'Missing Docs', value: '18', sub: 'Need attention' },
  { icon: 'mso-attach_money', label: 'Pending Settlements', value: '9', sub: 'Awaiting close' },
  { icon: 'mso-payments', label: 'Net Due', value: '$128,740.00', sub: 'Outstanding' },
]

export const docsSelectedId = 'sel'

export const docsFiles: FileEntry[] = [
  {
    id: 'sel',
    type: 'PDF',
    name: 'The Ryman.pdf',
    category: 'Venue Contract',
    show: 'The Ryman — Nashville',
    uploadedBy: 'JM',
    uploadedDate: '2026-05-15',
    status: 'Approved',
  },
  {
    id: 'f2',
    type: 'PDF',
    name: 'Tabernacle_Contract.pdf',
    category: 'Venue Contract',
    show: 'Tabernacle — Atlanta',
    uploadedBy: 'JM',
    uploadedDate: '2026-05-12',
    status: 'Pending',
  },
  {
    id: 'f3',
    type: 'PDF',
    name: 'Fillmore_NOLA_Contract.pdf',
    category: 'Venue Contract',
    show: 'The Fillmore — New Orleans',
    uploadedBy: 'JM',
    uploadedDate: '2026-05-10',
    status: 'Approved',
  },
  {
    id: 'f4',
    type: 'Doc',
    name: 'Hospitality_Rider_v3.doc',
    category: 'Rider',
    show: 'The Ryman — Nashville',
    uploadedBy: 'JM',
    uploadedDate: '2026-05-18',
    status: 'Approved',
  },
  {
    id: 'f5',
    type: 'PDF',
    name: 'StagePlot_v3.pdf',
    category: 'Production',
    show: 'The Ryman — Nashville',
    uploadedBy: 'LC',
    uploadedDate: '2026-05-19',
    status: 'Approved',
  },
  {
    id: 'f6',
    type: 'PDF',
    name: 'IronCity_Contract.pdf',
    category: 'Venue Contract',
    show: 'Iron City — Birmingham',
    uploadedBy: 'JM',
    uploadedDate: '2026-05-08',
    status: 'Action Needed',
  },
  {
    id: 'f7',
    type: 'Sheet',
    name: 'GuestList_AtlantaMay21.xlsx',
    category: 'Guest List',
    show: 'Tabernacle — Atlanta',
    uploadedBy: 'JM',
    uploadedDate: '2026-05-19',
    status: 'Pending',
  },
  {
    id: 'f8',
    type: 'Image',
    name: 'StagePhoto_NOLA.jpg',
    category: 'Reference',
    show: 'The Fillmore — New Orleans',
    uploadedBy: 'LC',
    uploadedDate: '2026-05-17',
    status: 'Approved',
  },
]

export const docsSelectedFile: DocsSelectedFile = {
  id: 'sel',
  type: 'PDF',
  name: 'The Ryman.pdf',
  category: 'Venue Contract',
  show: 'The Ryman — Nashville',
  uploadedBy: 'JM',
  uploadedDate: '2026-05-15',
  status: 'Approved',
  sizeKb: 412,
  preview:
    'Standard venue contract for the May 20 show. Includes capacity, deal points, settlement terms, deductions, advance schedule, and a hospitality addendum signed by both parties.',
  signers: ['Sarah Williams (Venue)', 'Jane Manager (Tour)'],
}

export const docsSettlements: Settlement[] = [
  {
    id: 's1',
    show: 'The Ryman — Nashville',
    date: '2026-05-20',
    grossUsd: 165400,
    expensesUsd: 22300,
    netUsd: 143100,
    status: 'Pending',
  },
  {
    id: 's2',
    show: 'Tabernacle — Atlanta',
    date: '2026-05-21',
    grossUsd: 142800,
    expensesUsd: 19800,
    netUsd: 123000,
    status: 'Pending',
  },
  {
    id: 's3',
    show: 'The Fillmore — New Orleans',
    date: '2026-05-22',
    grossUsd: 128400,
    expensesUsd: 17900,
    netUsd: 110500,
    status: 'Pending',
  },
  {
    id: 's4',
    show: 'Iron City — Birmingham',
    date: '2026-05-23',
    grossUsd: 116200,
    expensesUsd: 16400,
    netUsd: 99800,
    status: 'Disputed',
  },
  {
    id: 's5',
    show: 'The Fillmore — Charlotte',
    date: '2026-05-24',
    grossUsd: 124000,
    expensesUsd: 17200,
    netUsd: 106800,
    status: 'Pending',
  },
  {
    id: 's6',
    show: 'House of Blues — Houston',
    date: '2026-04-28',
    grossUsd: 138600,
    expensesUsd: 19100,
    netUsd: 119500,
    status: 'Confirmed',
  },
]

export const docsMissing: DocsMissingItem[] = [
  { id: 'dm1', title: 'Tech rider', show: 'Tabernacle — Atlanta', severity: 'High' },
  { id: 'dm2', title: 'Insurance certificate', show: 'Iron City — Birmingham', severity: 'High' },
  { id: 'dm3', title: 'Settlement worksheet', show: 'Charlotte', severity: 'Medium' },
  { id: 'dm4', title: 'Stage plot', show: 'House of Blues — Houston', severity: 'Low' },
]

export const docsIssues: TravelIssue[] = [
  { id: 'di1', title: 'Settlement disputed', sub: 'Iron City — May 23', severity: 'High' },
  { id: 'di2', title: 'Net Due overdue', sub: 'Houston — Apr 28', severity: 'Medium' },
  { id: 'di3', title: 'Missing signature', sub: 'Charlotte contract', severity: 'Low' },
]
```

- [ ] **Step 25.2: Verify + commit**

```bash
npx vue-tsc --noEmit 2>&1 | grep -E "documents\.ts" | head -5
git add src/data/documents.ts
git commit -m "feat(data): add Documents & Settlements fixtures"
```

---

## Task 26: Documents — `DocumentsTable` + `SettlementQueueTable`

**Files:**

- Create: `src/components/documents/DocumentsTable.vue`
- Create: `src/components/documents/SettlementQueueTable.vue`

- [ ] **Step 26.1: Create `DocumentsTable.vue`**

```vue
<!-- src/components/documents/DocumentsTable.vue -->
<template>
  <VaCard class="dt">
    <div class="dt__head">
      <span class="dt__title">Documents</span>
      <div class="dt__actions">
        <VaInput class="dt__search" placeholder="Search files…" aria-label="Search files">
          <template #prependInner><VaIcon name="mso-search" color="secondary" /></template>
        </VaInput>
        <VaButton preset="secondary" size="small" icon="mso-filter_list">Filters</VaButton>
      </div>
    </div>
    <table class="dt__table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Name</th>
          <th>Category</th>
          <th>Show</th>
          <th>Uploaded By</th>
          <th>Date</th>
          <th>Status</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="f in files" :key="f.id" :class="{ 'dt__row--selected': f.id === selectedId }">
          <td><VaIcon :name="iconFor(f.type)" size="18px" color="secondary" /></td>
          <td>{{ f.name }}</td>
          <td>{{ f.category }}</td>
          <td>{{ f.show }}</td>
          <td>{{ f.uploadedBy }}</td>
          <td>{{ formatShortDate(f.uploadedDate) }}</td>
          <td>
            <span class="dt__pill" :class="[statusTokens[f.status].bg, statusTokens[f.status].text]">{{
              f.status
            }}</span>
          </td>
          <td><VaIcon name="mso-more_vert" size="18px" color="secondary" /></td>
        </tr>
      </tbody>
    </table>
  </VaCard>
</template>

<script setup lang="ts">
import type { FileEntry, FileType } from '../../data/types'
import { statusTokens } from '../../data/severity'
import { formatShortDate } from '../../data/format'

defineProps<{ files: FileEntry[]; selectedId: string }>()

function iconFor(t: FileType): string {
  switch (t) {
    case 'PDF':
      return 'mso-picture_as_pdf'
    case 'Doc':
      return 'mso-description'
    case 'Image':
      return 'mso-image'
    case 'Sheet':
      return 'mso-table_chart'
  }
}
</script>

<style scoped lang="scss">
.dt {
  padding: 1.25rem;
}
.dt__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.dt__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.dt__actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}
.dt__search {
  max-width: 16rem;
  flex: 1;
}
.dt__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.dt__table th,
.dt__table td {
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid var(--va-background-border);
}
.dt__table th {
  color: var(--va-secondary);
  font-weight: 500;
  font-size: 0.75rem;
}
.dt__table tbody tr:last-child td {
  border-bottom: none;
}
.dt__row--selected {
  background: var(--va-background-element);
}
.dt__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  white-space: nowrap;
}
</style>
```

- [ ] **Step 26.2: Create `SettlementQueueTable.vue`**

```vue
<!-- src/components/documents/SettlementQueueTable.vue -->
<template>
  <VaCard class="sq">
    <div class="sq__head">
      <span class="sq__title">Settlement Queue</span>
    </div>
    <table class="sq__table">
      <thead>
        <tr>
          <th>Show</th>
          <th>Date</th>
          <th class="sq__num">Gross</th>
          <th class="sq__num">Expenses</th>
          <th class="sq__num">Net</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in settlements" :key="s.id">
          <td>{{ s.show }}</td>
          <td>{{ formatShortDate(s.date) }}</td>
          <td class="sq__num">{{ formatUsd(s.grossUsd) }}</td>
          <td class="sq__num">{{ formatUsd(s.expensesUsd) }}</td>
          <td class="sq__num">{{ formatUsd(s.netUsd) }}</td>
          <td>
            <span class="sq__pill" :class="[statusTokens[s.status].bg, statusTokens[s.status].text]">{{
              s.status
            }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </VaCard>
</template>

<script setup lang="ts">
import type { Settlement } from '../../data/types'
import { statusTokens } from '../../data/severity'
import { formatShortDate, formatUsd } from '../../data/format'

defineProps<{ settlements: Settlement[] }>()
</script>

<style scoped lang="scss">
.sq {
  padding: 1.25rem;
}
.sq__head {
  margin-bottom: 1rem;
}
.sq__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.sq__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.sq__table th,
.sq__table td {
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid var(--va-background-border);
}
.sq__table th {
  color: var(--va-secondary);
  font-weight: 500;
  font-size: 0.75rem;
}
.sq__table tbody tr:last-child td {
  border-bottom: none;
}
.sq__num {
  text-align: right;
}
.sq__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  white-space: nowrap;
}
</style>
```

- [ ] **Step 26.3: Commit**

```bash
git add src/components/documents/
git commit -m "feat(docs): add DocumentsTable + SettlementQueueTable"
```

---

## Task 27: Documents — `SelectedFilePanel` + 3 right-rail cards

**Files:**

- Create: `src/components/documents/SelectedFilePanel.vue`
- Create: `src/components/documents/DocsQuickActionsCard.vue`
- Create: `src/components/documents/DocsMissingCard.vue`
- Create: `src/components/documents/DocsSettlementIssuesCard.vue`

- [ ] **Step 27.1: Create `SelectedFilePanel.vue`**

```vue
<!-- src/components/documents/SelectedFilePanel.vue -->
<template>
  <VaCard class="sfp">
    <div class="sfp__layout">
      <div class="sfp__icon">
        <VaIcon name="mso-picture_as_pdf" size="64px" color="secondary" />
      </div>
      <div class="sfp__body">
        <div class="sfp__head">
          <span class="sfp__name">{{ file.name }}</span>
          <span class="sfp__pill" :class="[statusTokens[file.status].bg, statusTokens[file.status].text]">{{
            file.status
          }}</span>
        </div>
        <dl class="sfp__meta">
          <div class="sfp__row">
            <dt>Category</dt>
            <dd>{{ file.category }}</dd>
          </div>
          <div class="sfp__row">
            <dt>Show</dt>
            <dd>{{ file.show }}</dd>
          </div>
          <div class="sfp__row">
            <dt>Uploaded</dt>
            <dd>{{ file.uploadedBy }} · {{ formatShortDate(file.uploadedDate) }}</dd>
          </div>
          <div class="sfp__row">
            <dt>Size</dt>
            <dd>{{ file.sizeKb }} KB</dd>
          </div>
          <div v-if="file.signers && file.signers.length" class="sfp__row">
            <dt>Signers</dt>
            <dd>{{ file.signers.join(' · ') }}</dd>
          </div>
        </dl>
        <p class="sfp__preview">{{ file.preview }}</p>
        <div class="sfp__actions">
          <VaButton preset="secondary" size="small" icon="mso-visibility">View</VaButton>
          <VaButton preset="secondary" size="small" icon="mso-download">Download</VaButton>
          <VaButton preset="secondary" size="small" icon="mso-swap_horiz">Replace</VaButton>
          <VaButton preset="secondary" size="small" icon="mso-delete">Delete</VaButton>
        </div>
      </div>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { DocsSelectedFile } from '../../data/types'
import { statusTokens } from '../../data/severity'
import { formatShortDate } from '../../data/format'

defineProps<{ file: DocsSelectedFile }>()
</script>

<style scoped lang="scss">
.sfp {
  padding: 1.25rem;
}
.sfp__layout {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  align-items: start;
}
.sfp__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6rem;
  height: 7rem;
  background: var(--va-background-element);
  border-radius: 0.5rem;
}
.sfp__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.sfp__name {
  font-size: 1rem;
  font-weight: 700;
}
.sfp__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
.sfp__meta {
  margin: 0 0 0.75rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.sfp__row {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 0.5rem;
  padding: 0.125rem 0;
}
.sfp__row dt {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  margin: 0;
}
.sfp__row dd {
  font-size: 0.875rem;
  margin: 0;
}
.sfp__preview {
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 0 0 0.75rem;
  color: var(--va-secondary);
}
.sfp__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
```

- [ ] **Step 27.2: Create `DocsQuickActionsCard.vue`**

```vue
<!-- src/components/documents/DocsQuickActionsCard.vue -->
<template>
  <VaCard class="dqa">
    <div class="dqa__head">
      <VaIcon name="mso-bolt" size="18px" color="secondary" />
      <span class="dqa__title">Quick Actions</span>
    </div>
    <div class="dqa__list">
      <button type="button" class="dqa__action"><VaIcon name="mso-upload" size="18px" />Upload File</button>
      <button type="button" class="dqa__action"><VaIcon name="mso-draw" size="18px" />Request Signature</button>
      <button type="button" class="dqa__action">
        <VaIcon name="mso-folder_zip" size="18px" />Bundle for Settlement
      </button>
      <button type="button" class="dqa__action"><VaIcon name="mso-share" size="18px" />Share with Promoter</button>
    </div>
  </VaCard>
</template>

<style scoped lang="scss">
.dqa {
  padding: 1.25rem;
}
.dqa__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.dqa__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.dqa__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.dqa__action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--va-background-border);
  border-radius: 0.5rem;
  background: var(--va-background-primary);
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
  text-align: left;
}
.dqa__action:hover {
  background: var(--va-background-element);
}
</style>
```

- [ ] **Step 27.3: Create `DocsMissingCard.vue`**

```vue
<!-- src/components/documents/DocsMissingCard.vue -->
<template>
  <VaCard class="dmc">
    <div class="dmc__head">
      <VaIcon name="mso-warning" size="18px" color="secondary" />
      <span class="dmc__title">Missing Required Documents</span>
    </div>
    <ul class="dmc__list">
      <li v-for="i in items" :key="i.id" class="dmc__row">
        <div class="dmc__body">
          <div class="dmc__name">{{ i.title }}</div>
          <div class="dmc__sub">{{ i.show }}</div>
        </div>
        <span class="dmc__pill" :class="[severityTokens[i.severity].bg, severityTokens[i.severity].text]">{{
          i.severity
        }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { DocsMissingItem } from '../../data/types'
import { severityTokens } from '../../data/severity'

defineProps<{ items: DocsMissingItem[] }>()
</script>

<style scoped lang="scss">
.dmc {
  padding: 1.25rem;
}
.dmc__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.dmc__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.dmc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.dmc__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.dmc__row:last-child {
  border-bottom: none;
}
.dmc__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.dmc__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.dmc__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
</style>
```

- [ ] **Step 27.4: Create `DocsSettlementIssuesCard.vue`**

```vue
<!-- src/components/documents/DocsSettlementIssuesCard.vue -->
<template>
  <VaCard class="dsi">
    <div class="dsi__head">
      <VaIcon name="mso-priority_high" size="18px" color="secondary" />
      <span class="dsi__title">Settlement Issues</span>
    </div>
    <ul class="dsi__list">
      <li v-for="i in issues" :key="i.id" class="dsi__row">
        <span class="dsi__dot" :class="severityTokens[i.severity].dot" />
        <div class="dsi__body">
          <div class="dsi__name">{{ i.title }}</div>
          <div class="dsi__sub">{{ i.sub }}</div>
        </div>
        <span class="dsi__pill" :class="[severityTokens[i.severity].bg, severityTokens[i.severity].text]">{{
          i.severity
        }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { TravelIssue } from '../../data/types'
import { severityTokens } from '../../data/severity'

defineProps<{ issues: TravelIssue[] }>()
</script>

<style scoped lang="scss">
.dsi {
  padding: 1.25rem;
}
.dsi__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.dsi__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.dsi__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.dsi__row {
  display: grid;
  grid-template-columns: 0.625rem 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.dsi__row:last-child {
  border-bottom: none;
}
.dsi__dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
}
.dsi__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.dsi__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.dsi__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
</style>
```

- [ ] **Step 27.5: Commit**

```bash
git add src/components/documents/
git commit -m "feat(docs): add SelectedFilePanel + 3 right-rail cards"
```

---

## Task 28: Documents — `DocsSettlementsView` + page wiring

**Files:**

- Create: `src/components/documents/DocsSettlementsView.vue`
- Modify: `src/pages/Documents.vue`
- Modify: `src/pages/Settlements.vue`

- [ ] **Step 28.1: Create `src/components/documents/DocsSettlementsView.vue`**

```vue
<!-- src/components/documents/DocsSettlementsView.vue -->
<template>
  <div class="page page--docs">
    <PageHeader title="Documents & Settlements">
      <template #breadcrumb>
        <Breadcrumb :items="['Tour Dashboard', 'Documents & Settlements']" />
      </template>
    </PageHeader>

    <KpiRow :kpis="docsKpis" />

    <section class="page--docs__body">
      <div class="page--docs__main">
        <div class="page--docs__tables">
          <DocumentsTable :files="docsFiles" :selected-id="docsSelectedId" />
          <SettlementQueueTable :settlements="docsSettlements" />
        </div>
        <SelectedFilePanel :file="docsSelectedFile" />
      </div>

      <aside class="page--docs__rail">
        <DocsQuickActionsCard />
        <DocsMissingCard :items="docsMissing" />
        <DocsSettlementIssuesCard :issues="docsIssues" />
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../PageHeader.vue'
import Breadcrumb from '../Breadcrumb.vue'
import KpiRow from '../KpiRow.vue'
import DocumentsTable from './DocumentsTable.vue'
import SettlementQueueTable from './SettlementQueueTable.vue'
import SelectedFilePanel from './SelectedFilePanel.vue'
import DocsQuickActionsCard from './DocsQuickActionsCard.vue'
import DocsMissingCard from './DocsMissingCard.vue'
import DocsSettlementIssuesCard from './DocsSettlementIssuesCard.vue'
import {
  docsKpis,
  docsFiles,
  docsSelectedId,
  docsSelectedFile,
  docsSettlements,
  docsMissing,
  docsIssues,
} from '../../data/documents'
</script>

<style scoped lang="scss">
.page--docs {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page--docs__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 1024px) {
  .page--docs__body {
    grid-template-columns: 3fr 1fr;
  }
}
.page--docs__main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page--docs__tables {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 1280px) {
  .page--docs__tables {
    grid-template-columns: 1fr 1fr;
  }
}
.page--docs__rail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
```

- [ ] **Step 28.2: Overwrite `src/pages/Documents.vue`**

```vue
<!-- src/pages/Documents.vue -->
<template>
  <DocsSettlementsView />
</template>

<script setup lang="ts">
import DocsSettlementsView from '../components/documents/DocsSettlementsView.vue'
</script>
```

- [ ] **Step 28.3: Overwrite `src/pages/Settlements.vue`**

```vue
<!-- src/pages/Settlements.vue -->
<template>
  <DocsSettlementsView />
</template>

<script setup lang="ts">
import DocsSettlementsView from '../components/documents/DocsSettlementsView.vue'
</script>
```

- [ ] **Step 28.4: Verify both routes render same view + sidebar highlights per route**

```bash
curl -s -o /dev/null -w "/documents: HTTP %{http_code}\n" http://localhost:5173/documents
curl -s -o /dev/null -w "/settlements: HTTP %{http_code}\n" http://localhost:5173/settlements
```

Expect: both HTTP 200. In the browser, both routes show the combined view; sidebar highlight differs per route.

- [ ] **Step 28.5: Commit**

```bash
git add src/components/documents/DocsSettlementsView.vue src/pages/Documents.vue src/pages/Settlements.vue
git commit -m "feat(docs): compose Documents & Settlements combined view; both routes render same view"
```

---

## Task 29: Final verification — DoD walkthrough

**No file changes** unless issues are found.

- [ ] **Step 29.1: All routes serve**

```bash
for r in dashboard tour-dates shows itinerary travel contacts tasks documents settlements notes nonexistent; do
  curl -s -o /dev/null -w "/$r: HTTP %{http_code}\n" "http://localhost:5173/$r"
done
```

All expect HTTP 200.

- [ ] **Step 29.2: Production build**

```bash
npm run build:ci 2>&1 | tail -10
```

Expect: `✓ built in <duration>`. No "Cannot find module" errors.

- [ ] **Step 29.3: No broken imports**

```bash
grep -rln "components/dashboard/KpiTile" src/
```

Expect: zero output (KpiTile move clean).

- [ ] **Step 29.4: Visual walkthrough (browser)**

In `http://localhost:5173/`:

- Dashboard (regression check) — full mock renders, all 8 widgets, no console errors
- `/tour-dates` — Advance Checklist with show switcher, 3 KPIs, 11 sections, 4 right-rail cards
- `/shows` — breadcrumb, show switcher, action buttons, 3-row 9-card grid
- `/travel` — 4 KPIs, segments table with one row highlighted, trip details panel, right rail
- `/contacts` — 4 KPIs, filter bar, 15-row table with one row highlighted, detail rail (Sarah Williams)
- `/tasks` — 4 KPIs, 4 kanban columns, right rail (deadlines + categories)
- `/documents` — combined view; sidebar highlights "Documents"
- `/settlements` — same combined view; sidebar highlights "Settlements"
- `/itinerary` — `<PagePlaceholder>` ("Coming soon — detailed design pending.")
- `/notes` — `<PagePlaceholder>`
- `/nonexistent` — NotFound page; "Back to Dashboard" link works

- [ ] **Step 29.5: Tag the milestone (optional)**

```bash
git tag -a v0.2.0-screens -m "TourCraft additional skeleton screens (Tour Dates, Shows, Travel, Contacts, Tasks, Documents/Settlements)"
git tag --list v0.2.0-screens
```

---

## Spec coverage map

| Spec section                                      | Implementing task(s)                        |
| ------------------------------------------------- | ------------------------------------------- |
| §3 In scope #1 (replace 6 stubs)                  | Tasks 6, 11, 15, 20, 24, 28                 |
| §3 In scope #2 (per-section widget folders)       | Tasks 4–5, 8–10, 13–14, 17–19, 22–23, 26–27 |
| §3 In scope #3 (KpiRow extracted)                 | Tasks 1, 2                                  |
| §3 In scope #4 (PageHeader extension)             | Task 2                                      |
| §3 In scope #5 (per-section data fixtures)        | Tasks 3, 7, 12, 16, 21, 25                  |
| §3 In scope #6 (types extension)                  | Task 1                                      |
| §3 In scope #7 (formatRelativeDateTime)           | Task 1                                      |
| §3 In scope #8 (Settlements re-renders Documents) | Task 28                                     |
| §6.1 Tour Dates composition                       | Tasks 3–6                                   |
| §6.2 Shows composition                            | Tasks 7–11                                  |
| §6.3 Travel composition                           | Tasks 12–15                                 |
| §6.4 Contacts composition                         | Tasks 16–20                                 |
| §6.5 Tasks composition                            | Tasks 21–24                                 |
| §6.6 Documents/Settlements composition            | Tasks 25–28                                 |
| §10 Definition of Done                            | Task 29                                     |

---

_End of plan. Begin execution at Pre-flight P.1._
