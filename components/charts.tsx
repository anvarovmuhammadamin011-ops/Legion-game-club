'use client'

import { Card } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

/* ---------- Bar chart (vertical) ---------- */
export function BarChart({
  data,
  title,
  unit = '',
}: {
  data: { label: string; value: number; secondary?: number }[]
  title?: string
  unit?: string
}) {
  const max = Math.max(...data.map((d) => Math.max(d.value, d.secondary ?? 0)), 1)
  return (
    <Card className="p-5">
      {title && <h3 className="mb-4 font-medium">{title}</h3>}
      <div className="flex h-48 items-end justify-between gap-2 sm:gap-3">
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end justify-center gap-1">
              <div
                className="w-full max-w-8 rounded-t bg-primary transition-all"
                style={{ height: `${(d.value / max) * 100}%` }}
                title={`${d.value}${unit}`}
              />
              {d.secondary !== undefined && (
                <div
                  className="w-full max-w-8 rounded-t bg-border transition-all"
                  style={{ height: `${(d.secondary / max) * 100}%` }}
                  title={`${d.secondary}${unit}`}
                />
              )}
            </div>
            <span className="text-xs text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* ---------- Horizontal load bars ---------- */
export function LoadBars({
  data,
  title,
}: {
  data: { label: string; value: number }[]
  title?: string
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <Card className="p-5">
      {title && <h3 className="mb-4 font-medium">{title}</h3>}
      <div className="flex flex-col gap-3">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="w-12 text-xs text-muted-foreground text-mono-num">
              {d.label}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  'h-full rounded-full',
                  d.value > 85 ? 'bg-destructive' : d.value > 60 ? 'bg-warning' : 'bg-primary',
                )}
                style={{ width: `${(d.value / max) * 100}%` }}
              />
            </div>
            <span className="w-9 text-right text-xs font-medium text-mono-num">
              {d.value}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* ---------- Donut (single ring) ---------- */
export function DonutStat({
  value,
  max,
  label,
  sublabel,
}: {
  value: number
  max: number
  label: string
  sublabel?: string
}) {
  const pct = Math.round((value / max) * 100)
  return (
    <Card className="flex flex-col items-center justify-center p-5">
      <div
        className="relative flex h-32 w-32 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(var(--color-primary) ${pct * 3.6}deg, var(--color-secondary) 0deg)`,
        }}
      >
        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-card">
          <span className="text-2xl font-bold text-mono-num">{pct}%</span>
        </div>
      </div>
      <p className="mt-3 font-medium">{label}</p>
      {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
    </Card>
  )
}
