const API = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
const TOKEN_KEY = 'bb_admin_token'

export const adminToken = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = adminToken.get()
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (res.status === 401) {
    adminToken.clear()
    throw new Error('Требуется вход')
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.detail ?? `Ошибка ${res.status}`)
  }
  return res.status === 204 ? (undefined as T) : (res.json() as Promise<T>)
}

export interface AdminProduct {
  id: number
  slug: string
  name: string
  description: string
  price: number
  oldPrice: number | null
  volume: string
  accent: string | null
  categoryId: string
  badges: string[]
  inStock: boolean
  isActive: boolean
  composition: string | null
  nutrition: Record<string, number> | null
  sortOrder: number
  images: { id: number; url: string }[]
}

export interface AdminOrder {
  id: string
  customerName: string
  phone: string
  total: number
  status: string
  paymentStatus?: string
  deliveryMethod: string
  tgDelivered: boolean
  createdAt: string | null
}

export interface AdminSlot {
  id: number
  date: string
  start: string
  end: string
  capacity: number
  booked: number
  isActive: boolean
}

export const adminApi = {
  hasBackend: Boolean(API),

  async login(username: string, password: string) {
    const res = await fetch(`${API}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error('Неверный логин или пароль')
    const data = (await res.json()) as { token: string }
    adminToken.set(data.token)
    return data
  },
  logout: () => req('/api/admin/logout', { method: 'POST' }).catch(() => {}).finally(adminToken.clear),
  me: () => req<{ username: string }>('/api/admin/me'),

  // catalog
  listProducts: () => req<AdminProduct[]>('/api/admin/products'),
  getProduct: (id: number) => req<AdminProduct>(`/api/admin/products/${id}`),
  createProduct: (body: unknown) => req<{ id: number }>('/api/admin/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id: number, body: unknown) => req(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id: number) => req(`/api/admin/products/${id}`, { method: 'DELETE' }),
  uploadImage: (id: number, file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return req<{ id: number; url: string }>(`/api/admin/products/${id}/images`, { method: 'POST', body: fd })
  },
  deleteImage: (pid: number, iid: number) => req(`/api/admin/products/${pid}/images/${iid}`, { method: 'DELETE' }),

  listCategories: () => req<{ id: string; name: string; count: number }[]>('/api/categories'),
  createCategory: (body: unknown) => req('/api/admin/categories', { method: 'POST', body: JSON.stringify(body) }),
  deleteCategory: (id: string) => req(`/api/admin/categories/${id}`, { method: 'DELETE' }),

  // orders
  listOrders: (status?: string) => req<AdminOrder[]>(`/api/admin/orders${status ? `?status=${status}` : ''}`),
  getOrder: (id: string) => req<Record<string, unknown>>(`/api/admin/orders/${id}`),
  setOrderStatus: (id: string, status: string) => req(`/api/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // slots
  listSlots: () => req<AdminSlot[]>('/api/admin/slots'),
  generateSlots: (body: unknown) => req<{ created: number }>('/api/admin/slots/generate', { method: 'POST', body: JSON.stringify(body) }),
  toggleSlot: (id: number, isActive: boolean) => req(`/api/admin/slots/${id}?is_active=${isActive}`, { method: 'PATCH' }),

  // settings
  getSettings: () => req<Record<string, string>>('/api/admin/settings'),
  setSetting: (key: string, value: string) => req('/api/admin/settings', { method: 'PUT', body: JSON.stringify({ key, value }) }),
}
