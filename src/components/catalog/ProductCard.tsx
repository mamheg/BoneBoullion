import { Link } from 'react-router-dom'
import { Check, Heart, Plus } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice } from '@/brand/config'
import { ProductBadge } from '@/components/ui/Badge'
import { JarIllustration } from './JarIllustration'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoritesContext'

export function ProductCard({ product }: { product: Product }) {
  const { add, quantityOf } = useCart()
  const { has, toggle } = useFavorites()
  const inCart = quantityOf(product.id)
  const isFav = has(product.id)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card bg-card shadow-card ring-1 ring-line/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* image */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-surface-2"
      >
        <JarIllustration
          accent={product.accent}
          title={product.name}
          className="size-full p-6 transition-transform duration-500 group-hover:scale-105"
        />
        {product.badges.length > 0 && (
          <div className="absolute left-3 top-3 flex gap-1.5">
            {product.badges.map((b) => (
              <ProductBadge key={b} badge={b} />
            ))}
          </div>
        )}
      </Link>

      {/* favorite */}
      <button
        type="button"
        onClick={() => toggle(product.id)}
        aria-label={isFav ? 'Убрать из избранного' : 'В избранное'}
        aria-pressed={isFav}
        className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-all hover:scale-110 hover:text-brand-600"
      >
        <Heart
          className={`size-5 transition-all ${isFav ? 'scale-110 fill-brand-600 text-brand-600' : ''}`}
          strokeWidth={2}
        />
      </button>

      {/* body */}
      <div className="flex flex-1 flex-col p-4">
        <Link to={`/product/${product.slug}`} className="flex-1">
          <h3 className="font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-ink-muted">{product.volume}</p>
        </Link>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="flex flex-col leading-none">
            {product.oldPrice && (
              <span className="text-sm text-ink-muted line-through tnum">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="font-display text-xl font-bold text-ink tnum">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => add(product.id)}
            aria-label={`Добавить «${product.name}» в корзину`}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-[0_6px_16px_rgb(230_158_38/0.35)] transition-all hover:bg-brand-700 active:scale-95"
          >
            {inCart > 0 ? (
              <span className="flex items-center gap-0.5 text-sm font-bold tnum">
                <Check className="size-4" strokeWidth={3} />
                {inCart}
              </span>
            ) : (
              <Plus className="size-5" strokeWidth={2.6} />
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
