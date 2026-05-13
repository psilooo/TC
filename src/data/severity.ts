// src/data/severity.ts — severity tokens shared across sections (Issues here, future Tasks/Alerts elsewhere)
import type { Severity, ArtistDayStatus, ArtistTrack, ActionStatus, TravelWatchTag, TimelineKind } from './types'

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

export const vaBadgeTokens: Record<ArtistDayStatus | ArtistTrack | ActionStatus | TravelWatchTag, VaColor> = {
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
