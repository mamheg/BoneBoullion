import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { MobileBottomNav } from './MobileBottomNav'
import { CartDrawer } from '@/components/cart/CartDrawer'

/** App shell: announcement bar, header, routed content, footer, mobile tab bar. */
export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <Header />
      {/* extra bottom padding on mobile so content clears the fixed tab bar */}
      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <CartDrawer />
    </div>
  )
}
