import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface UIContextValue {
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setCartOpen] = useState(false)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)

  const value = useMemo<UIContextValue>(
    () => ({
      isCartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      isMobileMenuOpen,
      toggleMobileMenu: () => setMobileMenuOpen((v) => !v),
      closeMobileMenu: () => setMobileMenuOpen(false),
    }),
    [isCartOpen, isMobileMenuOpen],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
