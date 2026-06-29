import { Link } from 'react-router-dom'
import { Send, Instagram, Mail, Phone } from 'lucide-react'
import { Logo } from './Logo'
import { BRAND, CONTACT } from '@/brand/config'

const columns = [
  {
    title: 'Каталог',
    links: [
      { label: 'Костные бульоны', to: '/catalog/bone' },
      { label: 'Супы', to: '/catalog/soup' },
      { label: 'Бульон для детей', to: '/catalog/kids' },
      { label: 'Наборы', to: '/catalog/set' },
    ],
  },
  {
    title: 'Покупателю',
    links: [
      { label: 'Доставка и оплата', to: '/' },
      { label: 'О бренде', to: '/' },
      { label: 'Контакты', to: '/' },
      { label: 'Профиль', to: '/profile' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface-2">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-ink-muted">
            Костный бульон, сваренный из фермерских костей и овощей по
            традиционному рецепту. {BRAND.tagline}.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={CONTACT.telegram}
              aria-label="Telegram"
              className="flex size-10 items-center justify-center rounded-full bg-white text-ink ring-1 ring-line transition-colors hover:text-brand-600"
            >
              <Send className="size-5" />
            </a>
            <a
              href={CONTACT.instagram}
              aria-label="Instagram"
              className="flex size-10 items-center justify-center rounded-full bg-white text-ink ring-1 ring-line transition-colors hover:text-brand-600"
            >
              <Instagram className="size-5" />
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="font-display text-base font-bold">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-muted transition-colors hover:text-brand-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="font-display text-base font-bold">Контакты</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
            <li>
              <a
                href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`}
                className="flex items-center gap-2 transition-colors hover:text-brand-700"
              >
                <Phone className="size-4" /> {CONTACT.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-2 transition-colors hover:text-brand-700"
              >
                <Mail className="size-4" /> {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-ink-muted sm:flex-row">
          <p>© {new Date().getFullYear()} BONE BOUILLON. Все права защищены.</p>
          <p>Сделано с заботой о здоровье всех поколений.</p>
        </div>
      </div>
    </footer>
  )
}
