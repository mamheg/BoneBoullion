import { formatPrice } from '@/brand/config'
import { BRAND } from '@/brand/config'

export function FreeDeliveryBar({
  itemsTotal,
  remainingForFree,
}: {
  itemsTotal: number
  remainingForFree: number
}) {
  const pct = Math.min(100, (itemsTotal / BRAND.freeDeliveryThreshold) * 100)
  const done = remainingForFree <= 0

  return (
    <div className="rounded-xl bg-surface-2 p-3">
      <p className="text-sm text-ink">
        {done ? (
          <>🎉 Доставка <span className="font-bold text-success">бесплатно</span>!</>
        ) : (
          <>
            До бесплатной доставки{' '}
            <span className="font-bold text-brand-700">{formatPrice(remainingForFree)}</span>
          </>
        )}
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
