import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/services/adminApi'
import { Button } from '@/components/ui/Button'

const FIELDS: { key: string; label: string; hint?: string; area?: boolean }[] = [
  { key: 'free_delivery_threshold', label: 'Порог бесплатной доставки, ₽' },
  { key: 'delivery_cost', label: 'Стоимость доставки, ₽' },
  { key: 'telegram_chat_id', label: 'Telegram chat_id (куда падают заказы)' },
  { key: 'telegram_proxies', label: 'Прокси/VPN для Telegram', hint: 'по одному в строке; host:port = socks5', area: true },
]
const input = 'w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-brand-300 focus:outline-none'

export function AdminSettings() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['admin-settings'], queryFn: () => adminApi.getSettings() })
  const [values, setValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState('')

  useEffect(() => { if (data) setValues(data) }, [data])

  const save = useMutation({
    mutationFn: (key: string) => adminApi.setSetting(key, values[key] ?? ''),
    onSuccess: (_r, key) => { setSaved(key); qc.invalidateQueries({ queryKey: ['admin-settings'] }); setTimeout(() => setSaved(''), 1500) },
  })

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold">Настройки</h1>
      <div className="mt-5 space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key} className="rounded-card bg-card p-4 ring-1 ring-line/60">
            <label className="mb-1 block text-sm font-medium">{f.label}</label>
            {f.hint && <p className="mb-1 text-xs text-ink-muted">{f.hint}</p>}
            <div className="flex gap-2">
              {f.area ? (
                <textarea rows={3} className={input} value={values[f.key] ?? ''} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />
              ) : (
                <input className={input} value={values[f.key] ?? ''} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />
              )}
              <Button size="sm" onClick={() => save.mutate(f.key)} disabled={save.isPending}>{saved === f.key ? '✓' : 'Сохранить'}</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
