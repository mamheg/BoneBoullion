import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '@/services/adminApi'
import { Button } from '@/components/ui/Button'

const input =
  'h-11 w-full rounded-xl border border-line bg-white px-4 text-[15px] focus:border-brand-300 focus:outline-none'

export function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await adminApi.login(username, password)
      navigate('/admin/products', { replace: true })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-card-lg bg-card p-8 shadow-card ring-1 ring-line/60">
        <h1 className="font-display text-2xl font-bold">Админ-панель</h1>
        <p className="mt-1 text-sm text-ink-muted">BONE BOUILLON</p>
        {!adminApi.hasBackend && (
          <p className="mt-4 rounded-lg bg-brand-50 p-3 text-sm text-brand-800">
            Не задан VITE_API_URL — админка работает только с подключённым бэкендом.
          </p>
        )}
        <div className="mt-6 space-y-3">
          <input className={input} placeholder="Логин" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          <input className={input} type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </div>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        <Button type="submit" size="lg" className="mt-5 w-full" disabled={busy}>
          {busy ? 'Входим…' : 'Войти'}
        </Button>
      </form>
    </div>
  )
}
