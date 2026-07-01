import { CookingPot, Leaf, Package, Snowflake } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const benefits: Array<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: Leaf, title: '100% натурально', text: 'Только фермерские ингредиенты и ничего лишнего' },
  { icon: CookingPot, title: '24 часа томления', text: 'Медленное приготовление сохраняет пользу' },
  { icon: Snowflake, title: 'Шоковая заморозка', text: 'Сохраняем вкус и пользу без консервантов' },
  { icon: Package, title: 'Удобная доставка', text: 'Бережно упакуем и доставим к вашей двери' },
]

export function BenefitsBar() {
  return (
    <section className="mx-auto mt-10 max-w-7xl px-4 sm:mt-14">
      <div className="grid gap-6 rounded-card-lg bg-card p-6 shadow-card ring-1 ring-line/60 sm:grid-cols-2 sm:p-8 lg:grid-cols-4 lg:gap-8">
        {benefits.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white shadow-[0_4px_12px_rgb(230_158_38/0.3)]">
              <Icon className="size-6" strokeWidth={2.2} />
            </span>
            <div>
              <h3 className="font-display text-base font-bold leading-tight">{title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
