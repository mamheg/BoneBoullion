import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Check, ChevronLeft } from 'lucide-react'
import { api } from '@/services/api'
import { formatPrice, CONTACT } from '@/brand/config'
import { Button } from '@/components/ui/Button'
import { CartSummary } from '@/components/cart/CartSummary'
import { useCart } from '@/context/CartContext'
import { useCartLines } from '@/hooks/useCartLines'
import type { DeliveryMethod, OrderDraft, OrderResult } from '@/types'

const inputClass =
  'h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink placeholder:text-ink-muted focus:border-brand-300 focus:outline-none'
const labelClass = 'mb-1.5 block text-sm font-medium text-ink'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { clear } = useCart()
  const { lines, itemsTotal, deliveryCost, total } = useCartLines()

  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState<DeliveryMethod>('courier')
  const [city, setCity] = useState('Москва')
  const [address, setAddress] = useState('')
  const [comment, setComment] = useState('')

  const order = useMutation<OrderResult, Error, OrderDraft>({
    mutationFn: (draft) => api.createOrder(draft),
    onSuccess: () => {
      clear()
      setStep(2)
    },
  })

  if (lines.length === 0 && step < 2) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Корзина пуста</h1>
        <Link to="/catalog" className="mt-4 inline-block text-brand-600 underline">
          Перейти в каталог
        </Link>
      </div>
    )
  }

  const contactsValid = name.trim().length > 1 && phone.replace(/\D/g, '').length >= 10
  const deliveryValid = city.trim().length > 0 && (method === 'pickup' || address.trim().length > 3)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!contactsValid || !deliveryValid) return
    order.mutate({
      customer: { name, phone, email: email || undefined },
      delivery: { method, city, address: method === 'courier' ? address : undefined, comment },
      items: lines.map((l) => ({
        productId: l.product.id,
        title: l.product.name,
        quantity: l.quantity,
        price: l.product.price,
      })),
      itemsTotal,
      deliveryCost,
      total,
    })
  }

  // ── Confirmation ──────────────────────────────────────────────
  if (step === 2 && order.data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-success/15 text-success">
          <Check className="size-10" strokeWidth={2.4} />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold">
          Заявка №{order.data.orderNumber} принята!
        </h1>
        <p className="mt-3 text-ink-muted">{order.data.message}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={CONTACT.telegram}>
            <Button size="lg">Написать в Telegram</Button>
          </a>
          <Link to="/">
            <Button variant="secondary" size="lg">На главную</Button>
          </Link>
        </div>
      </div>
    )
  }

  const steps = ['Контакты', 'Доставка', 'Готово']

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <button
        type="button"
        onClick={() => (step === 0 ? navigate('/cart') : setStep(step - 1))}
        className="flex items-center gap-1 text-sm text-ink-muted hover:text-brand-700"
      >
        <ChevronLeft className="size-4" /> Назад
      </button>

      <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Оформление заказа</h1>

      {/* step indicator */}
      <ol className="mt-6 flex items-center gap-2 text-sm">
        {steps.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                i <= step ? 'bg-brand-600 text-white' : 'bg-surface-2 text-ink-muted'
              }`}
            >
              {i + 1}
            </span>
            <span className={i <= step ? 'font-medium text-ink' : 'text-ink-muted'}>
              {label}
            </span>
            {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-line" />}
          </li>
        ))}
      </ol>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          {step === 0 && (
            <div className="space-y-4 rounded-card bg-card p-6 shadow-card ring-1 ring-line/60">
              <div>
                <label className={labelClass} htmlFor="name">Имя*</label>
                <input id="name" className={inputClass} value={name}
                  onChange={(e) => setName(e.target.value)} placeholder="Как к вам обращаться" />
              </div>
              <div>
                <label className={labelClass} htmlFor="phone">Телефон*</label>
                <input id="phone" className={inputClass} value={phone} inputMode="tel"
                  onChange={(e) => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" />
              </div>
              <div>
                <label className={labelClass} htmlFor="email">E-mail</label>
                <input id="email" type="email" className={inputClass} value={email}
                  onChange={(e) => setEmail(e.target.value)} placeholder="Для чека и статуса заказа" />
              </div>
              <Button type="button" size="lg" className="w-full" disabled={!contactsValid}
                onClick={() => setStep(1)}>
                Продолжить
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 rounded-card bg-card p-6 shadow-card ring-1 ring-line/60">
              <div className="grid grid-cols-2 gap-3">
                {(['courier', 'pickup'] as DeliveryMethod[]).map((m) => (
                  <button key={m} type="button" onClick={() => setMethod(m)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                      method === m ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-line bg-white text-ink'
                    }`}>
                    {m === 'courier' ? 'Курьер' : 'Самовывоз'}
                  </button>
                ))}
              </div>
              <div>
                <label className={labelClass} htmlFor="city">Город*</label>
                <input id="city" className={inputClass} value={city}
                  onChange={(e) => setCity(e.target.value)} />
              </div>
              {method === 'courier' && (
                <div>
                  <label className={labelClass} htmlFor="address">Адрес доставки*</label>
                  <input id="address" className={inputClass} value={address}
                    onChange={(e) => setAddress(e.target.value)} placeholder="Улица, дом, квартира" />
                </div>
              )}
              <div>
                <label className={labelClass} htmlFor="comment">Комментарий</label>
                <textarea id="comment" rows={3}
                  className={`${inputClass} h-auto py-3`} value={comment}
                  onChange={(e) => setComment(e.target.value)} placeholder="Пожелания к заказу" />
              </div>
              <Button type="submit" size="lg" className="w-full"
                disabled={!deliveryValid || order.isPending}>
                {order.isPending ? 'Отправляем…' : 'Оформить заказ'}
              </Button>
            </div>
          )}
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-4 rounded-card bg-card p-5 shadow-card ring-1 ring-line/60">
            <h2 className="font-display text-lg font-bold">Ваш заказ</h2>
            <ul className="space-y-2 text-sm">
              {lines.map((l) => (
                <li key={l.product.id} className="flex justify-between gap-2">
                  <span className="text-ink-muted">
                    {l.product.name} × {l.quantity}
                  </span>
                  <span className="tnum">{formatPrice(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-line pt-3">
              <CartSummary itemsTotal={itemsTotal} deliveryCost={deliveryCost} total={total} />
            </div>
          </div>
        </aside>
      </form>
    </div>
  )
}
