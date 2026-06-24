'use client'

import { useApp } from '@/context/app-context'
import { Card, PageHeader, Button, Badge } from '@/components/ui/primitives'
import { COMPUTER_TYPES } from '@/lib/mock-data'
import { STATUS_META } from '@/lib/status'
import { useState } from 'react'
import {
  Power,
  PowerOff,
  Wrench,
  Thermometer,
  Clock,
  Layers,
} from 'lucide-react'

const ZONES = ['VIP', 'Gaming Pro', 'Standard', 'Console']

export default function ComputersPage() {
  const {
    t,
    computers,
    powerComputer,
    setMaintenanceMode,
    runGroupAction,
  } = useApp()
  const [zoneFilter, setZoneFilter] = useState<string>('all')

  const filtered =
    zoneFilter === 'all'
      ? computers
      : computers.filter((c) => c.zone === zoneFilter)

  return (
    <div>
      <PageHeader
        title={t('computerManagement')}
        subtitle={t('remoteControl')}
      />

      {/* Group actions */}
      <Card className="mb-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Layers className="h-4 w-4 text-primary" />
            {t('groupActions')}
          </div>
          <div className="flex flex-wrap gap-2">
            {ZONES.map((z) => (
              <div key={z} className="flex items-center gap-1 rounded-lg bg-secondary p-1">
                <span className="px-2 text-xs font-medium">{z}</span>
                <button
                  onClick={() => runGroupAction(z, 'on')}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-success hover:bg-success/15"
                  aria-label={`Power on ${z}`}
                >
                  <Power className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => runGroupAction(z, 'off')}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-destructive hover:bg-destructive/15"
                  aria-label={`Power off ${z}`}
                >
                  <PowerOff className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Zone filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {['all', ...ZONES].map((z) => (
          <button
            key={z}
            onClick={() => setZoneFilter(z)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              zoneFilter === z
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {z === 'all' ? t('all') : z}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const meta = STATUS_META[c.status]
          const info = COMPUTER_TYPES[c.type]
          return (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-mono-num font-semibold">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{info.name}</p>
                </div>
                <Badge tone={meta.tone}>
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                  {t(meta.labelKey)}
                </Badge>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Thermometer className={`h-3.5 w-3.5 ${c.temp > 60 ? 'text-destructive' : ''}`} />
                  <span className="text-mono-num">{c.temp}°C</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-mono-num">{c.uptimeHours}h</span>
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => powerComputer(c.id, 'on')}
                >
                  <Power className="h-4 w-4" />
                  {t('on')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => powerComputer(c.id, 'off')}
                >
                  <PowerOff className="h-4 w-4" />
                  {t('off')}
                </Button>
                <Button
                  variant={c.status === 'maintenance' ? 'danger' : 'ghost'}
                  size="icon"
                  onClick={() =>
                    setMaintenanceMode(c.id, c.status !== 'maintenance')
                  }
                  aria-label="Maintenance"
                >
                  <Wrench className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
