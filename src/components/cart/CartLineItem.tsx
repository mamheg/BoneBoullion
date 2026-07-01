import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import type { CartLine } from '@/hooks/useCartLines'
import { formatPrice } from '@/brand/config'
import { JarIllustration } from '@/components/catalog/JarIllustration'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { useCart } from '@/context/CartContext'

export function CartLineItem({
  line,
  onNavigate,
}: {
  line: CartLine
  onNavigate?: () => void
}) {
  const { setQuantity, remove } = useCart()
  const { product, quantity, lineTotal } = line

  return (
    <div className="flex gap-3 py-4">
      <Link
        to={`/product/${product.slug}`}
        onClick={onNavigate}
        className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-2"
      >
        <JarIllustration accent={product.accent} title={product.name} className="size-full p-2" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/product/${product.slug}`}
            onClick={onNavigate}
            className="font-display text-[15px] font-bold leading-tight hover:text-brand-700"
          >
            {product.name}
          </Link>
          <button
            type="button"
            onClick={() => remove(product.id)}
            aria-label={`Удалить «${product.name}» из корзины`}
            className="shrink-0 rounded-full p-1 text-ink-muted transition-colors hover:text-danger"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
        <p className="text-sm text-ink-muted">{product.volume}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <QuantityStepper
            value={quantity}
            onChange={(n) => setQuantity(product.id, n)}
            size="sm"
          />
          <span className="font-sans font-extrabold tnum">{formatPrice(lineTotal)}</span>
        </div>
      </div>
    </div>
  )
}
