import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useProducts(categoryId?: string) {
  return useQuery({
    queryKey: ['products', categoryId ?? 'all'],
    queryFn: () => api.getProducts(categoryId),
    staleTime: 60 * 1000,
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.getProduct(slug),
    enabled: Boolean(slug),
  })
}
