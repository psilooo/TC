# TourCraft — Global Dashboard Redesign

|                             |                                                                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Date**                    | 2026-05-13                                                                                                                                                   |
| **Status**                  | Draft (pending user review)                                                                                                                                  |
| **Author**                  | Claude (collaborating with user)                                                                                                                             |
| **Implementation**          | Next session via `superpowers:writing-plans` → `superpowers:subagent-driven-development`                                                                     |
| **Repo state at spec time** | TourCraft on `main` at tag `v0.2.0-screens`. `/dashboard` currently renders the single-tour "Tour Dashboard" (7 widgets, single-tour scope, fixture `data/dashboard.ts`). |
| **Reference mock**          | `newScreens/global_dashboard.png` (converted from `.heic`). Multi-artist roster view.                                                                        |

---

## 1. Context

The current `/dashboard` is single-tour: 4 KPIs, a Today timeline, a 72-hour show list, travel & hotel, quick contacts, open issues, an upcoming shows table, and recent notes. All seven widgets are scoped to one implicit tour and consume `data/dashboard.ts`. Nothing else in the codebase imports those widgets or that fixture.

The user has given a new mock for `/dashboard` showing a **multi-artist roster view**: 4 artists (Baka, Luna Rae, Kofi James, Maya Stone), each with their own tour, surfaced together on one page so the user can scan everything important "at a glance before clicking on any individual item for more detail." This redesign replaces the Tour Dashboard wholesale.

`Artist` is a brand-new concept in this codebase — `grep -ri artist src/` finds nothing.

## 2. Goal

Replace the page at `/dashboard` with a faithful render of the Global Dashboard mock. Introduce `Artist` as a dashboard-only typed concept (no app-wide artist dimension). Wire every clickable element to an existing or stub route. Wireframe fidelity (Vuestic default tokens), no real data, no real handlers beyond navigation.

## 3. Scope

### Locked decisions (from brainstorming)

- **Scope — Q1 → "Dashboard only"**: only `/dashboard` changes. Other pages stay tour-scoped exactly as today. No `Artist` switcher in the nav. No app-wide artist dimension. The `Artist` type is added to `types.ts` so it's positioned for future promotion, but is consumed only by the new dashboard fixture.
- **Click-through — Q2 → "Fully wired"**: every row, KPI tile, card, and "View All" footer is a `RouterLink`. Destinations that don't exist today are stubbed with `PagePlaceholder` (per §7).
- **Approach — Q3 → "Clean replacement"**: delete all 7 current dashboard widgets and the old fixture. Build the new page from scratch under `src/components/dashboard/`. No widget is adapted.
- **Issues route — Q4 → "New `/issues` stub + sidebar entry under Tasks"**: a new sidebar item `Issues` (icon `mso-priority_high`) is inserted directly after `Tasks`. Both the "Critical Issues" KPI tile and the rows inside the `CriticalIssuesCard` route to `/issues`.

### In scope

1. Replace `src/pages/Dashboard.vue` end-to-end. Title becomes **"Global Dashboard"**; subtitle becomes **"Overview across all artists and tours"**; a **"Customize Dashboard"** button sits in the `PageHeader` `#actions` slot (visual-only, click → `console.log` stub).
2. Build 8 new dashboard widgets under `src/components/dashboard/` (see §6).
3. New fixture `src/data/globalDashboard.ts` containing all data the page consumes.
4. New types in `src/data/types.ts` (Section "Global Dashboard").
5. Three new stub pages: `Artists.vue`, `ArtistDetail.vue`, `Issues.vue` — each a 3-line `<PagePlaceholder>` consumer.
6. Three new routes in `src/router/index.ts`. One new sidebar entry. One new i18n key.

### Out of scope

- No `/artists/:id` detail content beyond `<PagePlaceholder>`. Same for `/artists` and `/issues`.
- No `Artist` switcher in the top nav. No app-wide artist scoping.
- No real "Resolve" action on Critical Issues — the button is a plain `VaButton` whose click bubbles to the row's `RouterLink`, which navigates to `/issues`.
- No filter state in query params (e.g. `/tasks?queue=critical`). All KPI/row routes go to a static destination.
- No drag-to-customize behavior. The "Customize Dashboard" button is visual-only.
- No changes to the existing AppNavbar, sidebar shell, or any other page.

