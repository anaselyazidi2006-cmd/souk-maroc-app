import type { Product, Category, Review, Listing, Notification } from './types';

export const CATEGORIES: Category[] = [
  { id: 'all',       label: 'All',         labelAr: 'الكل',          emoji: '🏪', count: 48 },
  { id: 'handcraft', label: 'Handcraft',   labelAr: 'صناعة يدوية',   emoji: '🏺', count: 12 },
  { id: 'spices',    label: 'Spices',      labelAr: 'التوابل',       emoji: '🌿', count: 8  },
  { id: 'leather',   label: 'Leather',     labelAr: 'الجلود',        emoji: '👜', count: 9  },
  { id: 'carpets',   label: 'Carpets',     labelAr: 'السجاد',        emoji: '🪢', count: 6  },
  { id: 'jewelry',   label: 'Jewelry',     labelAr: 'المجوهرات',     emoji: '💍', count: 7  },
  { id: 'argan',     label: 'Argan',       labelAr: 'منتجات الأرغان',emoji: '🫒', count: 6  },
  { id: 'ceramics',  label: 'Ceramics',    labelAr: 'الخزف',         emoji: '🏺', count: 5  },
];

export const LISTING_TYPES = [
  { id: 'all',     label: 'All',      emoji: '🗂️' },
  { id: 'sale',    label: 'للبيع',   emoji: '🏷️' },
  { id: 'service', label: 'خدمة',    emoji: '🔧' },
  { id: 'job',     label: 'وظيفة',   emoji: '💼' },
  { id: 'rent',    label: 'للكراء',  emoji: '🏠' },
];

