import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ArrowRight, Check } from 'lucide-react'
import { api } from '@/services/api'
import { Button } from '@/components/ui/Button'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const subscribe = useMutation({ mutationFn: (value: string) => api.subscribe(value) })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (email.trim()) subscribe.mutate(email.trim())
  }

  return (
    <section className="mx-auto mt-12 max-w-7xl px-4 sm:mt-16">
      <div className="grid items-center gap-8 overflow-hidden rounded-card-lg bg-surface-2 p-8 ring-1 ring-line/60 sm:p-12 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Скидка 10% на первый заказ
          </h2>
          <p className="mt-3 max-w-md text-ink-muted">
            Подпишитесь на рассылку — полезные рецепты, новинки и специальные
            предложения BONE BOUILLON.
          </p>
        </div>

        {subscribe.isSuccess ? (
          <div className="flex items-center gap-3 rounded-card bg-card p-5 text-ink ring-1 ring-line/60">
            <span className="flex size-10 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="size-5" strokeWidth={2.6} />
            </span>
            <p className="font-medium">
              Спасибо! Промокод на скидку 10% отправлен на {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваш e-mail"
              aria-label="E-mail для подписки"
              className="h-14 flex-1 rounded-full border border-line bg-white px-6 text-[15px] text-ink placeholder:text-ink-muted focus:border-brand-300 focus:outline-none"
            />
            <Button type="submit" size="lg" disabled={subscribe.isPending}>
              {subscribe.isPending ? 'Отправляем…' : 'Подписаться'}
              {!subscribe.isPending && <ArrowRight className="size-5" />}
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
