import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { JarIllustration } from '@/components/catalog/JarIllustration'

const avatars = ['#E9B84A', '#B5602E', '#5A8A3C', '#C4831C']

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:pt-12">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Copy */}
        <div className="order-2 lg:order-1">
          <p className="eyebrow">100% натурально</p>
          <h1 className="mt-4 text-4xl leading-[1.08] sm:text-5xl xl:text-6xl">
            Костный бульон
            <br />
            для здоровья
            <br />и энергии каждый день
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-muted sm:text-base">
            Наш бульон сварен из фермерских костей и овощей по традиционному
            рецепту. Без добавок и консервантов.
          </p>

          <div className="mt-7">
            <Link to="/catalog">
              <Button size="lg">
                Выбрать бульон
                <ArrowRight className="size-5" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-3">
              {avatars.map((c, i) => (
                <span
                  key={i}
                  className="size-9 rounded-full border-2 border-surface"
                  style={{ background: c }}
                  aria-hidden
                />
              ))}
            </div>
            <p className="text-sm text-ink-muted">
              Более <span className="font-bold text-ink">10 000+</span> довольных
              клиентов
            </p>
          </div>
        </div>

        {/* Visual */}
        <div className="order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-card-lg bg-gradient-to-br from-brand-100 via-brand-200 to-brand-300 p-6 sm:p-10">
            <div
              className="absolute -right-10 -top-10 size-44 rounded-full bg-white/30 blur-2xl"
              aria-hidden
            />
            <div
              className="absolute -bottom-12 -left-8 size-40 rounded-full bg-white/20 blur-2xl"
              aria-hidden
            />
            <JarIllustration
              accent="#E9B84A"
              title="Куриный бульон"
              className="relative mx-auto w-full max-w-sm drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
