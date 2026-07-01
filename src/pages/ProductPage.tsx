import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Heart, ShoppingBag } from 'lucide-react'
import { useProduct } from '@/hooks/useCatalog'
import { formatPrice } from '@/brand/config'
import { Button } from '@/components/ui/Button'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { ProductBadge } from '@/components/ui/Badge'
import { JarIllustration } from '@/components/catalog/JarIllustration'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoritesContext'

export function ProductPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(slug)
  const { add } = useCart()
  const { has, toggle } = useFavorites()
  const [qty, setQty] = useState(1)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-card-lg bg-surface-2" />
          <div className="space-y-4">
            <div className="h-9 w-2/3 animate-pulse rounded bg-surface-2" />
            <div className="h-5 w-full animate-pulse rounded bg-surface-2" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-surface-2" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Товар не найден</h1>
        <Link to="/catalog" className="mt-4 inline-block text-brand-600 underline">
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  const isFav = has(product.id)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-ink-muted" aria-label="Хлебные крошки">
        <Link to="/" className="hover:text-brand-700">Главная</Link>
        <ChevronRight className="size-4" />
        <Link to="/catalog" className="hover:text-brand-700">Каталог</Link>
        <ChevronRight className="size-4" />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* gallery */}
        <div className="relative overflow-hidden rounded-card-lg bg-gradient-to-br from-brand-100 to-brand-200 p-8 sm:p-12">
          {product.badges.length > 0 && (
            <div className="absolute left-5 top-5 flex gap-2">
              {product.badges.map((b) => (
                <ProductBadge key={b} badge={b} />
              ))}
            </div>
          )}
          <JarIllustration
            accent={product.accent}
            title={product.name}
            className="mx-auto w-full max-w-sm drop-shadow-xl"
          />
        </div>

        {/* details */}
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-ink-muted">{product.volume}</p>

          <div className="mt-5 flex items-end gap-3">
            {product.oldPrice && (
              <span className="text-lg text-ink-muted line-through tnum">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="font-sans text-3xl font-extrabold text-ink tnum">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="mt-5 leading-relaxed text-ink-muted">{product.description}</p>

          {/* actions */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} onChange={(n) => setQty(Math.max(1, n))} />
            <Button
              size="lg"
              onClick={() => {
                add(product.id, qty)
                navigate('/cart')
              }}
              disabled={!product.inStock}
            >
              <ShoppingBag className="size-5" />
              В корзину · {formatPrice(product.price * qty)}
            </Button>
            <button
              type="button"
              onClick={() => toggle(product.id)}
              aria-label={isFav ? 'Убрать из избранного' : 'В избранное'}
              aria-pressed={isFav}
              className="flex size-14 items-center justify-center rounded-full bg-white text-ink ring-1 ring-line transition-all hover:text-brand-600"
            >
              <Heart className={`size-6 ${isFav ? 'fill-brand-600 text-brand-600' : ''}`} />
            </button>
          </div>

          {/* composition */}
          {product.composition && (
            <div className="mt-8 rounded-card bg-card p-5 ring-1 ring-line/60">
              <h2 className="font-display text-lg font-bold">Состав</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {product.composition}
              </p>
            </div>
          )}

          {/* nutrition */}
          {product.nutrition && (
            <div className="mt-4 rounded-card bg-card p-5 ring-1 ring-line/60">
              <h2 className="font-display text-lg font-bold">
                Пищевая ценность на 100 мл
              </h2>
              <dl className="mt-3 grid grid-cols-4 gap-3 text-center">
                {[
                  { label: 'Ккал', value: product.nutrition.calories },
                  { label: 'Белки', value: `${product.nutrition.protein} г` },
                  { label: 'Жиры', value: `${product.nutrition.fat} г` },
                  { label: 'Углеводы', value: `${product.nutrition.carbs} г` },
                ].map((n) => (
                  <div key={n.label} className="rounded-xl bg-surface-2 py-3">
                    <dt className="text-xs text-ink-muted">{n.label}</dt>
                    <dd className="mt-1 font-bold tnum">{n.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