## 4. File inventory

### New files (12)

```
src/data/globalDashboard.ts
src/components/dashboard/ArtistKpiRow.vue
src/components/dashboard/TodayAcrossArtistsTable.vue
src/components/dashboard/GlobalNext72HoursCard.vue
src/components/dashboard/CriticalIssuesCard.vue
src/components/dashboard/RequiredActionsCard.vue
src/components/dashboard/TravelMovementCard.vue
src/components/dashboard/WaitingOnCard.vue
src/components/dashboard/ArtistReadinessGrid.vue
src/pages/Artists.vue
src/pages/ArtistDetail.vue
src/pages/Issues.vue
```

Breakdown: 1 fixture + 8 widget components + 3 stub pages.

### Modified files (5)

```
src/data/types.ts                       — add "Global Dashboard" section (see §5)
src/router/index.ts                     — add 3 child routes after `tasks`
src/components/sidebar/NavigationRoutes.ts  — insert `issues` entry after `tasks`
src/i18n/locales/gb.json                — add `"issues": "Issues"` to menu
src/pages/Dashboard.vue                 — rewritten end-to-end
```

### Deleted files (8)

```
src/data/dashboard.ts
src/components/dashboard/Next72HoursCard.vue
src/components/dashboard/OpenIssuesCard.vue
src/components/dashboard/QuickContactsCard.vue
src/components/dashboard/RecentNotesCard.vue
src/components/dashboard/TodayTimelineCard.vue
src/components/dashboard/TravelHotelCard.vue
src/components/dashboard/UpcomingShowsTable.vue
```

All 8 deletes verified as referenced only by the old `Dashboard.vue` (grep confirmed at spec time).

## 5. Data model

### Additions to `src/data/types.ts`

Appended after the existing "Additional Screens" section. Section header in source: `// === Global Dashboard (added by spec 2026-05-13-tourcraft-global-dashboard) ===`.

```ts
export interface ArtistRef {
  id: string                       // 'baka' | 'luna-rae' | 'kofi-james' | 'maya-stone'
  name: string                     // 'Baka'
  tourName: string                 // 'Spring 2025 Run'
  avatarInitials: string           // 'B', 'LR', 'KJ', 'MS' (1–2 chars, drives avatar circle)
}

export interface GlobalKpi {
  icon: string                     // mso-* identifier
  label: string                    // 'ARTISTS ACTIVE' — rendered uppercase via CSS
  value: string                    // pre-formatted ('4', '14')
  sub: string                      // 'On tour' | 'Across 2 artists' | etc.
  routeName: string                // 'artists' | 'shows' | 'travel' | 'issues' | 'tasks'
}

export type ArtistDayStatus = 'Show Day' | 'Travel Day' | 'Off Day' | 'Promo Day'
export type ArtistTrack = 'On Track' | 'Needs Attention' | 'At Risk'

export interface ArtistTodayRow {
  artist: ArtistRef
  city: string                     // 'Nashville, TN'
  dayStatus: ArtistDayStatus
  nextUp: { title: string; sub: string }   // 'Show 7:00 PM' / 'Ryman Auditorium'
  track: ArtistTrack
}

export type TimelineKind = 'Show' | 'Travel' | 'Deadline'

export interface GlobalTimelineEvent {
  id: string
  artistId: string                 // for routing
  title: string                    // 'Baka — Nashville show'
  sub: string                      // 'Ryman Auditorium' or '11:15 AM'
  kind: TimelineKind
}

export interface GlobalTimelineGroup {
  label: string                    // 'TODAY • MAY 19' | 'TOMORROW • MAY 20' | 'MAY 21'
  events: GlobalTimelineEvent[]
}

export interface CriticalIssue {
  id: string
  title: string                    // 'Hotel not confirmed'
  artistId: string
  artistName: string               // 'Baka'
  due: string                      // 'May 19' (pre-formatted via formatShortDate or hardcoded)
  severity: Severity               // reuses existing 'High' | 'Medium' | 'Low'
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
  primary: string                  // 'Luna Rae — BNA → CLT'
  sub: string                      // 'May 19 • 11:15 AM'
  artistId: string
  tag: TravelWatchTag
}

export interface WaitingOnRow {
  id: string
  title: string                    // 'Hilton Atlanta hotel confirmation'
  sub: string                      // 'Baka — May 22'
  artistId: string
  waitingOn: string                // 'Hilton Sales' (right-side badge label)
}

export interface ArtistReadiness {
  artist: ArtistRef                // tour name comes from artist.tourName
  todayLabel: string               // 'Today: Charlotte travel' | 'Today: Off day' | 'Today: Detroit travel'
  readinessPct: number             // 0–100 — drives the SVG ring
  risks: number
  tasksDue: number
  daysToShow: number
}
```

