# BONE BOUILLON — план разработки фронтенда (этап 1)

Бренд: **BONE BOUILLON** (костный бульон, «100% натурально»). Источник дизайна — присланный макет главной (desktop + mobile) и лого-ассеты. Бэкенд на этом этапе — моки за слоем `api.ts` (контракты сразу «по-взрослому», чтобы потом подключить FastAPI без переделки фронта).

## 0. Визуальный тезис / контент / интеракции (чекпоинт перед кодом)

- **Visual thesis:** тёплый «фермерский wellness» — кремово-жёлтые поверхности, элегантные серифные заголовки (Playfair), чистый округлый гротеск в UI (Manrope), один янтарный акцент (#E69E26), много воздуха, мягкие тени, фуд-фотография как главный визуальный якорь.
- **Content (главная, по макету):** промо-бар → хедер → hero (обещание + CTA + соцдоказательство + фото банки) → полоса преимуществ (4) → каталог (категории-сайдбар + «Популярное» сетка) → newsletter → футер. Мобайл: хедер с бургером + нижняя таб-навигация.
- **Interaction (3 ключевых):** (1) entrance-каскад в hero — поочерёдный fade/slide-up eyebrow→H1→lede→CTA + scale-in фото; (2) карточка товара — lift + zoom фото + «поп» сердечка при добавлении в избранное; (3) корзина — slide-in drawer + bump-анимация бейджа количества. Плюс мягкий scroll-reveal секций.

## 1. Технический фундамент

Стек (по согласованию, см. memory `boneboullion-project`):
- React 19 + Vite + TypeScript
- Tailwind CSS (design tokens через CSS-переменные)
- react-router (реальные маршруты)
- TanStack Query (серверные данные: каталог/товары/категории)
- Context (клиентское состояние: корзина/избранное/UI)
- framer-motion (анимации), lucide-react (иконки)
- vite-plugin-pwa (PWA, оффлайн, установка)

## 2. Дизайн-токены (из макета + #E69E26)

```
Цвета
--brand-600  #E69E26   // основной акцент: CTA, цены-кнопки, активные состояния
--brand-400  #F5C842   // ярко-жёлтый: промо-бар, круглые иконки-плашки
--brand-100  #FBF4E4   // мягкие янтарные подложки
--surface    #FCF7EC   // фон страницы (тёплый кремовый)
--surface-2  #FAF3E0   // hero/секции
--card       #FFFFFF
--text       #2B2A28   // тёплый near-black
--text-muted #6B6A66
--border     #ECE7DC
--success    (для «в наличии»), --danger (ошибки)

Типографика
--font-display: "Playfair Display", serif;  // H1–H3, цены крупно
--font-sans:    "Manrope", sans-serif;       // body, UI, лейблы
eyebrow: Manrope, uppercase, letter-spacing .08em, --brand-600

Радиусы:  кнопки/чипы — pill (9999px); карточки — 20px; крупные карточки — 24px
Тени:     мягкие, низкие (card: 0 4px 20px rgba(0,0,0,.05))
Сетка:    контейнер ~1280px; product grid: 4 кол. desktop / 2 mobile
```

Логотип BONE BOUILLON собираем как компонент `<Logo/>` (вордмарк Playfair в две строки + иконка-«солнышко», как в макете); монограмму BB из PDF используем для favicon/PWA-иконок. Исходники в `assets/brand/`.

## 3. Структура проекта

```
src/
  app/            // роутер, провайдеры, layout
  components/
    ui/           // Button, IconButton, Badge, Input, Price, Avatar, QuantityStepper
    layout/       // AnnouncementBar, Header, MobileHeader, MobileBottomNav, Footer, Logo
    catalog/      // ProductCard, ProductGrid, CategoryList, SectionHeader, Filters
    home/         // Hero, BenefitsBar, PopularSection, NewsletterSection
    cart/         // CartDrawer, CartLineItem, CartSummary
  pages/          // Home, Catalog, Product, Cart, Checkout, Favorites, Profile, NotFound
  context/        // CartContext, FavoritesContext, UIContext
  services/       // api.ts (единый интерфейс) + mock/ (моковая реализация)
  data/           // мок-каталог (товары, категории) — позже отдаёт бэк
  hooks/          // useProducts, useCategories, useProduct, useCart
  brand/          // tokens.ts, seo.ts, contact.ts
  types.ts
  styles/         // tailwind + css-переменные + шрифты
```

## 4. Инвентарь компонентов (маппинг на макет)

- **layout:** `AnnouncementBar` (промо «Бесплатная доставка от 3 000 ₽»), `Header` (Logo · кнопка «Каталог» · `SearchBar` · Избранное/Профиль/Корзина с бейджем), `MobileHeader` (бургер · лого · корзина + строка поиска), `MobileBottomNav` (Главная/Каталог/Избранное/Профиль/Корзина), `Footer`.
- **home:** `Hero` (Eyebrow, H1, lede, CTA, `SocialProof` стек аватаров, `HeroImage`), `BenefitsBar` (4× `FeatureItem`: иконка-чип + заголовок + подпись), `PopularSection` (`SectionHeader` + `CategoryList` сайдбар + `ProductGrid`), `NewsletterSection`.
- **catalog:** `ProductCard` (badge Хит/Новинка, сердечко, фото, название, объём, цена, круглая кнопка «+»), `ProductGrid`, `CategoryList` (с count + активным состоянием), `Filters`.
- **cart:** `CartDrawer`, `CartLineItem`, `CartSummary`.
- **ui:** `Button` (primary/secondary/ghost), `IconButton`, `Badge`, `Input`, `Price`, `Avatar`, `QuantityStepper`.

## 5. Маршруты (полный скелет витрины)

```
/                      Home (по макету)
/catalog               Каталог (сетка + категории/фильтры)
/catalog/:category     Категория
/product/:slug         Карточка товара
/cart                  Корзина (+ CartDrawer как оверлей)
/checkout              Оформление (шаги: контакты → доставка → подтверждение) — UI, submit мок
/favorites             Избранное
/profile               Профиль (заказы/бонусы — заглушки под бэк)
*                      404
```

## 6. Данные и состояние

- **`types.ts`:** `Product { id, slug, name, description, price, oldPrice?, volume, weight?, image, images[], categoryId, badges[], inStock, nutrition? }`, `Category { id, name, count }`, `CartItem`, `OrderDraft` (контакты, доставка/самовывоз, позиции, суммы) — модель сразу с заделом под доставку/слоты.
- **`api.ts`:** единый интерфейс (`getProducts`, `getCategories`, `getProduct`, `createOrder`, `subscribe`…). Сейчас бэк — мок-реализация из `src/data`; позже меняем тело на `fetch('/api/*')`, токен в заголовке. Фронт не трогаем.
- **TanStack Query:** кэш/ревалидация серверных данных (каталог, товар, остатки).
- **Context:** `CartContext` (позиции, кол-во, суммы, скидки; persist в localStorage, позже sync с сервером), `FavoritesContext`, `UIContext` (drawers/modals/поиск).

## 7. PWA

manifest (theme #E69E26, name «BONE BOUILLON»), иконки 192/512 + maskable из лого, service worker (network-first для навигации/API GET, cache-first для статики), оффлайн-фолбэк, баннер установки (вкл. iOS-инструкцию).

## 8. Порядок работ (милстоуны)

- **M0 — Каркас:** scaffold (Vite+TS), Tailwind + токены + подключение Playfair/Manrope, `<Logo/>`, генерация PWA-иконок из PDF, базовый роутер и провайдеры.
- **M1 — Оболочка:** AnnouncementBar, Header (desktop+mobile), MobileBottomNav, Footer, layout, активные состояния навигации.
- **M2 — Главная (pixel-match макета):** Hero, BenefitsBar, CategoryList + PopularSection (ProductCard/Grid), NewsletterSection. Адаптив desktop/tablet/mobile по двум присланным раскладкам.
- **M3 — Каталог + товар:** страница каталога с категориями/фильтрами, ProductCard-состояния, карточка товара `/product/:slug`.
- **M4 — Корзина + чекаут:** CartDrawer + /cart, многошаговый /checkout (UI, submit через api.ts-мок, экран подтверждения).
- **M5 — Избранное + профиль:** /favorites, /profile с разделами заказы/бонусы (заглушки под бэк).
- **M6 — Полировка:** framer-motion (3 ключевые интеракции + scroll-reveal), PWA, визуальная верификация (скриншоты vs макет), a11y-проход (семантика, фокус, контраст WCAG AA).

## 9. Верификация

После M2 и в конце — скриншот-проход (Playwright/браузерные инструменты, если доступны; иначе self-review по litmus-чеклисту дизайн-скилла): соответствие макету, читаемость, фокус-состояния, отсутствие «AI-slop».

## Открытые вопросы (не блокируют старт)

- Финальная связка брендов BONE BOUILLON ↔ BONBULBIO (зонтик/линейка). Витрина — BONE BOUILLON.
- Нужен векторный лого BONE BOUILLON (сейчас собираем как компонент из текста+иконки; для печати/иконок может понадобиться SVG от заказчика).
- Точный состав каталога и поля товара (объём/вес/КБЖУ/состав) — для мок-данных возьмём из макета (12 SKU, 4 категории) и расширим.
