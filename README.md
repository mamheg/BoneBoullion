# BONE BOUILLON — storefront (frontend)

Витрина бренда **BONE BOUILLON** (костный бульон, «100% натурально») — PWA-магазин
по типу ВкусВилл для одного бренда. Это **фронтенд-этап**: интерфейс полностью
рабочий, данные идут через мок-слой `services/api.ts`, который заменяется на
реальные вызовы `/api/*` при подключении бэкенда (FastAPI) без изменений во фронте.

## Стек

- React 19 + Vite + TypeScript
- Tailwind CSS v4 (дизайн-токены в `src/styles/index.css`)
- react-router · TanStack Query · React Context
- framer-motion · lucide-react
- vite-plugin-pwa (installable, offline)
- Шрифты: Playfair Display (заголовки) + Manrope (UI), с кириллицей

## Команды

```bash
npm install      # установить зависимости
npm run dev      # дев-сервер (Vite)
npm run build    # продакшен-сборка (tsc + vite + PWA)
npm run preview  # предпросмотр сборки
npm run lint     # проверка типов (tsc --noEmit)
```

## Структура

```
src/
  app/          провайдеры + роутер
  components/
    layout/     AnnouncementBar, Header, Footer, MobileBottomNav, Logo
    catalog/    ProductCard, ProductGrid, CategoryList/Chips, JarIllustration
    home/       Hero, BenefitsBar, PopularSection, NewsletterSection
    cart/        CartDrawer, CartLineItem, CartSummary, FreeDeliveryBar
    ui/         Button, Badge, SearchBar, QuantityStepper, Reveal
  context/      CartContext, FavoritesContext, UIContext
  hooks/        useCatalog, useCartLines
  pages/        Home, Catalog, Product, Cart, Checkout, Favorites, Profile, 404
  services/     api.ts (мок-слой → будущий бэкенд)
  data/         catalog.ts (мок-каталог)
  brand/        config.ts (константы бренда)
  types.ts
```

## Экраны

Главная · Каталог (+ категория) · Карточка товара · Корзина (+ drawer) ·
Оформление заказа (3 шага) · Избранное · Профиль · 404.

## Дальше (бэкенд-этап)

- FastAPI + SQLAlchemy + PostgreSQL + Alembic
- Реальные каталог/остатки, заказы со статусами, оплата, доставка/слоты, касса
- Авторизация по телефону, лояльность

Бренд-ассеты — в `assets/brand/`. План — в `docs/frontend-plan.md`.