### Reuse of existing tokens

- `Severity` (existing): drives `CriticalIssue.severity` color via the existing `severityTokens` map.
- Status badges new to this spec (`ArtistDayStatus`, `ArtistTrack`, `ActionStatus`, `TravelWatchTag`) are added to the existing `statusTokens` map in `src/data/severity.ts`. Concrete color mapping:
  - `Show Day` → `info` (blue)
  - `Travel Day` → `warning` (amber)
  - `Off Day` → `secondary` (neutral)
  - `Promo Day` → `info`
  - `On Track` → `success`
  - `Needs Attention` → `warning`
  - `At Risk` → `danger`
  - `Open` → `secondary`
  - `Due Today` → `warning`
  - `Overdue` → `danger`
  - `Driver Not Assigned` → `danger`
  - `Pickup Unconfirmed` → `warning`
  - `Pending` → `warning`
- `WaitingOnRow.waitingOn` is a free-form label, not an enum. Right-side badge uses a neutral Vuestic chip (`color="secondary"`).

### `src/data/globalDashboard.ts` exports

All exports are typed against §5 interfaces. Quantities match the mock:

| Export                | Type                       | Count |
| --------------------- | -------------------------- | ----- |
| `artists`             | `{ [shortKey]: ArtistRef }` | 4     |
| `kpis`                | `GlobalKpi[]`              | 5     |
| `todayAcrossArtists`  | `ArtistTodayRow[]`         | 4     |
| `next72h`             | `GlobalTimelineGroup[]`    | 3 groups, 8 events total |
| `criticalIssues`      | `CriticalIssue[]`          | 4     |
| `requiredActions`     | `RequiredAction[]`         | 5     |
| `travelWatch`         | `TravelWatchRow[]`         | 3     |
| `waitingOn`           | `WaitingOnRow[]`           | 5     |
| `artistReadiness`     | `ArtistReadiness[]`        | 4     |

Concrete fixture content (verbatim from mock where readable):

**`artists`**:
- `baka`: { id: 'baka', name: 'Baka', tourName: 'Spring 2025 Run', avatarInitials: 'B' }
- `lunaRae`: { id: 'luna-rae', name: 'Luna Rae', tourName: 'Festival Run', avatarInitials: 'LR' }
- `kofiJames`: { id: 'kofi-james', name: 'Kofi James', tourName: 'KJ Promo Tour', avatarInitials: 'KJ' }
- `mayaStone`: { id: 'maya-stone', name: 'Maya Stone', tourName: 'Summer Club Run', avatarInitials: 'MS' }

**`kpis`** (in mock order):
1. `mso-group`, "ARTISTS ACTIVE", "4", "On tour", `routeName: 'artists'`
2. `mso-calendar_today`, "SHOWS TODAY", "2", "Across 2 artists", `routeName: 'shows'`
3. `mso-flight`, "TRAVEL DAYS", "2", "Across 2 artists", `routeName: 'travel'`
4. `mso-warning`, "CRITICAL ISSUES", "4", "Requires immediate action", `routeName: 'issues'`
5. `mso-task_alt`, "ACTIVE TASKS", "14", "Across 2 artists", `routeName: 'tasks'`

**`todayAcrossArtists`** (in mock order):
1. Baka — Nashville, TN — Show Day — "Show 7:00 PM" / "Ryman Auditorium" — On Track
2. Luna Rae — Charlotte, NC — Travel Day — "Flight BNA → CLT" / "11:15 AM" — On Track
3. Kofi James — London, UK — Off Day — "Free day, recovery" / "—" — On Track
4. Maya Stone — Joshua Tree, CA — Show Day — "House of Blues" / "Doors 7:30 PM" — Needs Attention

