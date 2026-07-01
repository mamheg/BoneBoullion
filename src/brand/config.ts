/** Brand-level constants for BONE BOUILLON. */

export const BRAND = {
  name: 'BONE BOUILLON',
  tagline: '100% натурально',
  /** Free delivery threshold in rubles */
  freeDeliveryThreshold: 3000,
  deliveryCost: 300,
} as const

export const CONTACT = {
  phone: '+7 (929) 884-50-91',
  email: 'hello@bonebouillon.ru',
  telegram: 'https://t.me/bone_bouillon',
  telegramChannel: 'https://t.me/bone_bouillon',
  instagram: 'https://instagram.com/bone_bouillon',
} as const

export const formatPrice = (value: number) =>
  `${value.toLocaleString('ru-RU')} ₽`
