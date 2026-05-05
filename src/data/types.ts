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
  at: string // ISO datetime, naive (no offset). Treated as wall-clock time local to the show city; renderer must apply the correct timeZone when real data arrives.
  authorInitials: string
}

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
