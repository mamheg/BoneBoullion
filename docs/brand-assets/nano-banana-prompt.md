# BONE BOUILLON — master-промпт для nano-banana (все картинки сайта)

Цель: получить **реалистичные фото** для КАЖДОГО товара, который сейчас есть на сайте
(каталог `src/data/catalog.ts`), плюс логотип и главную картинку (hero). Стиль единый,
упаковка — как на реальных фото Instagram @bone_bouillon.

## Что приложить как референс (в чат nano-banana)

1. **Скриншоты Instagram @bone_bouillon** (реальная упаковка: стеклянная банка с золотистым бульоном, круглая наклейка «Bone bouillon / костный бульон», значок HALAL) — чтобы тара и наклейка совпали.
2. **Логотип-исходник** из `assets/brand/`.
3. Фирменный цвет — янтарный **#E69E26**.

> nano-banana делает по одной картинке за раз. Вставь **«ГЛОБАЛЬНЫЙ СТИЛЬ»** в начало, затем прогоняй по одному блоку из **«СПИСОК КАДРОВ»**. К каждому кадру прикладывай те же референсы — так упаковка, свет и фон останутся одинаковыми во всей сетке.

---

## ГЛОБАЛЬНЫЙ СТИЛЬ (вставлять в начало каждого кадра)

```
Photorealistic commercial food photography for a premium bone-broth brand
"BONE BOUILLON" (halal, homemade farm-style broth). REAL product photos, NOT 3D
renders, NOT illustrations. Natural soft daylight from the side, gentle shadows,
shallow depth of field, glossy translucent broth. Warm appetizing palette around
amber/gold (#E69E26) on a clean cream background (#FCF7EC). Uncluttered, centered
composition with generous negative space, consistent light stone surface and the
same soft props across every shot (garlic, parsley, whole peppercorns, pink salt).
Packaging matches the reference photos: a clear glass jar of broth with a round
"Bone bouillon / костный бульон" sticker and a small HALAL mark, sticker readable and
undistorted. Professional studio quality, crisp focus, high resolution. Keep the SAME
jar shape, lighting and background in all shots so they form one cohesive product set.
```

---

## СПИСОК КАДРОВ

### Логотип — `public/images/brand/logo.png` (прозрачный фон, 1:1)
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + Clean wordmark logo "BONE BOUILLON" in two lines, elegant modern
serif, deep amber #E69E26, small minimalist sun icon next to "BONE". Transparent
background, crisp vector-like edges, no photo/mockup. Also output a white version for
dark backgrounds. 1:1.
```

### Hero — `public/images/hero.jpg` (16:9)
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + Hero shot: a clear glass jar of golden bone broth with the round
brand sticker, centre, on a light stone board; a small bowl of steaming broth, garlic,
parsley, peppercorns, pink salt around it. Soft morning light, rising steam, cozy
premium mood. Keep the LEFT third as clean cream background for website headline text.
16:9 landscape.
```

### Карточки товаров (квадрат 1:1 каждая) — по каждой позиции каталога

**1. Куриный бульон — `public/images/products/chicken.jpg`**
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + Glass jar of clear GOLDEN CHICKEN bone broth, brand sticker to
camera, a small piece of chicken and parsley beside it. Centered, cream background. 1:1.
```
**2. Говяжий бульон — `public/images/products/beef.jpg`**
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + Glass jar of rich amber-brown BEEF bone broth, brand sticker,
a beef marrow bone and parsley beside it. Centered, cream background. 1:1.
```
**3. Бульон из индейки — `public/images/products/turkey.jpg`**
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + Glass jar of light golden TURKEY broth, brand sticker, a turkey
cut and herbs beside it. Centered, cream background. 1:1.
```
**4. Бараний бульон — `public/images/products/lamb.jpg`**
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + Glass jar of deep amber LAMB broth, brand sticker, warm oriental
spices (cumin, bay leaf) beside it. Centered, cream background. 1:1.
```
**5. Рыбный бульон — `public/images/products/fish.jpg`**
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + Glass jar of pale clear FISH broth, brand sticker, a piece of
white fish, lemon and dill beside it. Centered, cream background. 1:1.
```
**6. Крем-суп тыквенный — `public/images/products/pumpkin-soup.jpg`**
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + A bowl of creamy ORANGE PUMPKIN soup with a swirl of cream and
pumpkin seeds, next to a matching jar with brand sticker. Cream background. 1:1.
```
**7. Куриный суп с лапшой — `public/images/products/chicken-noodle.jpg`**
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + A bowl of CHICKEN NOODLE soup (noodles, carrot, herbs, chicken),
next to a matching jar with brand sticker. Cream background. 1:1.
```
**8. Грибной крем-суп — `public/images/products/mushroom-soup.jpg`**
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + A bowl of creamy beige MUSHROOM soup with sautéed mushroom slices
and thyme, next to a matching jar with brand sticker. Cream background. 1:1.
```
**9. Куриный бульон для детей — `public/images/products/kids-chicken.jpg`**
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + Glass jar of very light gentle CHICKEN broth for babies (no salt),
brand sticker, soft pastel styling, a carrot and zucchini beside it, tender caring
mood. Centered, cream background. 1:1.
```
**10. Бульон из индейки для детей — `public/images/products/kids-turkey.jpg`**
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + Glass jar of very light gentle TURKEY broth for babies (no salt),
brand sticker, soft pastel styling, carrot and zucchini beside it. Centered, cream
background. 1:1.
```
**11. Набор «Классика» — `public/images/products/set-classic.jpg`**
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + THREE glass jars together (chicken, beef, turkey broths), all with
brand stickers, arranged as a gift set on a light surface with herbs and garlic.
Centered, cream background. 1:1.
```
**12. Набор «Wellness» — `public/images/products/set-wellness.jpg`**
```
[ГЛОБАЛЬНЫЙ СТИЛЬ] + SIX jars/cups assortment of broths and a soup, arranged in an open
kraft gift box with a brand tag, premium wellness set look. Cream background. 1:1.
```

---

## Карта «картинка → слот на сайте»

| Кадр | Файл | Куда идёт (в коде) |
|---|---|---|
| Логотип | `public/images/brand/logo.png` | favicon / PWA-иконки / компонент `Logo` |
| Hero | `public/images/hero.jpg` | `src/components/home/Hero.tsx` |
| 1–12 | `public/images/products/<id>.jpg` | поле `Product.image` в `src/data/catalog.ts` (id совпадает: chicken, beef, turkey, lamb, fish, pumpkin-soup, chicken-noodle, mushroom-soup, kids-chicken, kids-turkey, set-classic, set-wellness) → карточки, страница товара, корзина |

## Технические заметки

- Карточки — **1:1**, hero — **16:9**, лого — **1:1 PNG с прозрачным фоном**.
- **Единый фон, свет и форма банки** во всех 12 карточках — это критично, иначе сетка развалится.
- Имена файлов = **id товара** из каталога (см. таблицу), чтобы внедрение (шаг U9) было простым: `image: '/images/products/<id>.jpg'`.
- Экспорт JPG высокого качества; при внедрении прогнать в WebP.
- Реальная упаковка бренда — на скринах Instagram (`instagram-study.pdf`): та же банка, круглая наклейка, HALAL. Держись этого стиля.
