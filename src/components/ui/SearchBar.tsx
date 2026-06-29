import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export function SearchBar({ className = '' }: { className?: string }) {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    navigate(q ? `/catalog?q=${encodeURIComponent(q)}` : '/catalog')
  }

  return (
    <form onSubmit={onSubmit} className={`relative ${className}`} role="search">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-muted"
        strokeWidth={2}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Поиск по товарам"
        aria-label="Поиск по товарам"
        className="h-12 w-full rounded-full border border-line bg-white pl-12 pr-12 text-[15px] text-ink placeholder:text-ink-muted focus:border-brand-300 focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Найти"
        className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-700"
      >
        <Search className="size-4" strokeWidth={2.4} />
      </button>
    </form>
  )
}
