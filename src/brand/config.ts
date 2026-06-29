/** Brand-level constants for BONE BOUILLON. */

export const BRAND = {
  name: 'BONE BOUILLON',
  tagline: '100% натурально',
  /** Free delivery threshold in rubles */
  freeDeliveryThreshold: 3000,
  deliveryCost: 300,
} as const

export const CONTACT = {
  phone: '+7 (495) 000-00-00',
  email: 'hello@bonebouillon.ru',
  telegram: 'https://t.me/bonebouillon',
  instagram: 'https://instagram.com/bonebouillon',
} as const

export const formatPrice = (value: number) =>
  `${value.toLocaleString('ru-RU')} ₽`
