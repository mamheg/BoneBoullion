import { Link } from 'react-router-dom'
import { Sun } from 'lucide-react'

interface LogoProps {
  tone?: 'dark' | 'light'
  className?: string
}

/**
 * BONE BOUILLON wordmark — two-line Playfair lockup with a sun mark,
 * matching the storefront mockup. The BB monogram (brand PDF) is reserved
 * for the favicon / PWA icons.
 */
export function Logo({ tone = 'dark', className = '' }: LogoProps) {
  const color = tone === 'light' ? 'text-white' : 'text-ink'
  return (
    <Link
      to="/"
      aria-label="BONE BOUILLON — на главную"
      className={`group inline-flex flex-col leading-[0.92] ${color} ${className}`}
    >
      <span className="flex items-center gap-1.5 font-display text-xl font-bold tracking-tight sm:text-[22px]">
        BONE
        <Sun
          className="size-4 text-brand-600 transition-transform duration-500 group-hover:rotate-90"
          strokeWidth={2.4}
        />
      </span>
      <span className="font-display text-xl font-bold tracking-tight sm:text-[22px]">
        BOUILLON
      </span>
    </Link>
  )
}
