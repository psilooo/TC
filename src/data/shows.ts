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
  schedule: todayTimeline,
  contacts: quickContacts,
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
