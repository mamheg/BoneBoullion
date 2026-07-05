import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Box, LogOut, Package, Settings, Tag, Clock } from 'lucide-react'
import { adminApi } from '@/services/adminApi'

const nav = [
  { to: '/admin/products', label: 'Товары', icon: Package },
  { to: '/admin/categories', label: 'Категории', icon: Tag },
  { to: '/admin/orders', label: 'Заказы', icon: Box },
  { to: '/admin/slots', label: 'Слоты', icon: Clock },
  { to: '/admin/settings', label: 'Настройки', icon: Settings },
]

export function AdminLayout() {
  const navigate = useNavigate()
  const logout = async () => {
    await adminApi.logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-dvh bg-surface">
      <aside className="flex w-56 shrink-0 flex-col border-r border-line bg-card">
        <div className="border-b border-line px-5 py-4 font-display text-lg font-bold">
          BONE BOUILLON
          <span className="ml-1 text-xs font-normal text-ink-muted">admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-ink hover:bg-surface-2'
                }`
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="m-3 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-surface-2 hover:text-danger"
        >
          <LogOut className="size-4" /> Выйти
        </button>
      </aside>
      <main className="flex-1 overflow-x-hidden p-6">
        <Outlet />
      </main>
    </div>
  )
}
