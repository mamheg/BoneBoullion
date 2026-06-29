import { BRAND, formatPrice } from '@/brand/config'

export function AnnouncementBar() {
  return (
    <div className="bg-brand-400 text-center text-ink">
      <p className="px-4 py-2 text-sm font-semibold">
        Бесплатная доставка от {formatPrice(BRAND.freeDeliveryThreshold)} 🥬
      </p>
    </div>
  )
}
