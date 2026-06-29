import type { Badge as BadgeType } from '@/types'

const LABELS: Record<BadgeType, { text: string; className: string }> = {
  hit: { text: 'Хит', className: 'bg-brand-400 text-ink' },
  new: { text: 'Новинка', className: 'bg-brand-600 text-white' },
  sale: { text: 'Скидка', className: 'bg-danger text-white' },
}

export function ProductBadge({ badge }: { badge: BadgeType }) {
  const { text, className } = LABELS[badge]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${className}`}
    >
      {text}
    </span>
  )
}
