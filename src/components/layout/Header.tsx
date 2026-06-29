import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, ShoppingBag, User, X } from 'lucide-react'
import { Logo } from './Logo'
import { SearchBar } from '@/components/ui/SearchBar'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useUI } from '@/context/UIContext'

function CountBadge({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
          className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white tnum"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

function ActionLink({
  to,
  label,
  icon,
  count = 0,
}: {
  to: string
  label: string
  icon: React.ReactNode
  count?: number
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-brand-700 ${
          isActive ? 'text-brand-700' : 'text-ink'
        }`
      }
    >
      <span className="relative">
        {icon}
        <CountBadge count={count} />
      </span>
      <span className="hidden xl:inline">{label}</span>
    </NavLink>
  )
}

export function Header() {
  const { itemCount } = useCart()
  const { count: favCount } = useFavorites()
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, openCart } = useUI()

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-surface/90 backdrop-blur">
      {/* Desktop */}
      <div className="mx-auto hidden max-w-7xl items-center gap-5 px-4 py-3.5 lg:flex">
        <Logo className="shrink-0" />
        <Link to="/catalog" className="shrink-0">
          <Button size="md" className="px-5">
            <Menu className="size-5" strokeWidth={2.4} />
            Каталог
          </Button>
        </Link>
        <SearchBar className="flex-1" />
        <nav className="flex shrink-0 items-center gap-1">
          <ActionLink
            to="/favorites"
            label="Избранное"
            count={favCount}
            icon={<Heart className="size-5" strokeWidth={2} />}
          />
          <ActionLink
            to="/profile"
            label="Профиль"
            icon={<User className="size-5" strokeWidth={2} />}
          />
          <button
            type="button"
            onClick={openCart}
            className="group flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink transition-colors hover:text-brand-700"
          >
            <span className="relative">
              <ShoppingBag className="size-5" strokeWidth={2} />
              <CountBadge count={itemCount} />
            </span>
            <span className="hidden xl:inline">Корзина</span>
          </button>
        </nav>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            className="flex size-10 items-center justify-center rounded-full text-ink transition-[transform,background-color] duration-150 ease-out hover:bg-brand-50 active:scale-90"
          >
            {isMobileMenuOpen ? (
              <X className="size-6" strokeWidth={2.2} />
            ) : (
              <Menu className="size-6" strokeWidth={2.2} />
            )}
          </button>
          <Logo />
          <button
            type="button"
            onClick={openCart}
            aria-label="Корзина"
            className="relative flex size-10 items-center justify-center rounded-full text-ink transition-[transform,background-color] duration-150 ease-out hover:bg-brand-50 active:scale-90"
          >
            <ShoppingBag className="size-6" strokeWidth={2} />
            <CountBadge count={itemCount} />
          </button>
        </div>
        <div className="px-4 pb-3">
          <SearchBar />
        </div>

        {isMobileMenuOpen && (
          <nav className="border-t border-line bg-surface px-4 py-2">
            {[
              { to: '/catalog', label: 'Каталог' },
              { to: '/favorites', label: 'Избранное' },
              { to: '/profile', label: 'Профиль' },
              { to: '/cart', label: 'Корзина' },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-3 text-base font-medium ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
