import { NavLink } from 'react-router-dom'
import type { Category } from '@/types'

/** Category sidebar (desktop) — matches the mockup's left rail with counts. */
export function CategoryList({
  categories,
  loading,
}: {
  categories?: Category[]
  loading?: boolean
}) {
  if (loading || !categories) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-11 animate-pulse rounded-xl bg-surface-2" />
        ))}
      </div>
    )
  }

  return (
    <nav aria-label="Категории" className="rounded-card bg-card p-3 shadow-card ring-1 ring-line/60">
      <h2 className="px-3 pb-2 pt-1 font-display text-lg font-bold">Категории</h2>
      <ul className="space-y-1">
        {categories.map((cat) => {
          const to = cat.id === 'all' ? '/catalog' : `/catalog/${cat.id}`
          return (
            <li key={cat.id}>
              <NavLink
                to={to}
                end={cat.id === 'all'}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink hover:bg-surface-2'
                  }`
                }
              >
                <span>{cat.name}</span>
                <span className="text-sm text-ink-muted tnum">{cat.count}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