**`next72h`** (3 groups, content from mock):
- Group "TODAY • MAY 19":
  - Baka — Nashville show / Ryman Auditorium / Show
  - Luna Rae — BNA → CLT / 11:15 AM / Travel
  - Maya Stone — Chicago show / House of Blues / Show
- Group "TOMORROW • MAY 20":
  - Luna Rae — Charlotte show / The Fillmore / Show
  - Kofi James — Berlin show / Virgil Music Hall / Show
  - Baka — Atlanta hotel confirmation due / — / Deadline
- Group "MAY 21":
  - Maya Stone — Detroit travel / — / Travel
  - Kofi James — London show / — / Show

**`criticalIssues`** (from mock, 4 items):
1. "Hotel not confirmed" — Baka — May 19 — High
2. "Off-load contract missing" — Luna Rae — May 19 — High
3. "Settlement terms missing" — Maya Stone — May 19 — Medium
4. "Guest list not received" — Kofi James — May 19 — Medium

**`requiredActions`** (5 items):
1. "Confirm guest pickup" — Baka — May 19 — Due Today
2. "Send Charlotte routing list" — Luna Rae — May 19 — Open
3. "Upload signed settlement sheet" — Kofi James — May 19 — Overdue
4. "Approve rider" — Maya Stone — May 20 — Open
5. "Tour manager check-in" — Baka — May 19 — Open

**`travelWatch`** (3 items):
1. "Luna Rae — BNA → CLT" / "May 19 • 11:15 AM" / Driver Not Assigned
2. "Maya Stone — DTW arrival" / "May 20" / Pickup Unconfirmed
3. "Baka — Charlotte hotel check-in" / "May 20" / Pending

**`waitingOn`** (5 items):
1. "Hilton Atlanta hotel confirmation" / "Baka — May 22" / "Hilton Sales"
2. "Berlin settlement approval" / "Kofi James — May 19" / "Promoter"
3. "Guest list" / "Maya Stone — May 19" / "Artist Team"
4. "Driver assignment" / "Luna Rae — May 19" / "Transport Co."
5. "Rider approval" / "Baka — May 20" / "Venue Production"

**`artistReadiness`** (4 items, percentages from mock):
1. Baka (Spring 2025 Run) — "Today: Charlotte travel" — 76% — Risks 3, Tasks 6, Days 3
2. Luna Rae (Festival Run) — "Today: Charlotte show" — 64% — Risks 2, Tasks 4, Days 2
3. Kofi James (KJ Promo Tour) — "Today: Off day" — 82% — Risks 1, Tasks 3, Days 4
4. Maya Stone (Summer Club Run) — "Today: Detroit travel" — 69% — Risks 2, Tasks 5, Days 2

`daysToShow` for each is a single digit (hardcoded; not derived from any date math).

## 6. Component specs

All components are `<script setup lang="ts">` SFCs with scoped SCSS using BEM-style class names (existing convention). All wrap content in a Vuestic `VaCard` unless noted. All rows wrap in `<RouterLink>` with `display: block; color: inherit; text-decoration: none;`.

### 6.1 `ArtistKpiRow.vue`

**Props:** `kpis: GlobalKpi[]` (length must be 5)
**Layout:** 5-column grid at `lg`, 2 at `md`, 1 at `sm`.
**Body:** for each KPI, render `<RouterLink :to="{ name: kpi.routeName }">` wrapping the existing `<KpiTile>` component (unchanged). `KpiTile` keeps its current props (`icon`, `label`, `value`, `sub`).
**No internal state.**

### 6.2 `TodayAcrossArtistsTable.vue`

**Props:** `rows: ArtistTodayRow[]`
**Header:** card title "Today Across Artists" (no count).
**Body:** vertical list. Each row is a `RouterLink` to `{ name: 'artist-detail', params: { id: row.artist.id } }`. Row contents (left → right):
- Avatar circle: 32px, `var(--va-primary)` background, white initials, `row.artist.avatarInitials`.
- Stack: bold artist name + small grey tour name (`row.artist.tourName`).
- City (`row.city`).
- Day-status chip (`VaBadge` or `VaChip`, color from `statusTokens[row.dayStatus]`).
- Next-up stack: bold title + small grey sub.
- Right-aligned track chip (color from `statusTokens[row.track]`).
**Footer:** `<RouterLink :to="{ name: 'tour-dates' }">View Full Run Overview →</RouterLink>`

