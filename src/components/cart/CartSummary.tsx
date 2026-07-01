import { formatPrice } from '@/brand/config'

export function CartSummary({
  itemsTotal,
  deliveryCost,
  total,
}: {
  itemsTotal: number
  deliveryCost: number
  total: number
}) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-ink-muted">Товары</dt>
        <dd className="font-medium tnum">{formatPrice(itemsTotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink-muted">Доставка</dt>
        <dd className="font-medium tnum">
          {deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}
        </dd>
      </div>
      <div className="flex justify-between border-t border-line pt-2.5 text-base">
        <dt className="font-display font-bold">Итого</dt>
        <dd className="font-sans text-lg font-extrabold text-ink tnum">
          {formatPrice(total)}
        </dd>
      </div>
    </dl>
  )
}
