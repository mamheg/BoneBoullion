/** Domain types for the BONE BOUILLON storefront. */

export type Badge = 'hit' | 'new' | 'sale'

export interface NutritionFacts {
  /** per 100 ml */
  calories: number
  protein: number
  fat: number
  carbs: number
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  /** current price in whole rubles */
  price: number
  /** crossed-out price when on sale */
  oldPrice?: number
  /** e.g. "480 мл" or "3 × 480 мл" */
  volume: string
  image: string
  images?: string[]
  /** broth/liquid color used by the placeholder jar illustration */
  accent?: string
  categoryId: string
  badges: Badge[]
  inStock: boolean
  composition?: string
  nutrition?: NutritionFacts
}

export interface Category {
  id: string
  name: string
  /** number of products, shown in the sidebar */
  count: number
}

export interface CartItem {
  productId: string
  quantity: number
}

export type DeliveryMethod = 'courier' | 'pickup'

export interface CustomerInfo {
  name: string
  phone: string
  email?: string
}

export interface DeliveryInfo {
  method: DeliveryMethod
  city: string
  address?: string
  comment?: string
  slotId?: number
}

export interface DeliverySlot {
  id: number
  date: string
  start: string
  end: string
  available: number
}

export interface OrderDraft {
  customer: CustomerInfo
  delivery: DeliveryInfo
  items: Array<{
    productId: string
    title: string
    quantity: number
    price: number
  }>
  itemsTotal: number
  deliveryCost: number
  total: number
}

export interface OrderResult {
  orderNumber: string
  message: string
}