### 6.3 `GlobalNext72HoursCard.vue`

**Props:** `groups: GlobalTimelineGroup[]`
**Header:** "Next 72 Hours" with `mso-schedule` icon prefix.
**Body:** for each group, an uppercase day-label header (e.g., "TODAY • MAY 19", `font-size: 0.75rem; letter-spacing: 0.05em; color: var(--va-secondary)`), then rows. Each event row is a `RouterLink`:
- `kind === 'Show'` → `{ name: 'shows' }`
- `kind === 'Travel'` → `{ name: 'travel' }`
- `kind === 'Deadline'` → `{ name: 'tasks' }`
Row contents: bold title, small grey sub, right-side small chip (SHOW/TRAVEL/DEADLINE, uppercase, color from `statusTokens` per kind).
**Footer:** `<RouterLink :to="{ name: 'itinerary' }">View Full Timeline →</RouterLink>`

### 6.4 `CriticalIssuesCard.vue`

**Props:** `issues: CriticalIssue[]`
**Header:** "Critical Issues" with `mso-warning` icon prefix (`color: var(--va-danger)`).
**Body:** rows. Each row is a `RouterLink` to `{ name: 'issues' }`. Row contents:
- Left dot/icon colored by `severityTokens[issue.severity]`
- Stack: bold title + grey sub "{issue.artistName} — {issue.due}"
- Right: `<VaButton size="small" preset="primary">Resolve</VaButton>` (plain button, not a nested link). Click bubbles to the row's `RouterLink` and navigates to `/issues` — same destination, so no event-propagation handling needed.
**Footer:** `<RouterLink :to="{ name: 'issues' }">View All Issues & Risks →</RouterLink>`

### 6.5 `RequiredActionsCard.vue`

**Props:** `actions: RequiredAction[]`
**Header:** "Today's Required Actions" with `mso-checklist` icon prefix.
**Body:** tabular list (4 columns: title, artist, due, status chip). Each row is a `RouterLink` to `{ name: 'tasks' }`. Status chip color from `statusTokens[action.status]`.
**Footer:** `<RouterLink :to="{ name: 'tasks' }">View All Tasks →</RouterLink>`

### 6.6 `TravelMovementCard.vue`

**Props:** `rows: TravelWatchRow[]`
**Header:** "Travel & Movement Watch" with `mso-flight` icon prefix.
**Body:** rows. Each row is a `RouterLink` to `{ name: 'travel' }`. Row contents:
- Stack: bold `row.primary` + small grey `row.sub`
- Right: uppercase tag chip (color from `statusTokens[row.tag]`)
**Footer:** `<RouterLink :to="{ name: 'travel' }">View All Travel →</RouterLink>`

### 6.7 `WaitingOnCard.vue`

**Props:** `rows: WaitingOnRow[]`
**Header:** "Waiting On" with `mso-pending` icon prefix.
**Body:** rows. Each row is a `RouterLink` to `{ name: 'tasks' }`. Row contents:
- Stack: bold `row.title` + small grey `row.sub`
- Right: neutral chip with `row.waitingOn` text (color="secondary")
**Footer:** `<RouterLink :to="{ name: 'tasks' }">View All Waiting On →</RouterLink>`

### 6.8 `ArtistReadinessGrid.vue`

**Props:** `cards: ArtistReadiness[]`
**Header:** card-level title "Artist Readiness Overview".
**Body:** grid of 4 sub-cards (4 cols at `lg`, 2 at `md`, 1 at `sm`). Each sub-card is a `RouterLink` to `{ name: 'artist-detail', params: { id: card.artist.id } }`. Sub-card contents:
- Top row (flex): left = avatar 48px (initials) + stack (name bold, `card.artist.tourName` small grey, `card.todayLabel` small grey); right = SVG ring 64×64 with percentage in center.
- Bottom row (flex, 3 cols): "{card.risks}\nRisks" / "{card.tasksDue}\nTasks Due" / "{card.daysToShow}\nDays to Show" — number on top large, label below small.
**Footer:** `<RouterLink :to="{ name: 'artists' }">View All Artist Details →</RouterLink>`