export const MOROCCAN_CITIES = [
  'All Cities',
  // الدار البيضاء الكبرى
  'Casablanca', 'Mohammedia', 'Berrechid', 'El Jadida', 'Settat', 'Ben Guerir',
  // الرباط - سلا - القنيطرة
  'Rabat', 'Salé', 'Temara', 'Kenitra', 'Skhirat', 'Tiflet',
  // فاس - مكناس
  'Fez', 'Meknes', 'Ifrane', 'Khenifra', 'Errachidia',
  // مراكش - آسفي
  'Marrakech', 'Safi', 'Essaouira', 'El Kelaa des Sraghna', 'Chichaoua',
  // طنجة - تطوان - الحسيمة
  'Tangier', 'Tetouan', 'Al Hoceima', 'Chefchaouen', 'Larache', 'Asilah', 'Fnideq',
  // الشرق
  'Oujda', 'Nador', 'Berkane', 'Taza', 'Taourirt', 'Guercif',
  // سوس - ماسة
  'Agadir', 'Inezgane', 'Taroudant', 'Tiznit', 'Ouarzazate', 'Zagora',
  // درعة - تافيلالت
  'Taliouine', 'Midelt', 'Tinghir', 'Rissani', 'Erfoud',
  // بني ملال - خنيفرة
  'Beni Mellal', 'Khouribga', 'Fqih Ben Salah', 'Azilal',
  // كلميم - وادي نون
  'Guelmim', 'Tan-Tan', 'Sidi Ifni',
  // الداخلة - وادي الذهب
  'Dakhla', 'Boujdour',
  // العيون - الساقية الحمراء
  'Laayoune', 'Smara',
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'like',            title: 'إعجاب جديد ❤️',         body: 'أعجب كريم التاهيري بإعلانك',                        time: 'دقيقتان',  read: false, icon: '❤️' },
  { id: 'n2', type: 'reply',           title: 'تعليق جديد 💬',         body: 'علق أحدهم على إعلانك: "واش ممكن تبعت لكازا؟"',      time: '15 دقيقة', read: false, icon: '💬' },
  { id: 'n3', type: 'new_listing',     title: 'إعلان جديد قريب منك 📍', body: 'إعلان جديد في مراكش: "دروس خصوصية عربية"',         time: '1 ساعة',   read: false, icon: '📍' },
  { id: 'n4', type: 'message',         title: 'رسالة جديدة 📩',         body: 'أحد المستخدمين أرسل لك رسالة حول إعلانك',           time: '2 ساعة',   read: true,  icon: '📩' },
  { id: 'n5', type: 'service_request', title: 'طلب خدمة 🔧',            body: 'مستخدم من الرباط يطلب خدمة التطريز التقليدي',       time: '3 ساعات',  read: true,  icon: '🔧' },
  { id: 'n6', type: 'like',            title: 'إعجاب جديد ❤️',         body: 'أعجب 12 شخصاً بإعلانك',                              time: 'أمس',      read: true,  icon: '❤️' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1', name: 'Handmade Moroccan Tagine', nameAr: 'طاجين مغربي يدوي الصنع',
    price: 280, originalPrice: 350,
    image: 'https://images.pexels.com/photos/6287447/pexels-photo-6287447.jpeg?auto=compress&cs=tinysrgb&w=600',
    gallery: ['https://images.pexels.com/photos/6287447/pexels-photo-6287447.jpeg?auto=compress&cs=tinysrgb&w=800','https://images.pexels.com/photos/6287308/pexels-photo-6287308.jpeg?auto=compress&cs=tinysrgb&w=800'],
    category: 'handcraft', categoryLabel: 'Handcraft', rating: 4.8, reviewCount: 127, sold: 342,
    description: 'Authentic handmade Moroccan tagine crafted by local artisans in Fez.',
    seller: 'Artisan Fez', city: 'Fez', inStock: true, badge: 'trending',
    tags: ['cooking', 'traditional', 'clay', 'handmade'],
  },
  {
    id: 'p2', name: 'Leather Babouche Slippers', nameAr: 'بلغة جلدية أصيلة',
    price: 150, originalPrice: 200,
    image: 'https://images.pexels.com/photos/1670045/pexels-photo-1670045.jpeg?auto=compress&cs=tinysrgb&w=600',
    gallery: ['https://images.pexels.com/photos/1670045/pexels-photo-1670045.jpeg?auto=compress&cs=tinysrgb&w=800'],
    category: 'leather', categoryLabel: 'Leather', rating: 4.6, reviewCount: 89, sold: 215,
    description: 'Traditional Moroccan leather babouche slippers handcrafted in Marrakech.',
    seller: 'Medina Leather', city: 'Marrakech', inStock: true, badge: 'sale',
    tags: ['leather', 'shoes', 'traditional'],
  },
  {
    id: 'p3', name: 'Pure Argan Oil — 100ml', nameAr: 'زيت الأرغان النقي ١٠٠مل',
    price: 120,
    image: 'https://images.pexels.com/photos/4046316/pexels-photo-4046316.jpeg?auto=compress&cs=tinysrgb&w=600',
    gallery: ['https://images.pexels.com/photos/4046316/pexels-photo-4046316.jpeg?auto=compress&cs=tinysrgb&w=800'],
    category: 'argan', categoryLabel: 'Argan', rating: 4.9, reviewCount: 203, sold: 580,
    description: '100% pure cold-pressed argan oil from the Souss region.',
    seller: 'Souss Organic', city: 'Agadir', inStock: true, badge: 'hot',
    tags: ['beauty', 'organic', 'natural', 'oil'],
  },
  {
    id: 'p4', name: 'Berber Wool Carpet 200×300', nameAr: 'سجادة بربرية صوفية',
    price: 850, originalPrice: 1100,
    image: 'https://images.pexels.com/photos/6207811/pexels-photo-6207811.jpeg?auto=compress&cs=tinysrgb&w=600',
    gallery: ['https://images.pexels.com/photos/6207811/pexels-photo-6207811.jpeg?auto=compress&cs=tinysrgb&w=800'],
    category: 'carpets', categoryLabel: 'Carpets', rating: 4.7, reviewCount: 54, sold: 87,
    description: 'Authentic hand-woven Berber wool carpet from the Atlas Mountains.',
    seller: 'Atlas Weavers', city: 'Midelt', inStock: true, badge: 'sale',
    tags: ['carpet', 'wool', 'berber', 'handwoven'],
  },
  {
    id: 'p5', name: 'Ras el Hanout — 250g', nameAr: 'خلطة رأس الحانوت',
    price: 45,
    image: 'https://images.pexels.com/photos/5765/spices-food-market-morocco.jpg?auto=compress&cs=tinysrgb&w=600',
    gallery: ['https://images.pexels.com/photos/5765/spices-food-market-morocco.jpg?auto=compress&cs=tinysrgb&w=800'],
    category: 'spices', categoryLabel: 'Spices', rating: 4.8, reviewCount: 312, sold: 920,
    description: 'Premium Ras el Hanout spice blend with over 30 spices.',
    seller: 'Souk Spices', city: 'Marrakech', inStock: true, badge: 'trending',
    tags: ['spices', 'cooking', 'traditional'],
  },
];

export const REVIEWS: Review[] = [
  { id: 'r1', productId: 'p1', user: 'Sarah M.', avatar: 'S', rating: 5, text: 'Absolutely beautiful tagine! Exceptional quality.', date: '2025-01-15', helpful: 24 },
  { id: 'r2', productId: 'p1', user: 'Ahmed B.', avatar: 'A', rating: 5, text: 'شراء ممتاز جداً. أنصح بشدة.', date: '2024-12-28', helpful: 18 },
  { id: 'r3', productId: 'p3', user: 'Layla K.', avatar: 'L', rating: 5, text: 'Best argan oil ever. My hair feels amazing!', date: '2025-01-05', helpful: 31 },
];

export function getProductsByCategory(cat: string) {
  return cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
}
export function getProductById(id: string) { return PRODUCTS.find(p => p.id === id); }
export function getReviews(productId: string) { return REVIEWS.filter(r => r.productId === productId); }
export function getFeatured() { return PRODUCTS.filter(p => p.badge === 'trending' || p.badge === 'hot').slice(0, 6); }
