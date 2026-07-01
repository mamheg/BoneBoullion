import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { browserNames, getSteps, type BrowserId } from './browser'

export function IosInstallModal({
  browser,
  isOpen,
  onClose,
}: {
  browser: BrowserId
  isOpen: boolean
  onClose: () => void
}) {
  const steps = getSteps(browser)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div
            role="dialog"
            aria-label="Как установить приложение"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0 }}
            className="relative m-3 w-full max-w-md rounded-card-lg bg-card p-6 shadow-pop"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <X className="size-5" />
            </button>

            <h2 className="font-display text-xl font-bold">Установить на экран</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Добавьте BONE BOUILLON в {browserNames[browser]} — быстрый доступ как у обычного приложения.
            </p>

            <ol className="mt-5 space-y-3">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
                    {step.icon}
                  </span>
                  <div>
                    <p className="font-semibold leading-tight">{step.title}</p>
                    <p className="mt-0.5 text-sm text-ink-muted">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
