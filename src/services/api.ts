import type {
  Category,
  DeliverySlot,
  OrderDraft,
  OrderResult,
  Product,
} from '@/types'
import { categories as mockCategories, products as mockProducts } from '@/data/catalog'

/**
 * Single data access layer. When `VITE_API_URL` is set it talks to the FastAPI
 * backend; otherwise it falls back to the in-repo mock catalog so the storefront
 * keeps working before the backend is deployed. Component/hook signatures never
 * change between the two modes.
 */

const API = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
const useReal = Boolean(API)

const LATENCY = 200
const delay = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), LATENCY))

/** Uploaded photos live on the backend (/media); catalog seed photos are
 * frontend-static (/images). Prefix only backend media with the API origin. */
const resolveMedia = (url: string): string =>
  url && url.startsWith('/media') ? API + url : url

const mapProduct = (p: Product): Product => ({
  ...p,
  image: resolveMedia(p.image),
  images: p.images?.map(resolveMedia),
})

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`)
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json() as Promise<T>
}

export const api = {
  async getCategories(): Promise<Category[]> {
    if (!useReal) return delay(mockCategories)
    return getJSON<Category[]>('/api/categories')
  },

  async getProducts(categoryId?: string): Promise<Product[]> {
    if (!useReal) {
      const list =
        !categoryId || categoryId === 'all'
          ? mockProducts
          : mockProducts.filter((p) => p.categoryId === categoryId)
      return delay(list)
    }
    const query = categoryId && categoryId !== 'all' ? `?category=${categoryId}` : ''
    return (await getJSON<Product[]>(`/api/products${query}`)).map(mapProduct)
  },

  async getProduct(slug: string): Promise<Product | undefined> {
    if (!useReal) return delay(mockProducts.find((p) => p.slug === slug))
    const res = await fetch(`${API}/api/products/${slug}`)
    if (res.status === 404) return undefined
    if (!res.ok) throw new Error(`API ${res.status}`)
    return mapProduct(await res.json())
  },

  async getDeliverySlots(): Promise<DeliverySlot[]> {
    if (!useReal) {
      // a couple of demo slots for dev without a backend
      const day = new Date()
      day.setDate(day.getDate() + 1)
      const d = day.toISOString().slice(0, 10)
      return delay([
        { id: 1, date: d, start: '10:00', end: '13:00', available: 8 },
        { id: 2, date: d, start: '13:00', end: '16:00', available: 5 },
      ])
    }
    return getJSON<DeliverySlot[]>('/api/delivery/slots')
  },

  async createOrder(draft: OrderDraft): Promise<OrderResult> {
    const body = {
      customer: {
        name: draft.customer.name,
        phone: draft.customer.phone,
        email: draft.customer.email,
      },
      delivery: {
        method: draft.delivery.method,
        address: draft.delivery.address,
        comment: draft.delivery.comment,
        slotId: draft.delivery.slotId,
      },
      items: draft.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    }

    if (!useReal) {
      const orderNumber = `BB-${Math.floor(10000 + Math.random() * 89999)}`
      await delay(null)
      if (import.meta.env.DEV) console.info('[order draft]', orderNumber, body)
      return {
        orderNumber,
        message: 'Заявка принята! Менеджер свяжется с вами для подтверждения.',
      }
    }

    const res = await fetch(`${API}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const detail = await res.json().catch(() => null)
      throw new Error(detail?.detail ?? `Не удалось оформить заказ (${res.status})`)
    }
    return res.json()
  },
}
