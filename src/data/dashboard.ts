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