**SVG ring implementation** (inline, no dependency):
```html
<svg viewBox="0 0 36 36" class="readiness-ring">
  <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--va-background-element)" stroke-width="3" />
  <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--va-primary)" stroke-width="3"
          :stroke-dasharray="`${pct} ${100 - pct}`" stroke-dashoffset="25" transform="rotate(-90 18 18)" />
  <text x="18" y="20" text-anchor="middle" font-size="9" font-weight="700">{{ pct }}%</text>
</svg>
```
The 15.915 radius makes the circumference ≈ 100, so `stroke-dasharray` accepts percentages directly.

### 6.9 Dashboard.vue (rewritten)

```vue
<template>
  <div class="global-dashboard">
    <PageHeader title="Global Dashboard" subtitle="Overview across all artists and tours">
      <template #actions>
        <VaButton preset="secondary" icon="mso-tune" @click="onCustomize">Customize Dashboard</VaButton>
      </template>
    </PageHeader>

    <section class="global-dashboard__kpi-row">
      <ArtistKpiRow :kpis="kpis" />
    </section>

    <section class="global-dashboard__today">
      <TodayAcrossArtistsTable :rows="todayAcrossArtists" />
    </section>

    <section class="global-dashboard__next72">
      <GlobalNext72HoursCard :groups="next72h" />
    </section>

    <section class="global-dashboard__critical">
      <CriticalIssuesCard :issues="criticalIssues" />
    </section>

    <section class="global-dashboard__actions">
      <RequiredActionsCard :actions="requiredActions" />
    </section>

    <section class="global-dashboard__travel">
      <TravelMovementCard :rows="travelWatch" />
    </section>

    <section class="global-dashboard__waiting">
      <WaitingOnCard :rows="waitingOn" />
    </section>

    <section class="global-dashboard__readiness">
      <ArtistReadinessGrid :cards="artistReadiness" />
    </section>
  </div>
</template>

<script setup lang="ts">
// imports for all 8 widget components + PageHeader + fixture exports
function onCustomize() {
  // eslint-disable-next-line no-console
  console.log('Customize Dashboard — stub')
}
</script>
```

## 7. Page layout & responsive grid

The page uses a 12-column CSS Grid. Section names match the BEM modifier on each `<section>` above.

```scss
.global-dashboard {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;

  &__kpi-row,
  &__readiness     { grid-column: 1 / -1; }

  // @media (min-width: 1024px) — desktop layout from the mock
  @media (min-width: 1024px) {
    &__today       { grid-column: 1 / 9; }
    &__critical    { grid-column: 1 / 5; }
    &__actions     { grid-column: 5 / 9; }
    &__next72      { grid-column: 9 / 13; grid-row: span 2; }
    &__travel      { grid-column: 9 / 13; }
    &__waiting     { grid-column: 9 / 13; }
  }

  @media (max-width: 1023px) {
    & > section { grid-column: 1 / -1; }
  }
}
```

KPI row uses its own internal responsive grid (1 / 2 / 3 / 5 at sm / md / lg / xl), same as the current dashboard's KPI row but extended to 5 columns.

`PageHeader` already has an `#actions` slot — no change needed.

## 8. Routing & navigation

### `src/router/index.ts`

Insert these three routes as children of the existing `AppLayout` route, in this order, **directly after the `tasks` route**:

```ts
{ path: 'issues', name: 'issues', component: () => import('../pages/Issues.vue') },
{ path: 'artists', name: 'artists', component: () => import('../pages/Artists.vue') },
{ path: 'artists/:id', name: 'artist-detail', component: () => import('../pages/ArtistDetail.vue') },
```

### `src/components/sidebar/NavigationRoutes.ts`

Insert exactly one entry, directly after the `tasks` entry:

```ts
{ name: 'issues', displayName: 'menu.issues', meta: { icon: 'mso-priority_high' } },
```

`/artists` and `/artists/:id` are intentionally **not** in the sidebar — they're dashboard-only destinations per Q1.

### `src/i18n/locales/gb.json`

