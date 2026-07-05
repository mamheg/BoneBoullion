import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router-dom'
import { adminApi, adminToken } from '@/services/adminApi'

/** Guards /admin/* — redirects to login when there is no valid session. */
export function RequireAdmin() {
  const token = adminToken.get()
  const { isLoading, isError } = useQuery({
    queryKey: ['admin-me'],
    queryFn: () => adminApi.me(),
    enabled: Boolean(token),
    retry: false,
  })

  if (!token) return <Navigate to="/admin/login" replace />
  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-ink-muted">
        Загрузка…
      </div>
    )
  }
  if (isError) return <Navigate to="/admin/login" replace />
  return <Outlet />
}
