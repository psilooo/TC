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
