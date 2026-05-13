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
  {
    id: 'i2',
    title: 'Off-load contract missing',
    artistId: 'luna-rae',
    artistName: 'Luna Rae',
    due: 'May 19',
    severity: 'High',
  },
  {
    id: 'i3',
    title: 'Settlement terms missing',
    artistId: 'maya-stone',
    artistName: 'Maya Stone',
    due: 'May 19',
    severity: 'Medium',
  },
  {
    id: 'i4',
    title: 'Guest list not received',
    artistId: 'kofi-james',
    artistName: 'Kofi James',
    due: 'May 19',
    severity: 'Medium',
  },
]

export const requiredActions: RequiredAction[] = [
  { id: 'a1', title: 'Confirm guest pickup', artistId: 'baka', artistName: 'Baka', due: 'May 19', status: 'Due Today' },
  {
    id: 'a2',
    title: 'Send Charlotte routing list',
    artistId: 'luna-rae',
    artistName: 'Luna Rae',
    due: 'May 19',
    status: 'Open',
  },
  {
    id: 'a3',
    title: 'Upload signed settlement sheet',
    artistId: 'kofi-james',
    artistName: 'Kofi James',
    due: 'May 19',
    status: 'Overdue',
  },
  { id: 'a4', title: 'Approve rider', artistId: 'maya-stone', artistName: 'Maya Stone', due: 'May 20', status: 'Open' },
  { id: 'a5', title: 'Tour manager check-in', artistId: 'baka', artistName: 'Baka', due: 'May 19', status: 'Open' },
]

export const travelWatch: TravelWatchRow[] = [
  {
    id: 'tw1',
    primary: 'Luna Rae — BNA → CLT',
    sub: 'May 19 • 11:15 AM',
    artistId: 'luna-rae',
    tag: 'Driver Not Assigned',
  },
  { id: 'tw2', primary: 'Maya Stone — DTW arrival', sub: 'May 20', artistId: 'maya-stone', tag: 'Pickup Unconfirmed' },
  { id: 'tw3', primary: 'Baka — Charlotte hotel check-in', sub: 'May 20', artistId: 'baka', tag: 'Pending' },
]

export const waitingOn: WaitingOnRow[] = [
  {
    id: 'w1',
    title: 'Hilton Atlanta hotel confirmation',
    sub: 'Baka — May 22',
    artistId: 'baka',
    waitingOn: 'Hilton Sales',
  },
  {
    id: 'w2',
    title: 'Berlin settlement approval',
    sub: 'Kofi James — May 19',
    artistId: 'kofi-james',
    waitingOn: 'Promoter',
  },
  { id: 'w3', title: 'Guest list', sub: 'Maya Stone — May 19', artistId: 'maya-stone', waitingOn: 'Artist Team' },
  { id: 'w4', title: 'Driver assignment', sub: 'Luna Rae — May 19', artistId: 'luna-rae', waitingOn: 'Transport Co.' },
  { id: 'w5', title: 'Rider approval', sub: 'Baka — May 20', artistId: 'baka', waitingOn: 'Venue Production' },
]

export const artistReadiness: ArtistReadiness[] = [
  {
    artist: artists.baka,
    todayLabel: 'Today: Charlotte travel',
    readinessPct: 76,
    risks: 3,
    tasksDue: 6,
    daysToShow: 3,
  },
  {
    artist: artists.lunaRae,
    todayLabel: 'Today: Charlotte show',
    readinessPct: 64,
    risks: 2,
    tasksDue: 4,
    daysToShow: 2,
  },
  { artist: artists.kofiJames, todayLabel: 'Today: Off day', readinessPct: 82, risks: 1, tasksDue: 3, daysToShow: 4 },
  {
    artist: artists.mayaStone,
    todayLabel: 'Today: Detroit travel',
    readinessPct: 69,
    risks: 2,
    tasksDue: 5,
    daysToShow: 2,
  },
]
