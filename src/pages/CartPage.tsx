import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCartLines } from '@/hooks/useCartLines'
import { CartLineItem } from '@/components/cart/CartLineItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { FreeDeliveryBar } from '@/components/cart/FreeDeliveryBar'
import { Button } from '@/components/ui/Button'

export function CartPage() {
  const { lines, itemsTotal, deliveryCost, total, remainingForFree } = useCartLines()

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-4 py-20 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-surface-2 text-ink-muted">
          <ShoppingBag className="size-9" />
        </span>
        <h1 className="font-display text-3xl font-bold">Корзина пуста</h1>
        <p className="text-ink-muted">Добавьте бульоны из каталога — и оформим доставку.</p>
        <Link to="/catalog">
          <Button size="lg">Перейти в каталог</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Корзина</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
        <div className="divide-y divide-line rounded-card bg-card px-5 shadow-card ring-1 ring-line/60">
          {lines.map((line) => (
            <CartLineItem key={line.product.id} line={line} />
          ))}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-4 rounded-card bg-card p-5 shadow-card ring-1 ring-line/60">
            <FreeDeliveryBar itemsTotal={itemsTotal} remainingForFree={remainingForFree} />
            <CartSummary itemsTotal={itemsTotal} deliveryCost={deliveryCost} total={total} />
            <Link to="/checkout" className="block">
              <Button size="lg" className="w-full">Оформить заказ</Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
