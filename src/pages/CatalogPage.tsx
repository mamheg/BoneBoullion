import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { CategoryList } from '@/components/catalog/CategoryList'
import { CategoryChips } from '@/components/catalog/CategoryChips'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { useCategories, useProducts } from '@/hooks/useCatalog'

export function CatalogPage() {
  const { categoryId } = useParams()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim().toLowerCase() ?? ''

  const { data: categories, isLoading: catLoading } = useCategories()
  const { data: products, isLoading: prodLoading } = useProducts(categoryId)

  const activeCategory = categories?.find((c) => c.id === categoryId)
  const title = query
    ? `Поиск: «${query}»`
    : (activeCategory?.name ?? 'Весь ассортимент')

  const filtered = (products ?? []).filter((p) =>
    query
      ? p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      : true,
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-ink-muted" aria-label="Хлебные крошки">
        <Link to="/" className="hover:text-brand-700">Главная</Link>
        <ChevronRight className="size-4" />
        <Link to="/catalog" className="hover:text-brand-700">Каталог</Link>
        {activeCategory && (
          <>
            <ChevronRight className="size-4" />
            <span className="text-ink">{activeCategory.name}</span>
          </>
        )}
      </nav>

      <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{title}</h1>

      {/* mobile category chips */}
      {categories && (
        <div className="mt-5 lg:hidden">
          <CategoryChips categories={categories} />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
        <aside className="hidden lg:block">
          <CategoryList categories={categories} loading={catLoading} />
        </aside>
        <ProductGrid
          products={filtered}
          loading={prodLoading}
          skeletonCount={6}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
        />
      </div>
    </div>
  )
}
