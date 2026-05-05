// src/data/format.ts — shared formatters (used by widgets and reusable later by other sections)
//
// Note on timezone: formatTimeFromIso intentionally uses the browser's local
// timezone for now (matches the wireframe mock where all times are shown as
// wall-clock). When real data arrives, the renderer will need to pass a
// timeZone option (or convert in the data layer) so that show times always
// display in the show city's local time regardless of viewer location.

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

const relDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const relTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

export function formatRelativeDateTime(iso: string): string {
  const d = new Date(iso)
  return `${relDate.format(d)} · ${relTime.format(d)}`
}
