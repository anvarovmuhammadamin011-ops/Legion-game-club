'use client'

import { useApp } from '@/context/app-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AuthBrand } from '@/components/auth-brand'
import { Notifications } from '@/components/notifications'
import { Button, Input } from '@/components/ui/primitives'
import { Gamepad2, Eye, EyeOff } from 'lucide-react'
import type { Role } from '@/lib/types'

const DEMO: { label: string; phone: string; password: string }[] = [
  { label: 'Foydalanuvchi', phone: '+998901234567', password: 'user123' },
  { label: 'Admin', phone: '+998901111111', password: 'admin123' },
  { label: 'Super Admin', phone: '+998900000000', password: 'super123' },
]

const dest: Record<Role, string> = {
  user: '/home',
  admin: '/admin',
  superadmin: '/superadmin',
}

export default function LoginPage() {
  const { login, currentUser, hydrated, t } = useApp()
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (hydrated && currentUser) router.replace(dest[currentUser.role])
  }, [hydrated, currentUser, router])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const res = login(phone, password)
    if (res.success && res.role) router.replace(dest[res.role])
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <Notifications />
      <AuthBrand />

      <div className="flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Gamepad2 className="h-5 w-5" />
            </span>
            <span className="font-heading text-lg font-bold">Prime Club</span>
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Tizimga kirish
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hisobingizga kirib o'rningizni bron qiling
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="phone">
                {t('phone')}
              </label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                inputMode="tel"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="password">
                {t('password')}
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle password"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              {t('login')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Hisobingiz yo'qmi?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              {t('register')}
            </Link>
          </p>

          <div className="mt-8 rounded-xl border border-border bg-card p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Demo hisoblar
            </p>
            <div className="flex flex-col gap-2">
              {DEMO.map((d) => (
                <button
                  key={d.phone}
                  onClick={() => {
                    setPhone(d.phone)
                    setPassword(d.password)
                  }}
                  className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                >
                  <span className="font-medium">{d.label}</span>
                  <span className="text-mono-num text-xs text-muted-foreground">
                    {d.phone}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
