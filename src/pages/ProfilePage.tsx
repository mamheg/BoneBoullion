import { Gift, Package, Sparkles, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'

/**
 * Profile is a skeleton for the frontend phase — accounts, real orders and the
 * loyalty ledger arrive with the backend. Sections below show the intended
 * shape so the screen is navigable today.
 */
export function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Профиль</h1>

      {/* guest / account card */}
      <div className="mt-6 flex flex-col items-start gap-4 rounded-card bg-card p-6 shadow-card ring-1 ring-line/60 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-full bg-surface-2 text-ink-muted">
            <User className="size-7" />
          </span>
          <div>
            <p className="font-display text-lg font-bold">Гость</p>
            <p className="text-sm text-ink-muted">
              Войдите, чтобы видеть заказы и бонусы
            </p>
          </div>
        </div>
        <Button variant="secondary" disabled title="Появится с подключением бэкенда">
          Войти по телефону
        </Button>
      </div>

      {/* loyalty */}
      <div className="mt-6 overflow-hidden rounded-card bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white shadow-card">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5" />
          <span className="text-sm font-semibold uppercase tracking-wide opacity-90">
            Бонусная программа
          </span>
        </div>
        <p className="mt-3 font-display text-3xl font-bold tnum">0 баллов</p>
        <p className="mt-1 text-sm opacity-90">
          Возвращаем 5% кэшбэка с каждого заказа. Копите и оплачивайте баллами.
        </p>
      </div>

      {/* sections */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-card bg-card p-6 shadow-card ring-1 ring-line/60">
          <div className="flex items-center gap-2 text-ink">
            <Package className="size-5 text-brand-600" />
            <h2 className="font-display text-lg font-bold">Мои заказы</h2>
          </div>
          <p className="mt-2 text-sm text-ink-muted">
            История заказов появится после первого оформления и подключения
            аккаунта.
          </p>
        </div>

        <div className="rounded-card bg-card p-6 shadow-card ring-1 ring-line/60">
          <div className="flex items-center gap-2 text-ink">
            <Gift className="size-5 text-brand-600" />
            <h2 className="font-display text-lg font-bold">Промокоды</h2>
          </div>
          <p className="mt-2 text-sm text-ink-muted">
            Подпишитесь на рассылку на главной — пришлём скидку 10% на первый
            заказ.
          </p>
        </div>
      </div>
    </div>
  )
}
