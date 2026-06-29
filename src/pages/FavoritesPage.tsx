import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/context/FavoritesContext'
import { useProducts } from '@/hooks/useCatalog'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { Button } from '@/components/ui/Button'

export function FavoritesPage() {
  const { ids } = useFavorites()
  const { data: products, isLoading } = useProducts()

  const favorites = (products ?? []).filter((p) => ids.includes(p.id))

  if (!isLoading && favorites.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-4 py-20 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-surface-2 text-ink-muted">
          <Heart className="size-9" />
        </span>
        <h1 className="font-display text-3xl font-bold">В избранном пусто</h1>
        <p className="text-ink-muted">
          Нажимайте на сердечко у понравившихся бульонов — они появятся здесь.
        </p>
        <Link to="/catalog">
          <Button size="lg">Перейти в каталог</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Избранное</h1>
      <div className="mt-6">
        <ProductGrid
          products={favorites}
          loading={isLoading}
          skeletonCount={4}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        />
      </div>
    </div>
  )
}
