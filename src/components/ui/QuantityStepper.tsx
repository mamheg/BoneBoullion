import { Minus, Plus } from 'lucide-react'

export function QuantityStepper({
  value,
  onChange,
  size = 'md',
}: {
  value: number
  onChange: (next: number) => void
  size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 'size-8' : 'size-10'
  return (
    <div className="inline-flex items-center rounded-full bg-surface-2 ring-1 ring-line">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        aria-label="Уменьшить количество"
        className={`${dim} flex items-center justify-center rounded-full text-ink transition-colors hover:bg-brand-100`}
      >
        <Minus className="size-4" strokeWidth={2.6} />
      </button>
      <span className="min-w-8 text-center text-[15px] font-bold tnum">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Увеличить количество"
        className={`${dim} flex items-center justify-center rounded-full text-ink transition-colors hover:bg-brand-100`}
      >
        <Plus className="size-4" strokeWidth={2.6} />
      </button>
    </div>
  )
}
