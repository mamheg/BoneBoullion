import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { CatalogPage } from '@/pages/CatalogPage'
import { ProductPage } from '@/pages/ProductPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RequireAdmin } from '@/components/admin/RequireAdmin'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminLogin } from '@/pages/admin/AdminLogin'
import { AdminProducts } from '@/pages/admin/AdminProducts'
import { AdminCategories } from '@/pages/admin/AdminCategories'
import { AdminOrders } from '@/pages/admin/AdminOrders'
import { AdminSlots } from '@/pages/admin/AdminSlots'
import { AdminSettings } from '@/pages/admin/AdminSettings'

export const router = createBrowserRouter([
  // Admin (own layout, guarded — outside the storefront chrome)
  { path: '/admin/login', element: <AdminLogin /> },
  {
    element: <RequireAdmin />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin', element: <AdminProducts /> },
          { path: '/admin/products', element: <AdminProducts /> },
          { path: '/admin/categories', element: <AdminCategories /> },
          { path: '/admin/orders', element: <AdminOrders /> },
          { path: '/admin/slots', element: <AdminSlots /> },
          { path: '/admin/settings', element: <AdminSettings /> },
        ],
      },
    ],
  },
  // Storefront
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/catalog', element: <CatalogPage /> },
      { path: '/catalog/:categoryId', element: <CatalogPage /> },
      { path: '/product/:slug', element: <ProductPage /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/favorites', element: <FavoritesPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
