import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

/**
 * App shell. The announcement bar, header, footer, mobile nav and cart drawer
 * are wired up in milestone M1; for now it hosts routing + scroll restoration.
 */
export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
