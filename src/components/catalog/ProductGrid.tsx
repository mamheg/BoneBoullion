import type { Product } from '@/types'
import { ProductCard } from './ProductCard'

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-card bg-card shadow-card ring-1 ring-line/60">
      <div className="aspect-square animate-pulse bg-surface-2" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-surface-2" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  )
}

interface ProductGridProps {
  products?: Product[]
  loading?: boolean
  skeletonCount?: number
  className?: string
}

export function ProductGrid({
  products = [],
  loading = false,
  skeletonCount = 4,
  className = 'grid grid-cols-2 gap-4 lg:grid-cols-4',
}: ProductGridProps) {
  if (loading) {
    return (
      <div className={className}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <p className="rounded-card bg-card p-10 text-center text-ink-muted ring-1 ring-line/60">
        Товары не найдены.
      </p>
    )
  }

  return (
    <div className={className}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
