import type { ReactNode } from 'react'
import { Check, Download, Menu, MoreHorizontal, MoreVertical, Plus, Share } from 'lucide-react'

/** Browser/platform detection for the PWA install guide. */
export type BrowserId =
  | 'safari'
  | 'chrome-ios'
  | 'firefox-ios'
  | 'yandex-ios'
  | 'opera-ios'
  | 'chrome-android'
  | 'samsung'
  | 'yandex-android'
  | 'opera-android'
  | 'firefox-android'
  | 'miui'
  | 'generic-android'
  | 'generic-desktop'

export function detectBrowser(): BrowserId {
  const ua = navigator.userAgent
  const isIOS = /iphone|ipad|ipod/i.test(ua)
  const isAndroid = /android/i.test(ua)

  if (isIOS) {
    if (/YaBrowser/i.test(ua)) return 'yandex-ios'
    if (/CriOS/i.test(ua)) return 'chrome-ios'
    if (/FxiOS/i.test(ua)) return 'firefox-ios'
    if (/OPiOS/i.test(ua)) return 'opera-ios'
    return 'safari'
  }
  if (isAndroid) {
    if (/YaBrowser/i.test(ua)) return 'yandex-android'
    if (/SamsungBrowser/i.test(ua)) return 'samsung'
    if (/OPR\//i.test(ua)) return 'opera-android'
    if (/Firefox/i.test(ua)) return 'firefox-android'
    if (/MiuiBrowser|XiaoMi/i.test(ua)) return 'miui'
    if (/Chrome/i.test(ua)) return 'chrome-android'
    return 'generic-android'
  }
  return 'generic-desktop'
}

export const browserNames: Record<BrowserId, string> = {
  safari: 'Safari',
  'chrome-ios': 'Chrome',
  'firefox-ios': 'Firefox',
  'yandex-ios': 'Яндекс Браузере',
  'opera-ios': 'Opera',
  'chrome-android': 'Chrome',
  samsung: 'Samsung Internet',
  'yandex-android': 'Яндекс Браузере',
  'opera-android': 'Opera',
  'firefox-android': 'Firefox',
  miui: 'Mi Browser',
  'generic-android': 'вашем браузере',
  'generic-desktop': 'вашем браузере',
}

/** Browsers that fire a native `beforeinstallprompt` (no manual guide needed). */
export function browserSupportsNativeInstall(id: BrowserId): boolean {
  return [
    'chrome-android',
    'samsung',
    'yandex-android',
    'opera-android',
    'firefox-android',
    'generic-android',
    'generic-desktop',
  ].includes(id)
}

export interface InstallStep {
  icon: ReactNode
  title: string
  desc: string
}

const ic = {
  share: <Share className="size-4" />,
  moreH: <MoreHorizontal className="size-4" />,
  moreV: <MoreVertical className="size-4" />,
  menu: <Menu className="size-4" />,
  plus: <Plus className="size-4" />,
  check: <Check className="size-4" />,
  down: <Download className="size-4" />,
}

export function getSteps(browser: BrowserId): InstallStep[] {
  switch (browser) {
    case 'safari':
      return [
        { icon: ic.share, title: 'Поделиться', desc: 'Нажмите кнопку «Поделиться» (⎙) внизу Safari' },
        { icon: ic.plus, title: 'На экран «Домой»', desc: 'Прокрутите список и выберите «На экран Домой»' },
        { icon: ic.check, title: 'Добавить', desc: 'Нажмите «Добавить» в правом верхнем углу' },
      ]
    case 'chrome-ios':
      return [
        { icon: ic.share, title: 'Поделиться', desc: 'Нажмите кнопку «Поделиться» в Chrome' },
        { icon: ic.plus, title: 'На главный экран', desc: 'Выберите «Добавить на главный экран»' },
        { icon: ic.check, title: 'Подтвердить', desc: 'Нажмите «Добавить» в диалоге' },
      ]
    case 'yandex-ios':
      return [
        { icon: ic.moreH, title: 'Меню', desc: 'Нажмите «⋯» в нижней части Яндекс Браузера' },
        { icon: ic.plus, title: 'На экран Домой', desc: 'Выберите «Добавить на экран Домой»' },
        { icon: ic.check, title: 'Готово', desc: 'Нажмите «Добавить» для подтверждения' },
      ]
    case 'firefox-ios':
    case 'opera-ios':
      return [
        { icon: ic.share, title: 'Поделиться', desc: 'Откройте меню «Поделиться» браузера' },
        { icon: ic.plus, title: 'На экран Домой', desc: 'Выберите «На экран Домой»' },
        { icon: ic.check, title: 'Добавить', desc: 'Подтвердите добавление' },
      ]
    default:
      return [
        { icon: ic.moreV, title: 'Меню браузера', desc: 'Откройте меню (обычно «⋮» или «⋯»)' },
        { icon: ic.plus, title: 'Добавить', desc: 'Найдите «Добавить на главный экран» или «Установить»' },
        { icon: ic.check, title: 'Готово', desc: 'Подтвердите добавление' },
      ]
  }
}
