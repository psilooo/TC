# TourCraft — Additional Skeleton Screens Design

|                             |                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Date**                    | 2026-05-05                                                                                                                     |
| **Status**                  | Draft (pending user review)                                                                                                    |
| **Author**                  | Claude (collaborating with user)                                                                                               |
| **Implementation**          | TBD — next session via `superpowers:writing-plans` → `superpowers:subagent-driven-development`                                 |
| **Repo state at spec time** | TourCraft on `main` at tag `v0.1.0-skeleton` (Dashboard skeleton + IA shell complete; 9 stub pages render `<PagePlaceholder>`) |
| **Reference mocks**         | `screens/01-dashboard.png` … `screens/07-documents.png` (renamed from original `Tourcraft & O1S*.png`)                         |

---

## 1. Context

The Dashboard skeleton (spec `2026-05-05-tourcraft-dashboard-skeleton-design.md`, tag `v0.1.0-skeleton`) shipped the layout shell, sidebar IA, router, and a faithful Tour Dashboard view. The other 9 sidebar items currently render `<PagePlaceholder>`.

The user provided 8 PNG mocks in `screens/`:

| File                        | What it shows                                            | Active sidebar            |
| --------------------------- | -------------------------------------------------------- | ------------------------- |
| `screens/01-dashboard.png`  | Tour Dashboard                                           | Dashboard (already built) |
| `screens/02-tour-dates.png` | **Advance Checklist** for "Atlanta — Tabernacle, May 21" | **Tour Dates**            |
| `screens/03-shows.png`      | **Show Detail** for "The Ryman — Nashville, TN"          | **Shows**                 |
| `screens/04-travel.png`     | **Travel & Hotels**                                      | **Travel**                |
| `screens/05-contacts.png`   | **Contacts** directory + selected-contact rail           | **Contacts**              |
| `screens/06-tasks.png`      | **Tasks & Follow-Ups** kanban                            | **Tasks**                 |
| `screens/07-documents.png`  | **Documents & Settlements** combined view                | **Documents**             |

Itinerary and Notes have no mocks.

## 2. Goal

Render all 6 mocked pages faithfully at their respective sidebar routes. Make `Settlements` render the same combined view as `Documents`. Keep `Itinerary` and `Notes` as `<PagePlaceholder>` stubs. Wireframe fidelity (Vuestic default tokens). All data is mock; all interactivity (search, filters, sort, kanban drag, selection) is visual-only — no handlers.

## 3. Scope

### Locked decisions (from brainstorming)

