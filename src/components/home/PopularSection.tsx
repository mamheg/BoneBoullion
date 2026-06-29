import { CategoryList } from '@/components/catalog/CategoryList'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { SectionHeader } from '@/components/catalog/SectionHeader'
import { useCategories, useProducts } from '@/hooks/useCatalog'

export function PopularSection() {
  const { data: categories, isLoading: catLoading } = useCategories()
  const { data: products, isLoading: prodLoading } = useProducts()

  // "Популярное": hits/new first, capped to the grid
  const popular = (products ?? [])
    .slice()
    .sort((a, b) => Number(b.badges.length > 0) - Number(a.badges.length > 0))
    .slice(0, 8)

  return (
    <section className="mx-auto mt-12 max-w-7xl px-4 sm:mt-16">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
        <aside className="hidden lg:block">
          <CategoryList categories={categories} loading={catLoading} />
        </aside>

        <div>
          <SectionHeader title="Популярное" linkTo="/catalog" />
          <div className="mt-6">
            <ProductGrid
              products={popular}
              loading={prodLoading}
              skeletonCount={4}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
