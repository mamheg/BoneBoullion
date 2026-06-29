import { NavLink } from 'react-router-dom'
import { Heart, Home, LayoutGrid, ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoritesContext'

const items = [
  { to: '/', label: 'Главная', icon: Home, end: true },
  { to: '/catalog', label: 'Каталог', icon: LayoutGrid, end: false },
  { to: '/favorites', label: 'Избранное', icon: Heart, end: false },
  { to: '/profile', label: 'Профиль', icon: User, end: false },
  { to: '/cart', label: 'Корзина', icon: ShoppingBag, end: false },
] as const

export function MobileBottomNav() {
  const { itemCount } = useCart()
  const { count: favCount } = useFavorites()

  const countFor = (to: string) =>
    to === '/cart' ? itemCount : to === '/favorites' ? favCount : 0

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {items.map(({ to, label, icon: Icon, end }) => {
          const count = countFor(to)
          return (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors ${
                    isActive ? 'text-brand-600' : 'text-ink-muted'
                  }`
                }
              >
                <span className="relative">
                  <Icon className="size-6" strokeWidth={2} />
                  {count > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white tnum">
                      {count}
                    </span>
                  )}
                </span>
                {label}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
