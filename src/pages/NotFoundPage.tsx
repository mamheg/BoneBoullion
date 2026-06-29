import { Link } from "react-router-dom"
export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center">
      <h1 className="text-5xl">404</h1>
      <p className="mt-4 text-ink-muted">Страница не найдена.</p>
      <Link to="/" className="mt-6 inline-block text-brand-600 underline">На главную</Link>
    </div>
  )
}
