'use client'

import { useApp } from '@/context/app-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AuthBrand } from '@/components/auth-brand'
import { Notifications } from '@/components/notifications'
import { Button, Input } from '@/components/ui/primitives'
import { Gamepad2, Smartphone } from 'lucide-react'

export default function RegisterPage() {
  const { register, currentUser, hydrated, t } = useApp()
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  useEffect(() => { if (hydrated && currentUser) router.replace('/home') }, [hydrated, currentUser, router])
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sent) { setSent(true); return }
    if (code !== '1234') return
    if (register(name, phone, 'phone-auth')) router.replace('/home')
  }
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <Notifications /><AuthBrand />
      <div className="flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Gamepad2 className="h-5 w-5" /></span><span className="font-heading text-lg font-bold">Legion Game Club</span></div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">{t('register')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Telefon raqamingiz bilan tez ro'yxatdan o'ting</p>
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 p-3"><Smartphone className="h-5 w-5 flex-shrink-0 text-primary" /><p className="text-sm">{sent ? 'Tasdiqlash kodi: 1234 (demo)' : 'Telefon raqamingizga tasdiqlash kodi yuboriladi.'}</p></div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {!sent ? <><div className="space-y-1.5"><label className="text-sm font-medium" htmlFor="phone">{t('phone')}</label><Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" inputMode="tel" required /></div><div className="space-y-1.5"><label className="text-sm font-medium" htmlFor="name">Ism Familiya</label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ism Familiya" required /></div></> : <div className="space-y-1.5"><label className="text-sm font-medium" htmlFor="code">Tasdiqlash kodi</label><Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="1234" inputMode="numeric" maxLength={4} required /></div>}
            <Button type="submit" size="lg" className="w-full">{sent ? 'Ro\'yxatdan o\'tishni yakunlash' : 'Kod yuborish'}</Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">Hisobingiz bormi? <Link href="/" className="font-medium text-primary hover:underline">{t('login')}</Link></p>
        </div>
      </div>
    </div>
  )
}
