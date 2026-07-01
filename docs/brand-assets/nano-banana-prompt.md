# BONE BOUILLON — master-промпт для nano-banana (генерация всех картинок сайта)

Цель: одним набором указаний получить **реалистичные, настоящие** фото для сайта —
логотип, главную картинку (hero) и карточки товаров. Стиль единый, продукт узнаваемый.

## Что приложить как референс (в чат nano-banana)

1. **Скриншоты Instagram** @bone_bouillon, которые ты уже прислал (реальные банки/пакеты/наклейки — чтобы совпали упаковка, цвет бульона, круглые наклейки, HALAL).
2. **Логотип-исходник** из `assets/brand/` (для стиля вордмарка BONE BOUILLON и «солнышка»).
3. Фирменный цвет — янтарный **#E69E26** (упомянут в промпте текстом).

> Как пользоваться: вставь **«ГЛОБАЛЬНЫЙ СТИЛЬ»** один раз, затем прогоняй по одному блоку из **«СПИСОК КАДРОВ»** (nano-banana делает по одной картинке за раз). Для каждого кадра прикладывай те же референсы — так упаковка и свет останутся консистентными.

---

## ГЛОБАЛЬНЫЙ СТИЛЬ (вставить один раз / в начало каждого кадра)

```
Photorealistic commercial food photography for a premium bone-broth brand
"BONE BOUILLON" (халяль, домашний фермерский костный бульон). Real product photos,
NOT 3D renders, NOT illustrations. Natural soft daylight from the side, gentle
shadows, shallow depth of field. Warm, appetizing palette built around amber/gold
(#E69E26) and clean cream background (#FCF7EC). Clean, uncluttered composition with
generous negative space. The broth is glossy, translucent, golden. Consistent props
across all shots: light stone/wood surface, a few natural accents (garlic clove,
parsley sprig, whole black pepper, pink Himalayan salt). Brand feel: honest, natural,
homemade, healthy. High resolution, crisp focus, professional studio quality.
Packaging must match the reference photos: clear glass jar with golden broth and a
round brand sticker; kraft-paper cup with lid; zip freezer bag. Keep the round
"Bone bouillon / костный бульон" sticker and HALAL mark readable but not distorted.
```

---

## СПИСОК КАДРОВ (по одному = одна картинка)

### 1. Логотип — `public/images/brand/logo.png` (прозрачный фон)
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + Design a clean vector-style wordmark logo "BONE BOUILLON"
in two lines, elegant modern serif, deep amber #E69E26, with a small minimalist sun
icon next to "BONE". Transparent background, centered, crisp edges, no photo, no
mockup — just the logo mark. Also provide a white version for dark backgrounds.
Aspect ratio 1:1.
```

### 2. Hero — `public/images/hero.jpg` (широкий, горизонтальный)
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + Hero shot: a clear glass jar of golden beef bone broth with the
round brand sticker, front and centre on a light stone board. Around it: a small
bowl of steaming broth, garlic, fresh parsley, whole peppercorns, a pinch of pink
salt. Soft morning light, steam rising, cozy premium mood. Lots of clean cream
background space on the LEFT for website headline text overlay. Landscape 16:9.
```

### 3. Костный бульон говяжий, в стекле — `public/images/beef-glass.jpg`
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + Single clear glass jar filled with glossy golden BEEF bone
broth, round brand sticker facing camera, on a light surface with a garlic clove and
parsley. Centered product shot, clean cream background, soft shadow. Square 1:1.
```

### 4. Костный бульон овощной, в стекле — `public/images/veg-glass.jpg`
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + Single clear glass jar of lighter golden VEGETABLE bone broth,
round brand sticker, with carrot, onion and fresh herbs beside it as a hint of
vegetables. Centered, clean cream background. Square 1:1.
```

### 5. Свежезамороженный бульон, пакет — `public/images/frozen-bag.jpg`
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + A transparent zip freezer bag holding a block of frozen golden
bone broth with the round brand sticker, lying on a light surface with a touch of
frost/cold vapor. Clean cream background, appetizing. Square 1:1.
```

### 6. Бульон в кубиках, пакет — `public/images/frozen-cubes.jpg`
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + A transparent zip bag with neat portioned frozen broth CUBES,
round brand sticker on the bag, light frost, on a clean surface. Cream background,
crisp focus. Square 1:1.
```

### 7. Костное масло (Bone oil) — `public/images/bone-oil.jpg`
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + A glass jar of pale creamy solidified BONE MARROW OIL ("костное
масло") with a dark green round brand sticker and HALAL mark, on a light surface with
a searing pan hint and herbs (it's used for frying). Warm, premium. Square 1:1.
```

### 8. (опц.) Крафт-стакан — `public/images/kraft-cup.jpg`
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + A kraft-paper cup with lid and the round red brand sticker,
filled with warm golden broth (lid ajar, steam), on a light surface with herbs.
Clean cream background. Square 1:1.
```

---

## Карта «картинка → слот на сайте»

| Кадр | Файл | Куда идёт |
|---|---|---|
| 1 | `public/images/brand/logo.png` | favicon / PWA-иконки / компонент `Logo` |
| 2 | `public/images/hero.jpg` | Hero на главной (`src/components/home/Hero.tsx`) |
| 3–8 | `public/images/<slug>.jpg` | карточки товаров (`Product.image` в `src/data/catalog.ts`) + карточка товара / корзина |

## Технические заметки

- Формат карточек — **квадрат 1:1** (сетка сайта), hero — **16:9**, лого — **1:1 с прозрачным фоном** (PNG).
- Держать **единый фон и свет** во всех карточках, чтобы сетка выглядела как один комплект.
- Экспорт: JPG (фото) высокого качества; после генерации прогнать через оптимизацию (WebP) при внедрении (шаг U9).
- Реальный ассортимент (см. `instagram-study.md`) — говяжий + овощной бульон в форматах стекло/заморозка/кубики + костное масло. Каталог сайта нужно будет привести к этим позициям (U9).
