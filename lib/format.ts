export function formatSom(value: number): string {
  return new Intl.NumberFormat('uz-UZ').format(Math.round(value))
}

export function formatMillions(value: number): string {
  return new Intl.NumberFormat('uz-UZ').format(value)
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function nowStamp(): string {
  return new Date().toISOString().slice(0, 16).replace('T', ' ')
}
