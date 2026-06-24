import type { ComputerStatus, ComputerType } from './types'

export const STATUS_META: Record<
  ComputerStatus,
  { labelKey: string; tone: 'success' | 'danger' | 'warning' | 'info'; dot: string }
> = {
  available: { labelKey: 'available', tone: 'success', dot: 'bg-success' },
  booked: { labelKey: 'booked', tone: 'danger', dot: 'bg-destructive' },
  maintenance: { labelKey: 'maintenance', tone: 'warning', dot: 'bg-warning' },
  pending: { labelKey: 'pending', tone: 'info', dot: 'bg-info' },
}

export const TYPE_COLOR: Record<ComputerType, string> = {
  VIP: 'text-gold',
  GAMING_PRO: 'text-primary',
  STANDARD: 'text-info',
  PS5: 'text-success',
}
