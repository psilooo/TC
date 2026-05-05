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
