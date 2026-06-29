import { useMemo } from 'react'
import { useCart } from '@/context/CartContext'
import { useProducts } from '@/hooks/useCatalog'
import { BRAND } from '@/brand/config'
import type { Product } from '@/types'

export interface CartLine {
  product: Product
  quantity: number
  lineTotal: number
}

export function useCartLines() {
  const { items } = useCart()
  const { data: products = [] } = useProducts()

  return useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]))
    const lines: CartLine[] = items
      .map((item) => {
        const product = byId.get(item.productId)
        if (!product) return null
        return {
          product,
          quantity: item.quantity,
          lineTotal: product.price * item.quantity,
        }
      })
      .filter((l): l is CartLine => l !== null)

    const itemsTotal = lines.reduce((sum, l) => sum + l.lineTotal, 0)
    const freeDelivery = itemsTotal >= BRAND.freeDeliveryThreshold || itemsTotal === 0
    const deliveryCost = freeDelivery ? 0 : BRAND.deliveryCost
    const remainingForFree = Math.max(0, BRAND.freeDeliveryThreshold - itemsTotal)

    return {
      lines,
      itemsTotal,
      deliveryCost,
      total: itemsTotal + deliveryCost,
      freeDelivery,
      remainingForFree,
    }
  }, [items, products])
}
