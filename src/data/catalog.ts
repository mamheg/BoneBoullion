import type { Category, Product } from '@/types'

/**
 * Mock catalog for the frontend-first phase. Served through `services/api.ts`,
 * which is swapped for real `/api/*` calls once the backend lands.
 */

export const categories: Category[] = [
  { id: 'all', name: 'Весь ассортимент', count: 12 },
  { id: 'bone', name: 'Костные бульоны', count: 5 },
  { id: 'soup', name: 'Супы', count: 3 },
  { id: 'kids', name: 'Бульон для детей', count: 2 },
  { id: 'set', name: 'Наборы', count: 2 },
]

const composition =
  'Фермерские кости, фильтрованная вода, морковь, лук, сельдерей, петрушка, лавровый лист, морская соль. Без добавок и консервантов.'

export const products: Product[] = [
  {
    id: 'chicken',
    slug: 'kurinyy-bulon',
    name: 'Куриный бульон',
    description:
      'Наваристый куриный бульон на медленном огне 24 часа. Золотистый вкус и максимум пользы для иммунитета.',
    price: 690,
    volume: '480 мл',
    image: '',
    accent: '#E9B84A',
    categoryId: 'bone',
    badges: ['hit'],
    inStock: true,
    composition,
    nutrition: { calories: 38, protein: 7.2, fat: 0.9, carbs: 0.4 },
  },
  {
    id: 'beef',
    slug: 'govyazhiy-bulon',
    name: 'Говяжий бульон',
    description:
      'Насыщенный говяжий бульон из мозговой кости. Глубокий вкус, коллаген и аминокислоты для суставов.',
    price: 750,
    volume: '480 мл',
    image: '/images/products/beef.jpg',
    accent: '#B5602E',
    categoryId: 'bone',
    badges: [],
    inStock: true,
    composition,
    nutrition: { calories: 44, protein: 8.1, fat: 1.4, carbs: 0.3 },
  },
  {
    id: 'turkey',
    slug: 'bulon-iz-indeyki',
    name: 'Бульон из индейки',
    description:
      'Лёгкий диетический бульон из индейки. Деликатный вкус и высокое содержание белка.',
    price: 720,
    volume: '480 мл',
    image: '',
    accent: '#E3C572',
    categoryId: 'bone',
    badges: [],
    inStock: true,
    composition,
    nutrition: { calories: 36, protein: 7.6, fat: 0.7, carbs: 0.3 },
  },
  {
    id: 'lamb',
    slug: 'baraniy-bulon',
    name: 'Бараний бульон',
    description:
      'Согревающий бараний бульон с восточными нотами. Богат железом и цинком.',
    price: 790,
    volume: '480 мл',
    image: '/images/products/lamb.jpg',
    accent: '#A24E2A',
    categoryId: 'bone',
    badges: [],
    inStock: true,
    composition,
    nutrition: { calories: 48, protein: 7.9, fat: 2.1, carbs: 0.3 },
  },
  {
    id: 'fish',
    slug: 'rybnyy-bulon',
    name: 'Рыбный бульон',
    description:
      'Прозрачный рыбный бульон из дикой рыбы. Источник йода и омега-3.',
    price: 760,
    volume: '480 мл',
    image: '',
    accent: '#D9C9A3',
    categoryId: 'bone',
    badges: ['new'],
    inStock: true,
    composition,
    nutrition: { calories: 33, protein: 6.8, fat: 0.6, carbs: 0.2 },
  },
  {
    id: 'pumpkin-soup',
    slug: 'krem-sup-tykvennyy',
    name: 'Крем-суп тыквенный',
    description:
      'Бархатистый крем-суп из запечённой тыквы на курином бульоне. Готов к подаче.',
    price: 540,
    volume: '400 мл',
    image: '',
    accent: '#E68A2E',
    categoryId: 'soup',
    badges: [],
    inStock: true,
    composition:
      'Куриный бульон, тыква, морковь, лук, сливки, мускатный орех, морская соль.',
    nutrition: { calories: 62, protein: 2.1, fat: 3.4, carbs: 6.2 },
  },
  {
    id: 'chicken-noodle',
    slug: 'kurinyy-sup-lapsha',
    name: 'Куриный суп с лапшой',
    description:
      'Домашний куриный суп с лапшой и овощами. Тёплый вкус из детства.',
    price: 560,
    volume: '450 мл',
    image: '/images/products/chicken-noodle.jpg',
    accent: '#E9B84A',
    categoryId: 'soup',
    badges: ['hit'],
    inStock: true,
    composition:
      'Куриный бульон, мясо курицы, лапша, морковь, лук, зелень, морская соль.',
    nutrition: { calories: 58, protein: 4.2, fat: 1.8, carbs: 6.6 },
  },
  {
    id: 'mushroom-soup',
    slug: 'gribnoy-krem-sup',
    name: 'Грибной крем-суп',
    description:
      'Густой крем-суп из белых грибов и шампиньонов на овощном бульоне.',
    price: 580,
    volume: '400 мл',
    image: '',
    accent: '#9C8866',
    categoryId: 'soup',
    badges: [],
    inStock: true,
    composition:
      'Овощной бульон, белые грибы, шампиньоны, лук, сливки, тимьян, морская соль.',
    nutrition: { calories: 66, protein: 2.8, fat: 4.1, carbs: 5.4 },
  },
  {
    id: 'kids-chicken',
    slug: 'detskiy-kurinyy-bulon',
    name: 'Куриный бульон для детей',
    description:
      'Нежный куриный бульон без соли и специй — специально для малышей от 1 года.',
    price: 690,
    volume: '480 мл',
    image: '/images/products/kids-chicken.jpg',
    accent: '#F0D58A',
    categoryId: 'kids',
    badges: ['new'],
    inStock: true,
    composition:
      'Фермерская курица, фильтрованная вода, морковь, кабачок. Без соли, без специй, без добавок.',
    nutrition: { calories: 32, protein: 6.4, fat: 0.6, carbs: 0.4 },
  },
  {
    id: 'kids-turkey',
    slug: 'detskiy-bulon-indeyka',
    name: 'Бульон из индейки для детей',
    description:
      'Гипоаллергенный бульон из индейки для первого прикорма и детского меню.',
    price: 690,
    volume: '480 мл',
    image: '/images/products/kids-turkey.jpg',
    accent: '#EBD79A',
    categoryId: 'kids',
    badges: [],
    inStock: true,
    composition:
      'Фермерская индейка, фильтрованная вода, морковь, кабачок. Без соли, без специй, без добавок.',
    nutrition: { calories: 30, protein: 6.6, fat: 0.5, carbs: 0.3 },
  },
  {
    id: 'set-classic',
    slug: 'nabor-bulonov',
    name: 'Набор бульонов «Классика»',
    description:
      'Три фирменных бульона: куриный, говяжий и из индейки. Идеально на неделю.',
    price: 1990,
    oldPrice: 2160,
    volume: '3 × 480 мл',
    image: '/images/products/set-classic.jpg',
    accent: '#E69E26',
    categoryId: 'set',
    badges: ['sale'],
    inStock: true,
    composition: 'Куриный, говяжий и бульон из индейки. Без добавок и консервантов.',
  },
  {
    id: 'set-wellness',
    slug: 'nabor-wellness',
    name: 'Набор «Wellness»',
    description:
      'Пять бульонов и крем-суп для полного перезапуска. Курс здоровья на каждый день.',
    price: 3490,
    oldPrice: 3800,
    volume: '6 × 480 мл',
    image: '/images/products/set-wellness.jpg',
    accent: '#C4831C',
    categoryId: 'set',
    badges: ['sale'],
    inStock: true,
    composition: 'Ассорти бульонов и крем-супов. Без добавок и консервантов.',
  },
]
