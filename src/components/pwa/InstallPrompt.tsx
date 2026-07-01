import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Smartphone, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { IosInstallModal } from './IosInstallModal'
import { browserSupportsNativeInstall, detectBrowser } from './browser'

const DISMISS_KEY = 'bb_install_dismissed'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  // iOS Safari
  (window.navigator as { standalone?: boolean }).standalone === true

const wasDismissed = () => {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * "Установить BONE BOUILLON на экран" card, mirroring AmoreSample's InstallHint:
 * native beforeinstallprompt on Chromium/Android, manual guide (IosInstallModal)
 * elsewhere. Hidden when already installed or previously dismissed.
 */
export function InstallPrompt() {
  const [browser] = useState(detectBrowser)
  const [visible, setVisible] = useState(false)
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const needsManualGuide = !browserSupportsNativeInstall(browser)

  useEffect(() => {
    if (isStandalone() || wasDismissed()) return

    // Manual-guide browsers (iOS Safari etc.) have no native event — show after a beat.
    let timer: ReturnType<typeof setTimeout> | undefined
    if (needsManualGuide) {
      timer = setTimeout(() => setVisible(true), 1500)
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    const onInstalled = () => {
      setVisible(false)
      setInstallEvent(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      if (timer) clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [needsManualGuide])

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  const install = async () => {
    if (needsManualGuide) {
      setModalOpen(true)
      return
    }
    if (!installEvent) return
    await installEvent.prompt()
    const choice = await installEvent.userChoice
    if (choice.outcome === 'accepted') setVisible(false)
    setInstallEvent(null)
  }

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className="fixed inset-x-3 bottom-24 z-40 rounded-card bg-card p-4 shadow-pop ring-1 ring-line/60 lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-[360px]"
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="Закрыть"
              className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <X className="size-4" />
            </button>

            <div className="flex gap-3 pr-6">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-[0_6px_16px_rgb(230_158_38/0.32)]">
                {needsManualGuide ? <Smartphone className="size-5" /> : <Download className="size-5" />}
              </span>
              <div className="min-w-0">
                <p className="font-display text-base font-bold leading-tight">
                  Установить BONE BOUILLON
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  Добавьте магазин на экран — открывается как приложение, работает офлайн.
                </p>
                <Button size="sm" className="mt-3" onClick={install}>
                  <Download className="size-4" />
                  {needsManualGuide ? 'Как установить' : 'Установить'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <IosInstallModal browser={browser} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
