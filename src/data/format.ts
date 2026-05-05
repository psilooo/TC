// src/data/format.ts — shared formatters (used by widgets and reusable later by other sections)

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const shortDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

const longDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
})

const time12 = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

export function formatUsd(amount: number): string {
  return usd.format(amount)
}

export function formatShortDate(iso: string): string {
  // iso is yyyy-mm-dd; force UTC parse to avoid TZ drift on day boundary
  const [y, m, d] = iso.split('-').map(Number)
  return shortDate.format(new Date(Date.UTC(y, m - 1, d)))
}

export function formatLongDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return longDate.format(new Date(Date.UTC(y, m - 1, d)))
}

export function formatTimeFromIso(iso: string): string {
  return time12.format(new Date(iso))
}
