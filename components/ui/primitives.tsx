'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

/* ---------- Card ---------- */
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card text-card-foreground',
        className,
      )}
      {...props}
    />
  )
}

/* ---------- Button ---------- */
type ButtonVariant = 'primary' | 'gold' | 'ghost' | 'outline' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:opacity-90 active:opacity-100',
  gold: 'bg-gold text-[oklch(0.2_0.02_85)] hover:opacity-90',
  ghost: 'bg-transparent text-foreground hover:bg-secondary',
  outline:
    'border border-border bg-transparent text-foreground hover:bg-secondary',
  danger: 'bg-destructive text-destructive-foreground hover:opacity-90',
  success: 'bg-success text-success-foreground hover:opacity-90',
}

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10',
}

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
  }
>(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    />
  )
})
Button.displayName = 'Button'

/* ---------- Input ---------- */
export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30 transition-colors',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'

/* ---------- Badge ---------- */
type BadgeTone = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'gold' | 'info'
const badgeTones: Record<BadgeTone, string> = {
  default: 'bg-secondary text-secondary-foreground',
  primary: 'bg-accent text-accent-foreground',
  success: 'bg-success/15 text-success',
  danger: 'bg-destructive/15 text-destructive',
  warning: 'bg-warning/20 text-warning',
  gold: 'bg-gold/20 text-gold',
  info: 'bg-info/15 text-info',
}

export function Badge({
  tone = 'default',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        badgeTones[tone],
        className,
      )}
      {...props}
    />
  )
}

/* ---------- Page header ---------- */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

/* ---------- Stat card ---------- */
export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = 'primary',
}: {
  label: string
  value: string
  hint?: string
  icon?: React.ReactNode
  tone?: BadgeTone
}) {
  const toneBg: Record<string, string> = {
    primary: 'bg-accent text-accent-foreground',
    success: 'bg-success/15 text-success',
    danger: 'bg-destructive/15 text-destructive',
    warning: 'bg-warning/20 text-warning',
    gold: 'bg-gold/20 text-gold',
    info: 'bg-info/15 text-info',
    default: 'bg-secondary text-secondary-foreground',
  }
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold text-mono-num">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {icon && (
          <div
            className={cn(
              'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg',
              toneBg[tone],
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
