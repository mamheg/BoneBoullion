import { NavLink } from 'react-router-dom'
import type { Category } from '@/types'

/** Horizontal category selector for mobile/tablet (desktop uses CategoryList). */
export function CategoryChips({ categories }: { categories: Category[] }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {categories.map((cat) => {
        const to = cat.id === 'all' ? '/catalog' : `/catalog/${cat.id}`
        return (
          <NavLink
            key={cat.id}
            to={to}
            end={cat.id === 'all'}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white ring-brand-600'
                  : 'bg-card text-ink ring-line hover:ring-brand-300'
              }`
            }
          >
            {cat.name}
            <span className="text-xs opacity-70 tnum">{cat.count}</span>
          </NavLink>
        )
      })}
    </div>
  )
}
