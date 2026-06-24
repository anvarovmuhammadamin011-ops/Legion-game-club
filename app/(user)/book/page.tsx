'use client'

import { useApp } from '@/context/app-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useMemo, useState } from 'react'
import { Card, Button, Badge, PageHeader } from '@/components/ui/primitives'
import { COMPUTER_TYPES, EXTRAS } from '@/lib/mock-data'
import { formatSom } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Check, Cpu, Wallet, CreditCard, Star } from 'lucide-react'

const HOURS = [1, 2, 3, 4, 5, 6, 8, 12]
const TIMES = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
const PAYMENTS = [
  { id: 'balance', label: 'Balans', icon: Wallet },
  { id: 'click', label: 'Click', icon: CreditCard },
  { id: 'payme', label: 'Payme', icon: CreditCard },
  { id: 'uzcard', label: 'Uzcard', icon: CreditCard },
]

const STEPS = ['Vaqt tanlash', "Qo'shimcha xizmatlar", "To'lov"]

function BookingWizard() {
  const { computers, currentUser, createBooking, redeemBonusPoints, t } = useApp()
  const router = useRouter()
  const params = useSearchParams()
  const presetPc = params.get('pc')

  const [step, setStep] = useState(0)
  const [pcId, setPcId] = useState(presetPc ?? '')
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [time, setTime] = useState('18:00')
  const [hours, setHours] = useState(2)
  const [extras, setExtras] = useState<string[]>([])
  const [payment, setPayment] = useState('balance')
  const [useBonus, setUseBonus] = useState(false)

  const availablePcs = useMemo(
    () => computers.filter((c) => c.status === 'available'),
    [computers],
  )
  const selectedPc = computers.find((c) => c.id === pcId)

  const baseCost = selectedPc
    ? COMPUTER_TYPES[selectedPc.type].pricePerHour * hours
    : 0
  const extrasCost = extras.reduce(
    (sum, id) => sum + (EXTRAS.find((e) => e.id === id)?.price ?? 0),
    0,
  )
  const bonusBlocks = currentUser ? Math.floor(currentUser.bonusPoints / 100) : 0
  const bonusDiscount = useBonus ? bonusBlocks * 15000 : 0
  const total = Math.max(0, baseCost + extrasCost - bonusDiscount)

  const toggleExtra = (id: string) =>
    setExtras((s) => (s.includes(id) ? s.filter((e) => e !== id) : [...s, id]))

  const confirm = () => {
    if (!selectedPc) return
    const ok = createBooking({
      computerId: selectedPc.id,
      computerLabel: selectedPc.label,
      date,
      startTime: time,
      hours,
      extras,
      total,
      paymentMethod: payment,
    })
    if (ok) {
      if (useBonus) redeemBonusPoints()
      router.push('/home')
    }
  }

  const canNext = step === 0 ? !!pcId : true

  return (
    <div className="space-y-6">
      <PageHeader title="Bron qilish" subtitle="3 bosqichda o'rningizni band qiling" />

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                  i < step
                    ? 'bg-success text-success-foreground'
                    : i === step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground',
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  'hidden text-sm font-medium sm:block',
                  i === step ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={cn(
                  'h-px flex-1',
                  i < step ? 'bg-success' : 'bg-border',
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Step 1 */}
          {step === 0 && (
            <>
              <Card className="p-5">
                <h3 className="mb-4 font-medium">Kompyuter tanlang</h3>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {availablePcs.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setPcId(c.id)}
                      className={cn(
                        'flex flex-col items-start rounded-lg border p-3 text-left transition-colors',
                        pcId === c.id
                          ? 'border-primary bg-accent'
                          : 'border-border hover:bg-secondary',
                      )}
                    >
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <span className="mt-1.5 text-mono-num text-sm font-medium">
                        {c.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {COMPUTER_TYPES[c.type].name}
                      </span>
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="mb-4 font-medium">Sana</h3>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
                <h3 className="mb-3 mt-5 font-medium">Boshlanish vaqti</h3>
                <div className="flex flex-wrap gap-2">
                  {TIMES.map((tm) => (
                    <button
                      key={tm}
                      onClick={() => setTime(tm)}
                      className={cn(
                        'text-mono-num rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                        time === tm
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:bg-secondary',
                      )}
                    >
                      {tm}
                    </button>
                  ))}
                </div>
                <h3 className="mb-3 mt-5 font-medium">Soat soni</h3>
                <div className="flex flex-wrap gap-2">
                  {HOURS.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHours(h)}
                      className={cn(
                        'text-mono-num h-10 w-12 rounded-lg border text-sm font-medium transition-colors',
                        hours === h
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:bg-secondary',
                      )}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <Card className="p-5">
              <h3 className="mb-4 font-medium">Qo'shimcha xizmatlar</h3>
              <div className="space-y-3">
                {EXTRAS.map((ex) => {
                  const active = extras.includes(ex.id)
                  return (
                    <button
                      key={ex.id}
                      onClick={() => toggleExtra(ex.id)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors',
                        active
                          ? 'border-primary bg-accent'
                          : 'border-border hover:bg-secondary',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-md border',
                            active
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border',
                          )}
                        >
                          {active && <Check className="h-4 w-4" />}
                        </span>
                        <span className="font-medium">{ex.name}</span>
                      </div>
                      <span className="text-mono-num text-sm font-medium">
                        +{formatSom(ex.price)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </Card>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <>
              <Card className="p-5">
                <h3 className="mb-4 font-medium">To'lov usuli</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {PAYMENTS.map((p) => {
                    const Icon = p.icon
                    const active = payment === p.id
                    const disabled =
                      p.id === 'balance' &&
                      currentUser !== null &&
                      currentUser.balance < total
                    return (
                      <button
                        key={p.id}
                        disabled={disabled}
                        onClick={() => setPayment(p.id)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg border p-4 transition-colors disabled:opacity-40',
                          active
                            ? 'border-primary bg-accent'
                            : 'border-border hover:bg-secondary',
                        )}
                      >
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{p.label}</span>
                      </button>
                    )
                  })}
                </div>
                {payment === 'balance' && currentUser && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Mavjud balans:{' '}
                    <span className="text-mono-num font-medium text-foreground">
                      {formatSom(currentUser.balance)} {t('som')}
                    </span>
                  </p>
                )}
              </Card>

              {bonusBlocks > 0 && (
                <Card className="p-5">
                  <button
                    onClick={() => setUseBonus((s) => !s)}
                    className="flex w-full items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/20 text-gold">
                        <Star className="h-5 w-5" />
                      </span>
                      <div className="text-left">
                        <p className="font-medium">Bonus chegirma</p>
                        <p className="text-sm text-muted-foreground">
                          {bonusBlocks * 100} ball = {formatSom(bonusBlocks * 15000)}{' '}
                          {t('som')}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'flex h-6 w-11 items-center rounded-full p-0.5 transition-colors',
                        useBonus ? 'bg-primary' : 'bg-secondary',
                      )}
                    >
                      <span
                        className={cn(
                          'h-5 w-5 rounded-full bg-card transition-transform',
                          useBonus && 'translate-x-5',
                        )}
                      />
                    </span>
                  </button>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5">
            <h3 className="mb-4 font-heading font-semibold">Buyurtma xulosasi</h3>
            {selectedPc ? (
              <div className="space-y-2.5 text-sm">
                <Row label="Kompyuter" value={selectedPc.label} mono />
                <Row label="Tur" value={COMPUTER_TYPES[selectedPc.type].name} />
                <Row label="Sana" value={date} mono />
                <Row label="Vaqt" value={`${time} · ${hours} soat`} mono />
                <div className="my-3 h-px bg-border" />
                <Row label="Asosiy" value={`${formatSom(baseCost)}`} mono />
                {extrasCost > 0 && (
                  <Row label="Xizmatlar" value={`+${formatSom(extrasCost)}`} mono />
                )}
                {bonusDiscount > 0 && (
                  <Row
                    label="Bonus"
                    value={`-${formatSom(bonusDiscount)}`}
                    mono
                    accent="text-success"
                  />
                )}
                <div className="my-3 h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t('total')}</span>
                  <span className="text-mono-num text-xl font-bold text-primary">
                    {formatSom(total)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Avval kompyuter tanlang
              </p>
            )}

            <div className="mt-5 flex gap-2">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                  Orqaga
                </Button>
              )}
              {step < 2 ? (
                <Button
                  className="flex-1"
                  disabled={!canNext}
                  onClick={() => setStep((s) => s + 1)}
                >
                  Davom etish
                </Button>
              ) : (
                <Button className="flex-1" onClick={confirm}>
                  {t('confirm')}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  mono,
  accent,
}: {
  label: string
  value: string
  mono?: boolean
  accent?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-medium', mono && 'text-mono-num', accent)}>
        {value}
      </span>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={null}>
      <BookingWizard />
    </Suspense>
  )
}
