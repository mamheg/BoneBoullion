import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface UIContextValue {
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)

  const value = useMemo<UIContextValue>(
    () => ({
      isMobileMenuOpen,
      toggleMobileMenu: () => setMobileMenuOpen((v) => !v),
      closeMobileMenu: () => setMobileMenuOpen(false),
    }),
    [isMobileMenuOpen],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
