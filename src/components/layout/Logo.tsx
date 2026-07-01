import { Link } from 'react-router-dom'

interface LogoProps {
  tone?: 'dark' | 'light'
  className?: string
}

/** Brand logo (client-provided). Amber lockup on light surfaces, white on dark. */
export function Logo({ tone = 'dark', className = '' }: LogoProps) {
  const src = tone === 'light' ? '/images/brand/logo-white.png' : '/images/brand/logo.png'
  return (
    <Link
      to="/"
      aria-label="BONBULBIO — на главную"
      className={`inline-flex items-center ${className}`}
    >
      <img
        src={src}
        alt="BONBULBIO"
        className="h-10 w-auto sm:h-11"
      />
    </Link>
  )
}
