import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { adminApi } from '@/services/adminApi'
import { formatPrice } from '@/brand/config'
import { Button } from '@/components/ui/Button'

const STATUSES = ['new', 'preparing', 'ready', 'delivered', 'cancelled']
const STATUS_RU: Record<string, string> = { new: 'Новый', preparing: 'Готовится', ready: 'Готов', delivered: 'Выдан', cancelled: 'Отменён' }

export function AdminOrders() {
  const qc = useQueryClient()
  const [filter, setFilter] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const { data: orders = [], isLoading } = useQuery({ queryKey: ['admin-orders', filter], queryFn: () => adminApi.listOrders(filter || undefined) })

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Заказы</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setFilter('')} className={`rounded-full px-3 py-1 text-sm ring-1 ${!filter ? 'bg-brand-600 text-white ring-brand-600' : 'ring-line'}`}>Все</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3 py-1 text-sm ring-1 ${filter === s ? 'bg-brand-600 text-white ring-brand-600' : 'ring-line'}`}>{STATUS_RU[s]}</button>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-card bg-card ring-1 ring-line/60">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs text-ink-muted">
            <tr><th className="px-4 py-2.5">№</th><th className="px-4 py-2.5">Клиент</th><th className="px-4 py-2.5">Сумма</th><th className="px-4 py-2.5">Статус</th><th className="px-4 py-2.5">TG</th><th className="px-4 py-2.5">Дата</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {isLoading && <tr><td className="px-4 py-4 text-ink-muted" colSpan={6}>Загрузка…</td></tr>}
            {!isLoading && orders.length === 0 && <tr><td className="px-4 py-4 text-ink-muted" colSpan={6}>Заказов нет</td></tr>}
            {orders.map((o) => (
              <tr key={o.id} className="cursor-pointer hover:bg-surface-2" onClick={() => setOpenId(o.id)}>
                <td className="px-4 py-3 font-medium">{o.id}</td>
                <td className="px-4 py-3">{o.customerName}<span className="ml-2 text-xs text-ink-muted">{o.phone}</span></td>
                <td className="px-4 py-3 tnum">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">{STATUS_RU[o.status] ?? o.status}</td>
                <td className="px-4 py-3">{o.tgDelivered ? '✅' : '⚠️'}</td>
                <td className="px-4 py-3 text-xs text-ink-muted">{o.createdAt ? new Date(o.createdAt).toLocaleString('ru-RU') : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openId && <OrderModal id={openId} onClose={() => setOpenId(null)} onChanged={() => qc.invalidateQueries({ queryKey: ['admin-orders'] })} />}
    </div>
  )
}

function OrderModal({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const { data } = useQuery({ queryKey: ['admin-order', id], queryFn: () => adminApi.getOrder(id) })
  const setStatus = useMutation({ mutationFn: (s: string) => adminApi.setOrderStatus(id, s), onSuccess: onChanged })
  const d = data as Record<string, any> | undefined

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-md rounded-card-lg bg-card p-6 shadow-pop">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Заказ {id}</h2>
          <button onClick={onClose}><X className="size-5 text-ink-muted" /></button>
        </div>
        {!d ? <p className="mt-4 text-ink-muted">Загрузка…</p> : (
          <div className="mt-4 space-y-2 text-sm">
            <p><b>{d.customerName}</b> · {d.phone}{d.email ? ` · ${d.email}` : ''}</p>
            <p className="text-ink-muted">{d.deliveryMethod === 'courier' ? 'Курьер' : 'Самовывоз'}{d.address ? `, ${d.address}` : ''}</p>
            {d.slot && <p className="text-ink-muted">🕒 {d.slot.date} {d.slot.start}–{d.slot.end}</p>}
            {d.comment && <p className="text-ink-muted">💬 {d.comment}</p>}
            <ul className="mt-2 divide-y divide-line rounded-lg bg-surface-2 px-3">
              {(d.items ?? []).map((i: any, n: number) => (
                <li key={n} className="flex justify-between py-2"><span>{i.title} × {i.quantity}</span><span className="tnum">{formatPrice(i.price * i.quantity)}</span></li>
              ))}
            </ul>
            <p className="pt-1 text-right font-display text-lg font-bold tnum">{formatPrice(d.total)}</p>
            <div className="pt-2">
              <label className="mb-1 block text-xs font-medium text-ink-muted">Статус</label>
              <select className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm" value={d.status} onChange={(e) => setStatus.mutate(e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_RU[s]}</option>)}
              </select>
            </div>
          </div>
        )}
        <div className="mt-5 flex justify-end"><Button variant="secondary" onClick={onClose}>Закрыть</Button></div>
      </div>
    </div>
  )
}
