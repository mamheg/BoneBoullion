import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/services/adminApi'
import { Button } from '@/components/ui/Button'

const input = 'h-10 rounded-lg border border-line bg-white px-3 text-sm focus:border-brand-300 focus:outline-none'

export function AdminSlots() {
  const qc = useQueryClient()
  const { data: slots = [] } = useQuery({ queryKey: ['admin-slots'], queryFn: () => adminApi.listSlots() })
  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-slots'] })
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().slice(0, 10))
  const [days, setDays] = useState(7)
  const [windows, setWindows] = useState('10:00-13:00, 13:00-16:00')
  const [capacity, setCapacity] = useState(10)

  const gen = useMutation({
    mutationFn: () => adminApi.generateSlots({ dateFrom, days: Number(days), windows: windows.split(',').map((w) => w.trim()).filter(Boolean), capacity: Number(capacity) }),
    onSuccess: refresh,
  })
  const toggle = useMutation({ mutationFn: ({ id, active }: { id: number; active: boolean }) => adminApi.toggleSlot(id, active), onSuccess: refresh })
  const submit = (e: FormEvent) => { e.preventDefault(); gen.mutate() }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Слоты доставки</h1>

      <form onSubmit={submit} className="mt-5 grid grid-cols-2 gap-3 rounded-card bg-card p-4 ring-1 ring-line/60 sm:grid-cols-4">
        <div><label className="mb-1 block text-xs text-ink-muted">С даты</label><input type="date" className={`${input} w-full`} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} /></div>
        <div><label className="mb-1 block text-xs text-ink-muted">Дней</label><input type="number" className={`${input} w-full`} value={days} onChange={(e) => setDays(Number(e.target.value))} /></div>
        <div className="col-span-2"><label className="mb-1 block text-xs text-ink-muted">Окна (через запятую)</label><input className={`${input} w-full`} value={windows} onChange={(e) => setWindows(e.target.value)} /></div>
        <div><label className="mb-1 block text-xs text-ink-muted">Ёмкость</label><input type="number" className={`${input} w-full`} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} /></div>
        <div className="flex items-end"><Button type="submit" disabled={gen.isPending}>Сгенерировать</Button></div>
      </form>
      {gen.data && <p className="mt-2 text-sm text-success">Создано слотов: {gen.data.created}</p>}

      <div className="mt-5 overflow-hidden rounded-card bg-card ring-1 ring-line/60">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs text-ink-muted"><tr><th className="px-4 py-2.5">Дата</th><th className="px-4 py-2.5">Окно</th><th className="px-4 py-2.5">Занято</th><th className="px-4 py-2.5">Активен</th></tr></thead>
          <tbody className="divide-y divide-line">
            {slots.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-2.5">{s.date}</td>
                <td className="px-4 py-2.5">{s.start}–{s.end}</td>
                <td className="px-4 py-2.5 tnum">{s.booked}/{s.capacity}</td>
                <td className="px-4 py-2.5"><input type="checkbox" checked={s.isActive} onChange={(e) => toggle.mutate({ id: s.id, active: e.target.checked })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
