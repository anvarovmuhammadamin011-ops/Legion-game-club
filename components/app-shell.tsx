'use client'

import { useApp } from '@/context/app-context'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Role, Lang } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Notifications } from '@/components/notifications'
import { Badge } from '@/components/ui/primitives'
import { formatSom } from '@/lib/format'
import {
  Home,
  Map,
  CalendarPlus,
  User as UserIcon,
  LayoutDashboard,
  MonitorSmartphone,
  Coffee,
  ClipboardCheck,
  Wallet,
  Users,
  Tag,
  DollarSign,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Gamepad2,
  Languages,
} from 'lucide-react'

interface NavItem {
  href: string
  labelKey: string
  icon: React.ComponentType<{ className?: string }>
  badge?: boolean
}

const NAV: Record<Role, NavItem[]> = {
  user: [
    { href: '/home', labelKey: 'home', icon: Home },
    { href: '/map', labelKey: 'map', icon: Map },
    { href: '/book', labelKey: 'book', icon: CalendarPlus },
    { href: '/profile', labelKey: 'profile', icon: UserIcon },
  ],
  admin: [
    { href: '/admin', labelKey: 'dashboard', icon: LayoutDashboard },
    { href: '/admin/computers', labelKey: 'computers', icon: MonitorSmartphone },
    { href: '/admin/bar', labelKey: 'bar', icon: Coffee },
    { href: '/admin/bookings', labelKey: 'bookings', icon: ClipboardCheck, badge: true },
  ],
  superadmin: [
    { href: '/superadmin', labelKey: 'dashboard', icon: LayoutDashboard },
    { href: '/superadmin/finance', labelKey: 'finance', icon: Wallet },
    { href: '/superadmin/staff', labelKey: 'staff', icon: Users },
    { href: '/superadmin/promotions', labelKey: 'promotions', icon: Tag },
    { href: '/superadmin/pricing', labelKey: 'pricing', icon: DollarSign },
  ],
}

const LANGS: Lang[] = ['uz', 'ru', 'en']

export function AppShell({
  children,
  role,
}: {
  children: React.ReactNode
  role: Role
}) {
  const {
    currentUser,
    hydrated,
    logout,
    t,
    theme,
    toggleTheme,
    language,
    setLanguage,
    pendingCount,
  } = useApp()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (hydrated && (!currentUser || currentUser.role !== role)) {
      router.replace('/')
    }
  }, [hydrated, currentUser, role, router])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  if (!hydrated || !currentUser || currentUser.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        <Gamepad2 className="h-6 w-6 animate-pulse text-primary" />
      </div>
    )
  }

  const items = NAV[role]

  const cycleLang = () => {
    const idx = LANGS.indexOf(language)
    setLanguage(LANGS[(idx + 1) % LANGS.length])
  }

  return (
    <div className="min-h-screen">
      <Notifications />

      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-secondary lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href={items[0].href} className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Gamepad2 className="h-5 w-5" />
              </span>
              <span className="font-heading text-lg font-bold tracking-tight">
                Prime Club
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== items[0].href && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(item.labelKey)}
                  {item.badge && pendingCount > 0 && (
                    <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-semibold text-destructive-foreground">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            {role === 'user' && (
              <div className="hidden items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 sm:flex">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-mono-num text-sm font-semibold">
                  {formatSom(currentUser.balance)}
                </span>
              </div>
            )}
            <button
              onClick={cycleLang}
              className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Language"
            >
              <Languages className="h-4 w-4" />
              <span className="uppercase">{language}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => {
                logout()
                router.replace('/')
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <nav className="border-t border-border bg-background px-4 py-3 lg:hidden">
            {role === 'user' && (
              <div className="mb-3 flex items-center justify-between rounded-lg bg-secondary px-3 py-2 sm:hidden">
                <span className="text-sm text-muted-foreground">{t('balance')}</span>
                <span className="text-mono-num text-sm font-semibold">
                  {formatSom(currentUser.balance)} {t('som')}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              {items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== items[0].href && pathname.startsWith(item.href))
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                      active
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-secondary',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t(item.labelKey)}
                    {item.badge && pendingCount > 0 && (
                      <Badge tone="danger" className="ml-auto">
                        {pendingCount}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}
