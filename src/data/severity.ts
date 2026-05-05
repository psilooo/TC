// src/data/severity.ts — severity tokens shared across sections (Issues here, future Tasks/Alerts elsewhere)
import type { Severity } from './types'

export const severityTokens: Record<Severity, { bg: string; text: string; dot: string }> = {
  High: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  Medium: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  Low: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' },
}
