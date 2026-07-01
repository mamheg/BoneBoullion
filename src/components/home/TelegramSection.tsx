import { Send, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CONTACT } from '@/brand/config'

export function TelegramSection() {
  return (
    <section className="mx-auto mt-12 max-w-7xl px-4 sm:mt-16">
      <div className="grid items-center gap-8 overflow-hidden rounded-card-lg bg-surface-2 p-8 ring-1 ring-line/60 sm:p-12 lg:grid-cols-2">
        <div className="flex items-start gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-[0_6px_16px_rgb(230_158_38/0.32)]">
            <Send className="size-7" strokeWidth={2} />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Мы в Telegram
            </h2>
            <p className="mt-2 max-w-md text-ink-muted">
              Полезные рецепты, новинки и специальные предложения BONE BOUILLON —
              первыми в нашем канале.
            </p>
          </div>
        </div>

        <div className="lg:justify-self-end">
          <a href={CONTACT.telegramChannel} target="_blank" rel="noopener noreferrer">
            <Button size="lg">
              <Send className="size-5" />
              Подписаться на канал
              <ArrowRight className="size-5" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