- **Routing — Approach A**: render the mock at its sidebar route. Tour Dates and Shows use a _visual-only_ show-switcher in the page header (chevron-down button that doesn't actually open a dropdown). Selected items in tables (Sarah Williams in Contacts, "BNA → CLT" in Travel, "The Ryman.pdf" in Documents) are hardcoded.
- **Documents + Settlements**: same combined view, two routes. Both `/documents` and `/settlements` render the same component. Active sidebar item still highlights correctly per route.
- **Itinerary + Notes**: stay as `<PagePlaceholder>`. No mock, no work this spec.
- **One spec, faithful** (Approach A in Q2). All ~50 widgets across 6 pages built faithfully.

### In scope

1. Replace 6 stub pages with real orchestration components composed from per-section widget folders.
2. Build per-section widget components under `src/components/{tour-dates,shows,travel,contacts,tasks,documents}/`.
3. Extract one shared `KpiRow` component used by 5 of 6 pages (Tour Dates uses 3 KPIs in the same grid; Shows has no KPI row).
4. Extend `PageHeader` with optional slots for breadcrumb, custom title content, custom subtitle content, and trailing action buttons (additive — existing dashboard usage unchanged). The `ShowSwitcher` component (§5) goes inside the title or subtitle slot when used.
5. Add per-section mock fixtures in `src/data/{tourDates,shows,travel,contacts,tasks,documents}.ts`.
6. Extend `src/data/types.ts` with new typed interfaces.
7. Extend `src/data/format.ts` with one helper (`formatRelativeDateTime`) for "May 19 · 4:08 PM" style timestamps used in several activity logs.
8. Make `src/pages/Settlements.vue` render the same `DocsSettlementsView` component as `src/pages/Documents.vue`.

### Out of scope

- Real interactivity: search, filters, sort, pagination, kanban drag, row clicks, dropdown opens, action button handlers
- Detail routes (no `/shows/:id`, `/contacts/:id`, etc. — Tour Dates and Shows already render details directly per Approach A)
- Real data, services, Pinia stores beyond what already exists
- Tests (unit, e2e) — same posture as v0.1.0-skeleton
- Itinerary, Notes pages
- Brand identity / theme tokens (Vuestic defaults stand in)
- The auth profile dropdown and topbar search functionality (decorative as in v0.1.0)
- Production-grade `npm run build` (full `vue-tsc` pass) — `npm run build:ci` is the bar
- Avatar / user images, attachment thumbnails, file previews — render as icons + filename text

## 4. Architecture & file layout

### New / modified files

```
src/
  pages/
    TourDates.vue               (REPLACE stub — orchestrates Advance Checklist)
    Shows.vue                   (REPLACE stub — orchestrates Show Detail)
    Travel.vue                  (REPLACE stub)
    Contacts.vue                (REPLACE stub)
    Tasks.vue                   (REPLACE stub)
    Documents.vue               (REPLACE stub — renders <DocsSettlementsView>)
    Settlements.vue             (REPLACE stub — renders <DocsSettlementsView>)
    Itinerary.vue               (kept as PagePlaceholder)
    Notes.vue                   (kept as PagePlaceholder)

  components/
    KpiTile.vue                 (MOVE from components/dashboard/KpiTile.vue — see §9; consumed by KpiRow + Dashboard)
    KpiRow.vue                  (NEW — shared 4-up KPI grid; takes Kpi[])
    PageHeader.vue              (EXTEND — add slots: #subtitle, #actions; keep title/subtitle props for back-compat)
    ShowSwitcher.vue            (NEW — visual-only "<show name> ▾" button used in PageHeader for Tour Dates + Shows)
    Breadcrumb.vue              (NEW — small "Tour Dashboard › Travel" component)

    tour-dates/
      AdvanceSectionRow.vue     (one row in the main 11-section list)
      AdvanceMissingCard.vue    (right rail)
      AdvanceQuickContactsCard.vue (right rail)
      AdvanceNotesCard.vue      (right rail)
      AdvanceUpdatesCard.vue    (right rail)

    shows/
      ShowSnapshotCard.vue
      ShowScheduleCard.vue
      ShowContactsCard.vue
      ShowGuestListCard.vue
      ShowHospitalityCard.vue
      ShowOpenTasksCard.vue
      ShowSettlementCard.vue
      ShowAttachmentsCard.vue
      ShowRecentActivityCard.vue

    travel/
      TravelSegmentsTable.vue
      TravelTripDetailsPanel.vue
      TravelCheckInsCard.vue
      TravelIssuesCard.vue

    contacts/
      ContactsTable.vue
      ContactDetailRail.vue     (composes the three cards below)
      ContactInfoCard.vue
      ContactShowHistoryCard.vue
      ContactRecentActivityCard.vue

    tasks/
      TaskKanbanColumn.vue
      TaskCard.vue
      TaskUpcomingDeadlinesCard.vue
      TaskCategoriesCard.vue

    documents/
      DocsSettlementsView.vue   (NEW — full page composition; rendered by both Documents.vue and Settlements.vue)
      DocumentsTable.vue
      SettlementQueueTable.vue
      SelectedFilePanel.vue
      DocsQuickActionsCard.vue
      DocsMissingCard.vue
      DocsSettlementIssuesCard.vue

  data/
    types.ts                    (EXTEND — see §8)
    format.ts                   (EXTEND — add formatRelativeDateTime)
    tourDates.ts                (NEW — Advance Checklist fixtures)
    shows.ts                    (NEW — Show Detail fixture)
    travel.ts                   (NEW)
    contacts.ts                 (NEW)
    tasks.ts                    (NEW)
    documents.ts                (NEW)
    severity.ts                 (kept untouched)
    dashboard.ts                (kept untouched)
```

### Modularity rules (carryover from §4 of v0.1.0 spec)

- **Pages contain orchestration only.** Each `pages/<Section>.vue` imports `PageHeader`, `KpiRow` (where applicable), and the section's widgets, then composes them. No UI guts inline.
- **Per-section component folders** keep widgets scoped. Cross-folder imports between sections are forbidden — a widget for Tasks does not import from `components/contacts/`. Shared UI lives at `components/` root.
- **Cross-cutting tokens / types / formatters** continue to live in `src/data/` (`severity.ts`, `format.ts`, `types.ts`). The cross-folder import ban applies only to `src/components/` subfolders — `src/data/` files are explicitly shared. (E.g., `shows.ts` may import `todayTimeline` from `dashboard.ts` to keep one source of truth.)
- Replacing a stub later or extending a section is still a one-file edit per change.

## 5. Routing & layout shell

### Routing

`src/router/index.ts` is unchanged in shape. Both `/documents` and `/settlements` already exist as separate routes; they continue to. The only difference is they now both lazy-import pages that render the same view (`DocsSettlementsView`). This is a deliberate Approach-A decision to render the combined mock at both IA routes.

### Layout shell

No structural changes. `AppLayout`, `AppSidebar`, `AppNavbar`, `NavbarSearch`, `NotificationDropdown`, `ProfileDropdown` all remain as v0.1.0. The sidebar's active highlight reads from the route name as today, so visiting `/settlements` correctly highlights the Settlements item even though the rendered content is the combined view.

### `PageHeader` extensions (additive)

Today: `<PageHeader title="..." subtitle="..." />` renders `<h1>` + optional small subtitle below.

Add (without breaking dashboard's existing usage):

```vue
<!-- Updated src/components/PageHeader.vue -->
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

The dashboard call (`<PageHeader title="Tour Dashboard" subtitle="Today / Command Center" />`) continues to work because `title` and `subtitle` props still render via the slot fallbacks.

### `ShowSwitcher` (used in Tour Dates + Shows page headers)

Visual-only button. Render as `<button>` with the show name + chevron-down icon. No popover, no menu, no handler.

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

### `Breadcrumb` (used in Travel + Documents)

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

### `KpiRow` (used by 5 of 6 new pages + extractable from existing Dashboard)

```vue
<!-- src/components/KpiRow.vue -->
<template>
  <section class="kpi-row" :class="{ 'kpi-row--three': kpis.length === 3 }">
    <KpiTile v-for="k in kpis" :key="k.label" v-bind="k" />
  </section>
</template>

<script setup lang="ts">
import type { Kpi } from '../data/types'
import KpiTile from './KpiTile.vue' // Note: KpiTile moved to root in §9

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
}
@media (min-width: 1024px) {
  .kpi-row--three {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
```

> **Migration of dashboard — explicit no-change rule:** Do NOT refactor `Dashboard.vue` to use `<KpiRow>`. Keep its inline `kpi-row` styles and template as-is. The only change to `Dashboard.vue` is updating the `KpiTile` import path (see §9). Lower risk to the working page; new pages use `KpiRow` directly. Future spec can DRY this up if it's worth doing.

> **Note on `KpiTile` location:** Today it lives at `src/components/dashboard/KpiTile.vue` because it was dashboard-only. It's now used by 5+ pages, so it semantically belongs at `src/components/` root. **Move it during implementation:** `src/components/dashboard/KpiTile.vue` → `src/components/KpiTile.vue`, update the dashboard's import path. The `KpiRow` defined above imports from the new path.

## 6. Per-page composition

Each page section below specifies: page header structure, KPIs, main content, right rail, and the widget mappings. Layout is CSS Grid via Tailwind.

### 6.1 `/tour-dates` — Advance Checklist (mock 1)

**`pages/TourDates.vue`**:

```vue
<template>
  <div class="page page--tour-dates">
    <PageHeader>
      <template #title>Advance Checklist</template>
      <template #subtitle>
        <ShowSwitcher :name="advanceCurrentShow.label" />
        <span class="page--tour-dates__date">{{ advanceCurrentShow.date }}</span>
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
```

> The mock shows the 3 KPI tiles inline-right of the page title. We render them as a regular `<KpiRow>` section directly below `<PageHeader>` instead — slight visual deviation (one extra row of vertical space), simpler markup, consistent with every other page. Wireframe fidelity allows this.

**KPIs (3-up):**

- `% Complete` — value `'75%'`, sub `'Sections progress'`, icon `mso-percent` (rendered via `KpiTile`'s normal layout; the circular ring in the mock is a stretch, see §6.1.x below)
- `Sections Complete` — `'8 of 11'`, sub `'Sections complete'`, icon `mso-check_circle`
- `Missing Items` — `'3'`, sub `'Need follow-up'`, icon `mso-warning`

> **§6.1.x Progress ring stretch:** The mock's % Complete tile is a circular SVG ring around the number. For wireframe fidelity, **the implementer may either render the ring (extra ~25 lines of SVG in `AdvanceProgressRing.vue`, used as a custom KpiTile-shaped tile) OR fall back to a regular KpiTile with the percent string**. Default to the regular KpiTile to stay faithful-but-simple; the ring is a polish pass.

**Main column — `AdvanceSectionRow`:**

Each row: leading icon · section name + sub · progress bar (Vuestic `VaProgressBar` or a styled `<div>`) · status pill · trailing chevron. The 11 sections in the fixture, of which 8 are Complete (matches the KPI "8 of 11" / "75%"):

1. Venue Info — 6/6 — Complete
2. Local Contacts — 5/5 — Complete
3. Hospitality — 2/4 — Need Follow-Up
4. Schedule Confirmation — 3/3 — Complete
5. Travel & Hotel — 5/5 — Complete
6. Crew Accommodations — 4/4 — Complete
7. Production / Tech Rider — 6/6 — Complete
8. Guest List — 1/2 — Need Follow-Up
9. Settlement Terms — 4/4 — Complete
10. Merch / Parking / Load-In — 3/3 — Complete
11. Promo / Marketing — 0/2 — Missing

Tally: 8 Complete · 2 Need Follow-Up · 1 Missing. 8/11 ≈ 73%; KPI fixture should display `'75%'` per the mock (a small visible rounding mismatch is acceptable wireframe fidelity; alternatively use `'73%'` for exact math).

Status pills use the same severity-token pattern from `OpenIssuesCard`: Complete = green (success), Need Follow-Up = amber, Missing = red. Add to `severity.ts` if needed (see §8).

**Right rail:**

- `AdvanceMissingCard` — list of missing items: title + sub + severity pill (3 entries)
- `AdvanceQuickContactsCard` — 3 contacts (Promoter, Hospitality, Production), simpler than dashboard's QuickContactsCard (no email button, just call icon + name + sub)
- `AdvanceNotesCard` — 1-2 short note entries with author initials avatar
- `AdvanceUpdatesCard` — 3 recent log entries (e.g., "Sound spec sheet uploaded by JM · 2h ago")

### 6.2 `/shows` — Show Detail (mock 3)

**`pages/Shows.vue`**:

```vue
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

    <section class="page--shows__row-1">
      <ShowSnapshotCard v-bind="showDetail.snapshot" />
      <ShowScheduleCard :events="showDetail.schedule" />
      <ShowContactsCard :contacts="showDetail.contacts" />
    </section>

    <section class="page--shows__row-2">
      <ShowGuestListCard :data="showDetail.guestList" />
      <ShowHospitalityCard :notes="showDetail.hospitality" />
      <ShowOpenTasksCard :tasks="showDetail.openTasks" />
    </section>

    <section class="page--shows__row-3">
      <ShowSettlementCard :data="showDetail.settlement" />
      <ShowAttachmentsCard :files="showDetail.attachments" />
      <ShowRecentActivityCard :entries="showDetail.recentActivity" />
    </section>
  </div>
</template>
```

Each row is `grid-cols-3` on `lg`, stack on smaller. **No KPI row** (mock doesn't show one).

**Card contents (paraphrased from mock 3, fixture in §8):**

- `ShowSnapshotCard` — Venue, Address, Capacity, Doors, Show Time, Set Length, Support, etc., as label/value pairs
- `ShowScheduleCard` — vertical timeline (reuse pattern from `TodayTimelineCard`); same 5 events as the dashboard's Today timeline (Load-In 9 AM, Soundcheck 11 AM, Dinner 5 PM, Show 7:30 PM, Load-Out 11 PM)
- `ShowContactsCard` — same quick-contacts pattern: Venue Manager / Promoter / Driver / Hotel
- `ShowGuestListCard` — capacity / sold / holds / comps / on-list values
- `ShowHospitalityCard` — multi-line note text + a few bullet items
- `ShowOpenTasksCard` — 3 task rows with due-date pills
- `ShowSettlementCard` — gross / expenses / net values + status badge
- `ShowAttachmentsCard` — 3-4 file rows with type icon + name + size
- `ShowRecentActivityCard` — 3-5 timestamped activity entries

### 6.3 `/travel` — Travel & Hotels (mock 4)

**`pages/Travel.vue`**:

```vue
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
```

**KPIs (4-up):** Upcoming Travel Days `'14'` · Flights Booked `'12'` · Hotels Confirmed `'10'` · Travel Changes `'3'`

**Segments table columns:** Date · Trip # · Origin → Destination · Mode · Hotel · Status · Confirmation # · Notes (~6-8 rows). One row visually selected (highlighted background) — `:selected-id="travelSelectedId"` props it. Click handlers stubbed (not bound).

**`TravelTripDetailsPanel`:** Renders the selected trip with sections: Origin, Destination, Hotel, Confirmation #s, Travel Party (4-5 names). Hardcoded to whichever segment is "selected".

**Right rail:** `TravelCheckInsCard` (4-5 hotel rows with arrival date, hotel name, city, dates, badge). `TravelIssuesCard` (3 issue rows with severity badges, like dashboard's `OpenIssuesCard`).

### 6.4 `/contacts` — Contacts (mock 5)

**`pages/Contacts.vue`**:

```vue
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
```

**KPIs (4-up):** Total Contacts `'642'` (sub `'All contacts'`) · Venues `'185'` (sub `'29% of total'`) · Promoters `'218'` (sub `'34% of total'`) · Travel/Hotel `'96'` (sub `'15% of total'`)

**Filter bar (above table, inside `ContactsTable`):** A search input (visual only) + role dropdown + city dropdown + Show Type dropdown + Filters button + Clear All button. All visual, no handlers.

**Table columns:** Checkbox · Role badge · Name · Company · City · Phone · Email · Last Show · Notes · trailing icon (kebab/details). 12-15 visible rows; pagination footer "Showing 1–15 of 642" + page numbers (visual only). One row visually selected (Sarah Williams).

**`ContactDetailRail`** composes:

- Header strip — name + role badge + company/city + 4 action icons (Call, Email, View Phone, More)
- `ContactInfoCard` — Phone Numbers, Emails, Address, Notes (label/value pairs)
- `ContactShowHistoryCard` — list of past shows with date + venue (5+ entries)
- `ContactRecentActivityCard` — 3-5 timestamped activity entries

### 6.5 `/tasks` — Tasks & Follow-Ups (mock 6)

**`pages/Tasks.vue`**:

```vue
<template>
  <div class="page page--tasks">
    <PageHeader title="Tasks & Follow-Ups" subtitle="Stay on top of your responsibilities" />

    <KpiRow :kpis="tasksKpis" />

    <section class="page--tasks__body">
      <div class="page--tasks__columns">
        <TaskKanbanColumn :title="'To Do'" :count="tasksTodo.length" :tasks="tasksTodo" />
        <TaskKanbanColumn :title="'Waiting'" :count="tasksWaiting.length" :tasks="tasksWaiting" />
        <TaskKanbanColumn :title="'Due Soon'" :count="tasksDueSoon.length" :tasks="tasksDueSoon" />
        <TaskKanbanColumn :title="'Done'" :count="tasksDone.length" :tasks="tasksDone" />
      </div>

      <aside class="page--tasks__rail">
        <TaskUpcomingDeadlinesCard :deadlines="tasksDeadlines" />
        <TaskCategoriesCard :categories="tasksCategories" />
      </aside>
    </section>
  </div>
</template>
```

**KPIs (4-up):** Open Tasks `'27'` · Due Today `'6'` · Waiting on Reply `'9'` · Completed This Week `'14'`

**`TaskKanbanColumn`** header: title + count badge. Column body: `<TaskCard>` rows. Footer: "Add task" link (visual only). Layout: 4 columns × ~3-4 cards each on `lg`, vertical stack on smaller.

**`TaskCard`** content: title + due-date pill + tags (mini-badges) + assignee initials avatar.

**Right rail:** `TaskUpcomingDeadlinesCard` (5 dated entries) + `TaskCategoriesCard` (6 category rows with counts).

### 6.6 `/documents` AND `/settlements` — Documents & Settlements (mock 7)

**`pages/Documents.vue`** and **`pages/Settlements.vue`** are both:

```vue
<template>
  <DocsSettlementsView />
</template>

<script setup lang="ts">
import DocsSettlementsView from '../components/documents/DocsSettlementsView.vue'
</script>
```

**`components/documents/DocsSettlementsView.vue`** is the actual orchestration:

```vue
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
```

**KPIs (4-up):** Total Files `'132'` · Missing Docs `'18'` · Pending Settlements `'9'` · Net Due `'$128,740.00'` (uses `formatUsd` indirectly — the value is pre-formatted in the fixture)

**Tables:** `DocumentsTable` columns: Type icon · Name · Type label · Show · Uploaded By · Date · Status badge · trailing icon (~6-8 rows). `SettlementQueueTable` columns: Show · Date · Gross · Expenses · Net · Status badge (~6-8 rows). One file row selected (highlighted) — "The Ryman.pdf".

**`SelectedFilePanel`:** Big file icon + filename + file metadata (Type, Show, Uploaded, Size) + Quick Actions row (View, Download, Replace, Delete buttons — all visual only).

**Right rail:** `DocsQuickActionsCard` (4 large buttons: Upload File, Request Signature, etc.). `DocsMissingCard` (4-5 missing-document rows). `DocsSettlementIssuesCard` (3 issue rows).

## 7. Visual conventions across new pages

| Convention              | Decision                                                                                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card chrome             | `VaCard` defaults; padding `1.25rem`; no per-widget overrides this spec                                                                                                             |
| BEM class prefix        | One per component (e.g., `.advance-row`, `.travel-segments`, `.contacts-table`, `.task-card`, `.docs-files`) — keeps scoped styles non-colliding                                    |
| Grid breakpoints        | Mobile 1-col, `md` 2-col, `lg` 3-col or 4-col per page — same as dashboard                                                                                                          |
| Status / severity pills | Reuse `severityTokens` from `data/severity.ts`. Add `Status` token map for table-row "Confirmed/Pending/Missing/etc." badges (see §8)                                               |
| Date formatting         | `formatShortDate(iso)` for table cells; `formatRelativeDateTime(iso)` for activity timestamps ("May 19 · 4:08 PM"); `formatLongDate(iso)` for page header dates ("Tuesday, May 20") |
| Currency                | `formatUsd(n)` for column cells; pre-format strings in KPI fixtures where the mock shows formatted ("$128,740.00")                                                                  |
| Icons                   | Material Symbols Outlined (`mso-*`); already loaded via `index.html`                                                                                                                |
| Action buttons          | `<VaButton preset="secondary" size="small" icon="mso-...">label</VaButton>`; no `@click` handlers this spec                                                                         |
| Avatars                 | `<VaAvatar size="small">JM</VaAvatar>` for initials                                                                                                                                 |
| Table styles            | Plain `<table>` + Tailwind, same pattern as `UpcomingShowsTable`                                                                                                                    |
| Filter bars             | Render `<VaInput>` / `<VaSelect>` controls visually; no `@change`/`@input` handlers                                                                                                 |
| Pagination              | Render visually with hardcoded page numbers; no actual pagination logic                                                                                                             |

## 8. Mock data shape

### `src/data/types.ts` additions

```ts
// Append to existing types.ts; do not remove existing exports.

export type AdvanceStatus = 'Complete' | 'Need Follow-Up' | 'Missing'

export interface AdvanceSection {
  id: string
  name: string
  icon: string // mso-*
  sub?: string // small explanatory text
  done: number // count completed
  total: number // count total
  status: AdvanceStatus
}

export interface AdvanceMissingItem {
  id: string
  title: string
  sub: string
  severity: Severity // reuse from existing types
}

export interface AdvanceUpdate {
  id: string
  body: string // "Sound spec sheet uploaded by JM"
  at: string // ISO datetime
}

// Show Detail (rich nested shape)
export interface ShowSnapshot {
  venue: string
  address: string
  capacity: number
  doors: string // "7:00 PM"
  showStart: string // "7:30 PM"
  setLength: string // "90 min"
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
  type: string // "PDF", "Doc", "Image"
  sizeKb: number
}

export interface ShowActivityEntry {
  id: string
  body: string
  at: string // ISO datetime
}

export interface ShowDetail {
  id: string
  title: string // "The Ryman — Nashville, TN"
  dateIso: string // "2026-05-20"
  dateLong: string // "Tuesday, May 20"
  snapshot: ShowSnapshot
  schedule: TimelineEvent[] // reuse existing type
  contacts: QuickContact[] // reuse existing type
  guestList: ShowGuestListData
  hospitality: { rider: string; bullets: string[] }
  openTasks: { id: string; title: string; due: string; severity?: Severity }[]
  settlement: ShowSettlementSnapshot
  attachments: ShowAttachment[]
  recentActivity: ShowActivityEntry[]
}

// Travel
export type TravelMode = 'Flight' | 'Drive' | 'Train' | 'Bus'

export interface TravelSegment {
  id: string
  date: string // ISO yyyy-mm-dd
  tripNumber: string // "T-104"
  origin: string // "ATL"
  destination: string // "BNA"
  mode: TravelMode
  hotel?: string
  status: Status // reuse 'Confirmed' | 'Pending'
  confirmation?: string
  notes?: string
}

export interface TravelTrip {
  id: string // matches a TravelSegment id
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
  arrival: string // ISO date
  departure: string // ISO date
  status: Status
}

export interface TravelIssue {
  id: string
  title: string
  sub: string
  severity: Severity
}

// Contacts
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
  phones: string[] // first one is primary
  email: string
  lastShowDate?: string // ISO
  notes?: string
}

export interface ContactDetail extends Contact {
  address: string
  altEmails: string[]
  showHistory: { id: string; date: string; venue: string; city: string }[]
  recentActivity: { id: string; body: string; at: string }[]
}

// Tasks
export type TaskColumn = 'todo' | 'waiting' | 'duesoon' | 'done'

export interface TaskItem {
  id: string
  title: string
  due?: string // human "Today" / "Tomorrow" / "May 22" or ISO; renderer decides
  tags: string[] // ["Hotel", "Travel", ...]
  assigneeInitials: string
  column: TaskColumn
}

export interface TaskDeadline {
  id: string
  title: string
  date: string // ISO date
}

export interface TaskCategory {
  name: string
  count: number
}

// Documents + Settlements
export type FileType = 'PDF' | 'Doc' | 'Image' | 'Sheet'
export type FileStatus = 'Approved' | 'Pending' | 'Missing' | 'Action Needed'

export interface FileEntry {
  id: string
  type: FileType
  name: string
  category: string // "Venue Contract", "Settlement", etc.
  show: string
  uploadedBy: string
  uploadedDate: string // ISO
  status: FileStatus
}

export interface Settlement {
  id: string
  show: string // "The Ryman — Nashville"
  date: string // ISO
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
  preview: string // small description used as placeholder for file preview
  signers?: string[]
}
```

### `src/data/severity.ts` extension

Add a `statusTokens` map for table status pills (Approved / Pending / Missing / Action Needed / Confirmed / Disputed):

```ts
// Append to existing severity.ts.
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

### `src/data/format.ts` extension

Append:

```ts
const relDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const relTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

export function formatRelativeDateTime(iso: string): string {
  const d = new Date(iso)
  return `${relDate.format(d)} · ${relTime.format(d)}`
}
```

### Per-section fixture files (illustrative — full values land at implementation)

The fixtures must match the mocks 1:1 for any value visible (KPI numbers, table headers, section names, contact names like Sarah Williams, etc.). Values implied by the mock but not legible at PNG resolution are filled with plausible tour-industry data consistent with the existing dashboard fixture (Nashville/Atlanta/New Orleans tour, May 18–Jun 8 run, Jane Manager).

**`src/data/tourDates.ts`**: `advanceCurrentShow` (one show context), `advanceKpis` (3 entries — 75% / 8 of 11 / 3 missing), `advanceSections` (9 sections per the list in §6.1), `advanceMissing` (3 items), `advanceQuickContacts` (3 contacts), `advanceNotes` (1-2 notes), `advanceUpdates` (3 entries).

**`src/data/shows.ts`**: a single `showDetail: ShowDetail` for "The Ryman — Nashville, TN" on 2026-05-20. Reuses the dashboard's `todayTimeline` shape for `schedule` and `quickContacts` for `contacts` (or imports them directly from `dashboard.ts` to keep one source of truth).

**`src/data/travel.ts`**: `travelKpis` (4 — 14/12/10/3), `travelSegments` (6-8 rows; one with `id: 'sel'` is the visually-selected), `travelSelectedId = 'sel'`, `travelSelectedTrip` (full TravelTrip), `travelCheckIns` (4-5), `travelIssues` (3).

**`src/data/contacts.ts`**: `contactsKpis` (4 — 642/185/218/96), `contactsDirectory` (15 entries; one with `id: 'sel'` is selected, set to "Sarah Williams" with role "Venue Mgr", company "The Ryman", city "Nashville"), `contactsSelectedId = 'sel'`, `contactsSelectedContact: ContactDetail` (the rich detail for Sarah Williams).

**`src/data/tasks.ts`**: `tasksKpis` (4 — 27/6/9/14), four arrays `tasksTodo`, `tasksWaiting`, `tasksDueSoon`, `tasksDone` (3-4 items each; total reasonably matches "27 open"), `tasksDeadlines` (5), `tasksCategories` (6).

**`src/data/documents.ts`**: `docsKpis` (4 — 132/18/9/`'$128,740.00'`), `docsFiles` (6-8 files; one with `id: 'sel'` for "The Ryman.pdf"), `docsSelectedId = 'sel'`, `docsSelectedFile: DocsSelectedFile`, `docsSettlements` (6-8), `docsMissing` (4-5), `docsIssues` (3).

## 9. Cleanup operations

### Files to delete

None. This spec is purely additive on top of `v0.1.0-skeleton`.

### Files to modify

- `src/components/PageHeader.vue` — slot extensions per §5
- `src/components/dashboard/KpiTile.vue` — **move** to `src/components/KpiTile.vue` (path migration; update the dashboard's import)
- `src/pages/Dashboard.vue` — update import path of `KpiTile`; optionally migrate the inline kpi-row to `<KpiRow>` (implementer's call, low priority)
- `src/data/types.ts` — append new interfaces (do not remove existing)
- `src/data/severity.ts` — append `statusTokens`
- `src/data/format.ts` — append `formatRelativeDateTime`

### Dependencies

No new deps. All widgets compose from existing Vuestic UI primitives.

### `package.json`

Bump `version`: `0.1.0` → `0.2.0` (we're shipping the rest of the IA). Optional — implementer's call. Don't tag in this spec; tagging happens after the plan executes.

## 10. Definition of done

- [ ] `npm run dev` boots cleanly. No "Failed to resolve import" or runtime errors.
- [ ] `/dashboard` still renders the v0.1.0-skeleton dashboard correctly (no regression from the `KpiTile` move or `PageHeader` extension).
- [ ] `/tour-dates` renders the Advance Checklist faithfully — 3 KPIs, 9 advance sections with progress + status pills, right rail with 4 cards. Show switcher button renders next to the page title.
- [ ] `/shows` renders the Show Detail faithfully — breadcrumb, show-switcher title, action buttons, 3-row 9-card grid (Snapshot, Schedule, Contacts; Guest List, Hospitality, Open Tasks; Settlement, Attachments, Recent Activity).
- [ ] `/travel` renders Travel & Hotels — breadcrumb, 4 KPIs, segments table with one row visually selected, trip details panel below, right rail (CheckIns + Issues).
- [ ] `/contacts` renders Contacts directory — 4 KPIs, filter bar (visual), 15-row paginated table, detail rail showing Sarah Williams with three sub-cards.
- [ ] `/tasks` renders Tasks & Follow-Ups — 4 KPIs, 4-column kanban with task cards, right rail (Deadlines + Categories).
- [ ] `/documents` AND `/settlements` BOTH render the same Documents & Settlements combined view — breadcrumb, 4 KPIs (including Net Due `$128,740.00`), Documents + Settlements tables side-by-side, Selected File panel below, right rail (QuickActions + Missing + Issues). Sidebar active item highlights correctly per route.
- [ ] `/itinerary` and `/notes` continue to render `<PagePlaceholder>` (no regression).
- [ ] `/no-such-route` still renders the NotFound page.
- [ ] `npm run build:ci` completes. No errors.
- [ ] No broken imports anywhere (`grep` for the old dashboard-scoped `KpiTile` path returns clean after the move).
- [ ] No console errors / warnings in the browser when navigating through every route.
- [ ] Spec file (this doc) committed; implementation work committed in subsequent commits keyed to the writing-plans output.

## 11. Non-goals / decisions explicitly deferred

- **Real interactivity.** Search, filters, sort, pagination, kanban drag, row selection, action handlers — all stubbed visually. Wiring them is a future spec, gated by data layer readiness.
- **Detail routes.** No `/shows/:id`, `/contacts/:id`, etc. The mock shows "current show" — that's the model.
- **Real services / Pinia stores.** Constants only.
- **Itinerary + Notes pages.** No mocks. They get their own specs once designs arrive.
- **Tests.** Same posture as v0.1.0. When real behavior arrives, tests get a dedicated spec.
- **Brand identity / theme tokens.** Vuestic defaults stand in.
- **The progress ring** in the Tour Dates KPI (circular SVG around "75%") — falls back to a regular `KpiTile` value display. The ring is a polish-pass stretch, optional in this spec.
- **Real avatars / file thumbnails / map embeds.** Initial-letter avatars, file icons, and text labels stand in.
- **Production build hygiene.** `npm run build` (full lint + vue-tsc) may flag pre-existing strict-TS issues; `build:ci` is the bar for this spec.
- **Show-switcher dropdown content.** The button renders but doesn't open. Future spec wires a dropdown populated by the upcoming-shows list.
- **Mobile / narrow-viewport layouts beyond what comes for free** with the existing grid breakpoints. Not regressing mobile, but not designing detail layouts for it either.
- **Settling the Documents/Settlements IA semantically.** The mocks combine them at one view; the IA shows two items. Both routes render the same view here. A future spec may collapse the IA, separate the views, or introduce intra-page tabs — not this one.

---

_End of spec. Implementation plan to follow via `superpowers:writing-plans`._
