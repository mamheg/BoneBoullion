import type { Category, OrderDraft, OrderResult, Product } from '@/types'
import { categories as mockCategories, products as mockProducts } from '@/data/catalog'

/**
 * Single data access layer. Today it resolves against in-repo mock data; when
 * the FastAPI backend lands, only the bodies here change to `fetch('/api/*')`
 * — components and hooks stay untouched.
 */

const LATENCY = 250

const delay = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), LATENCY))

export const api = {
  getCategories(): Promise<Category[]> {
    return delay(mockCategories)
  },

  getProducts(categoryId?: string): Promise<Product[]> {
    const list =
      !categoryId || categoryId === 'all'
        ? mockProducts
        : mockProducts.filter((p) => p.categoryId === categoryId)
    return delay(list)
  },

  getProduct(slug: string): Promise<Product | undefined> {
    return delay(mockProducts.find((p) => p.slug === slug))
  },

  async createOrder(draft: OrderDraft): Promise<OrderResult> {
    // Frontend-first stub: real submission to /api/orders lands with the backend.
    const orderNumber = `BB-${Math.floor(10000 + Math.random() * 89999)}`
    await delay(null)
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info('[order draft]', orderNumber, draft)
    }
    return {
      orderNumber,
      message: 'Заявка принята! Менеджер свяжется с вами для подтверждения.',
    }
  },

  async subscribe(email: string): Promise<{ ok: boolean }> {
    await delay(null)
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info('[newsletter]', email)
    }
    return { ok: true }
  },
}
