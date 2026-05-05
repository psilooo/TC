// src/data/severity.ts — severity tokens shared across sections (Issues here, future Tasks/Alerts elsewhere)
import type { Severity } from './types'

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
