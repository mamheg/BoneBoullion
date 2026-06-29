import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SectionHeader({
  title,
  linkTo,
  linkLabel = 'Смотреть все',
}: {
  title: string
  linkTo?: string
  linkLabel?: string
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      {linkTo && (
        <Link
          to={linkTo}
          className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-brand-700"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