Add `"issues": "Issues"` to the `menu` block, placed directly after `"tasks": "Tasks"` to mirror sidebar order.

### Three new stub pages

Each is a 3-line consumer of `PagePlaceholder`, identical to `Notes.vue`:

```vue
<template>
  <PagePlaceholder name="Artists" />
</template>

<script setup lang="ts">
import PagePlaceholder from '../components/PagePlaceholder.vue'
</script>
```

Names: `Artists`, `Artist Detail`, `Issues`.

## 9. Click-through map

| Element                                | Destination                                                  |
| -------------------------------------- | ------------------------------------------------------------ |
| KPI: Artists Active                    | `/artists`                                                   |
| KPI: Shows Today                       | `/shows`                                                     |
| KPI: Travel Days                       | `/travel`                                                    |
| KPI: Critical Issues                   | `/issues`                                                    |
| KPI: Active Tasks                      | `/tasks`                                                     |
| Today Across Artists row               | `/artists/:id` (per row's artist)                            |
| Today Across Artists footer            | `/tour-dates`                                                |
| Next 72 Hours — Show event             | `/shows`                                                     |
| Next 72 Hours — Travel event           | `/travel`                                                    |
| Next 72 Hours — Deadline event         | `/tasks`                                                     |
| Next 72 Hours footer                   | `/itinerary`                                                 |
| Critical Issues row                    | `/issues`                                                    |
| Critical Issues "Resolve" button       | `/issues` (click bubbles to the row's `RouterLink`)          |
| Critical Issues footer                 | `/issues`                                                    |
| Required Actions row                   | `/tasks`                                                     |
| Required Actions footer                | `/tasks`                                                     |
| Travel & Movement Watch row            | `/travel`                                                    |
| Travel & Movement Watch footer         | `/travel`                                                    |
| Waiting On row                         | `/tasks`                                                     |
| Waiting On footer                      | `/tasks`                                                     |
| Artist Readiness card                  | `/artists/:id` (per card's artist)                           |
| Artist Readiness footer                | `/artists`                                                   |
| "Customize Dashboard" button           | (none — `console.log` stub)                                  |

## 10. Acceptance criteria

A successful implementation:

1. `/dashboard` renders the new Global Dashboard page. `npm run dev` shows no console errors.
2. Title is "Global Dashboard"; subtitle is "Overview across all artists and tours"; "Customize Dashboard" button sits to the right of the header.
3. KPI row shows exactly the 5 tiles in §5's `kpis` order. Each tile is a clickable `RouterLink`.
4. "Today Across Artists" table shows exactly 4 rows in §5's order.
5. "Next 72 Hours" panel shows 3 day groups in §5's order with the listed events.
6. "Critical Issues", "Today's Required Actions", "Travel & Movement Watch", "Waiting On" panels each render in §5's order.
7. "Artist Readiness Overview" shows 4 cards in §5's order. Each card has an SVG ring rendering the listed percentage.
8. Every clickable element in §9 navigates to its stated destination. The Customize button only `console.log`s.
9. Sidebar shows a new "Issues" entry directly below "Tasks". `/issues` renders a `PagePlaceholder` titled "Issues".
10. `/artists` and `/artists/:id` render `PagePlaceholder`s; they are not in the sidebar.
11. `npm run build:ci` passes (lint + type-check + build).
12. After deletion, no broken imports remain anywhere in `src/` (`npm run build:ci` proves this; spot grep confirms `data/dashboard` and each deleted widget name yield zero hits in `src/`).
13. Layout matches the mock at ≥ 1024px width. Below 1024px, sections stack 1-column.

## 11. Implementation notes for the plan

- Order matters: types & severity tokens → fixture → widgets → page → routes → sidebar/i18n → delete old files last. Deleting old files first would briefly break `Dashboard.vue` and put the dev server in an error state.
- The 8-file delete (7 old widgets + old `data/dashboard.ts`) happens in a single commit after the new page is wired and dev-server-clean.
- Reuse of `KpiTile` is important — do **not** rebuild the tile. `ArtistKpiRow` is just the 5-up grid + RouterLink wrapper around `KpiTile`.
- No new top-level dependencies. SVG ring is hand-rolled.

---

End of spec.
