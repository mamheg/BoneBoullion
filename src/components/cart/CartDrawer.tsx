import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, X } from 'lucide-react'
import { useUI } from '@/context/UIContext'
import { useCartLines } from '@/hooks/useCartLines'
import { Button } from '@/components/ui/Button'
import { CartLineItem } from './CartLineItem'
import { CartSummary } from './CartSummary'
import { FreeDeliveryBar } from './FreeDeliveryBar'

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUI()
  const navigate = useNavigate()
  const { lines, itemsTotal, deliveryCost, total, remainingForFree } = useCartLines()

  const goCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-dvh w-full max-w-md flex-col bg-surface shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-label="Корзина"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-xl font-bold">Корзина</h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Закрыть корзину"
                className="flex size-9 items-center justify-center rounded-full text-ink hover:bg-brand-50"
              >
                <X className="size-5" />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-surface-2 text-ink-muted">
                  <ShoppingBag className="size-7" />
                </span>
                <p className="text-ink-muted">Корзина пока пуста</p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    closeCart()
                    navigate('/catalog')
                  }}
                >
                  Перейти в каталог
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 divide-y divide-line overflow-y-auto px-5">
                  {lines.map((line) => (
                    <CartLineItem key={line.product.id} line={line} onNavigate={closeCart} />
                  ))}
                </div>
                <div className="space-y-3 border-t border-line bg-card px-5 py-4">
                  <FreeDeliveryBar itemsTotal={itemsTotal} remainingForFree={remainingForFree} />
                  <CartSummary itemsTotal={itemsTotal} deliveryCost={deliveryCost} total={total} />
                  <Button size="lg" className="w-full" onClick={goCheckout}>
                    Оформить заказ
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
