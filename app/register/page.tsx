'use client'

import { useApp } from '@/context/app-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AuthBrand } from '@/components/auth-brand'
import { Notifications } from '@/components/notifications'
import { Button, Input } from '@/components/ui/primitives'
import { Gamepad2, Gift } from 'lucide-react'

export default function RegisterPage() {
  const { register, currentUser, hydrated, t } = useApp()
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (hydrated && currentUser) router.replace('/home')
  }, [hydrated, currentUser, router])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (register(name, phone, password)) router.replace('/home')
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
            {t('register')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Yangi hisob yarating va o'yinni boshlang
          </p>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-gold/30 bg-gold/10 p-3">
            <Gift className="h-5 w-5 flex-shrink-0 text-gold" />
            <p className="text-sm text-foreground">
              Ro'yxatdan o'tganingiz uchun{' '}
              <span className="font-semibold">20,000 so'm</span> sovg'a balans
            </p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="name">
                {t('name')}
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ism Familiya"
                required
              />
            </div>
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              {t('register')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Hisobingiz bormi?{' '}
            <Link href="/" className="font-medium text-primary hover:underline">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
