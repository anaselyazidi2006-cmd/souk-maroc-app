import type { Product, Category, Review, Listing, Comment, Notification } from './types';

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

export const LISTINGS: Listing[] = [
  {
    id: 'l1', userId: 'u2', userName: 'Karim Tahiri', userAvatar: 'K',
    userCity: 'Marrakech', userRating: 4.8,
    title: 'طاجين مغربي يدوي — جودة فاخرة',
    description: 'طاجين أصيل مصنوع يدوياً من طرف حرفيين من فاس. مثالي للطهي البطيء والهدايا. متوفر بأحجام مختلفة.',
    price: 280, priceLabel: '280 MAD',
    type: 'sale', typeLabel: 'للبيع',
    category: 'handcraft',
    image: 'https://images.pexels.com/photos/6287447/pexels-photo-6287447.jpeg?auto=compress&cs=tinysrgb&w=700',
    city: 'Marrakech', phone: '+212612345678', whatsapp: '+212612345678',
    createdAt: '2025-01-14T10:00:00Z', likes: 47, comments: 12, views: 234,
    badge: 'featured',
  },
  {
    id: 'l2', userId: 'u3', userName: 'Fatima Zahra', userAvatar: 'F',
    userCity: 'Fez', userRating: 4.9,
    title: 'خياطة وتطريز تقليدي — تفصيل على المقاس',
    description: 'خدمة تفصيل الجلابة والقفطان المغربي. خبرة 15 سنة. جودة عالية وأثمنة مناسبة. التسليم في 3 أيام.',
    price: null, priceLabel: 'بالاتفاق',
    type: 'service', typeLabel: 'خدمة',
    category: 'handcraft',
    image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=700',
    city: 'Fez', phone: '+212698765432', whatsapp: '+212698765432',
    createdAt: '2025-01-14T08:00:00Z', likes: 89, comments: 23, views: 412,
    badge: 'new',
  },
  {
    id: 'l3', userId: 'u4', userName: 'Hassan Moukrim', userAvatar: 'H',
    userCity: 'Agadir', userRating: 4.7,
    title: 'زيت أرغان طبيعي 100% — من سوس',
    description: 'زيت أرغان خالص مباشر من ضيعة عائلية في سوس. معصور بارداً. مثالي للعناية بالشعر والبشرة. توصيل لجميع المدن.',
    price: 120, priceLabel: '120 MAD / 100ml',
    type: 'sale', typeLabel: 'للبيع',
    category: 'argan',
    image: 'https://images.pexels.com/photos/4046316/pexels-photo-4046316.jpeg?auto=compress&cs=tinysrgb&w=700',
    city: 'Agadir', phone: '+212677889900', whatsapp: '+212677889900',
    createdAt: '2025-01-13T15:00:00Z', likes: 134, comments: 41, views: 890,
    badge: 'featured',
  },
  {
    id: 'l4', userId: 'u5', userName: 'Youssef Alami', userAvatar: 'Y',
    userCity: 'Casablanca', userRating: 4.5,
    title: 'مطلوب مصمم غرافيك — عمل حر',
    description: 'شركة ناشئة في الدار البيضاء تبحث عن مصمم جرافيك للعمل عن بُعد. مشاريع متنوعة. أجر تنافسي حسب الخبرة.',
    price: 3000, priceLabel: '3000–6000 MAD/شهر',
    type: 'job', typeLabel: 'وظيفة',
    category: 'handcraft',
    image: 'https://images.pexels.com/photos/3153201/pexels-photo-3153201.jpeg?auto=compress&cs=tinysrgb&w=700',
    city: 'Casablanca', phone: '+212661234567', whatsapp: '+212661234567',
    createdAt: '2025-01-13T12:00:00Z', likes: 56, comments: 18, views: 678,
    badge: 'urgent',
  },
  {
    id: 'l5', userId: 'u6', userName: 'Aicha Benhaddou', userAvatar: 'A',
    userCity: 'Ouarzazate', userRating: 4.9,
    title: 'سجادة بربرية أمازيغية — نسيج يدوي أصيل',
    description: 'سجادة صوفية مصنوعة يدوياً بالجبال الأطلسية. نقوش هندسية تقليدية. الأبعاد: 200×300 سم. قابلة للتفاوض.',
    price: 850, priceLabel: '850 MAD',
    type: 'sale', typeLabel: 'للبيع',
    category: 'carpets',
    image: 'https://images.pexels.com/photos/6207811/pexels-photo-6207811.jpeg?auto=compress&cs=tinysrgb&w=700',
    city: 'Ouarzazate', phone: '+212644556677', whatsapp: '+212644556677',
    createdAt: '2025-01-12T09:00:00Z', likes: 73, comments: 9, views: 310,
  },
  {
    id: 'l6', userId: 'u7', userName: 'Mohamed Rifai', userAvatar: 'M',
    userCity: 'Tangier', userRating: 4.6,
    title: 'شقة للكراء — وسط مدينة طنجة',
    description: 'شقة مفروشة بالكامل في وسط مدينة طنجة. 2 غرف + صالون. قرب من المرافق. مناسبة للطلبة والعمال.',
    price: 2500, priceLabel: '2500 MAD/شهر',
    type: 'rent', typeLabel: 'للكراء',
    category: 'handcraft',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=700',
    city: 'Tangier', phone: '+212655443322', whatsapp: '+212655443322',
    createdAt: '2025-01-12T14:00:00Z', likes: 29, comments: 7, views: 445,
    badge: 'new',
  },
  {
    id: 'l7', userId: 'u8', userName: 'Khadija Nasri', userAvatar: 'K',
    userCity: 'Marrakech', userRating: 5.0,
    title: 'دروس خصوصية عربية وفرنسية — جميع المستويات',
    description: 'أستاذة معتمدة تقدم دروساً خصوصية في اللغة العربية والفرنسية. لجميع المستويات. منزلي أو عن بُعد. 80 MAD/ساعة.',
    price: 80, priceLabel: '80 MAD/ساعة',
    type: 'service', typeLabel: 'خدمة',
    category: 'handcraft',
    image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=700',
    city: 'Marrakech', phone: '+212633221100', whatsapp: '+212633221100',
    createdAt: '2025-01-11T11:00:00Z', likes: 112, comments: 34, views: 567,
    badge: 'featured',
  },
  {
    id: 'l8', userId: 'u9', userName: 'Omar Benjelloun', userAvatar: 'O',
    userCity: 'Fez', userRating: 4.7,
    title: 'حقيبة جلدية مصنوعة يدوياً — فاس',
    description: 'حقيبة جلدية طبيعية 100% من مدابغ فاس. تطريز يدوي. إبزيم نحاسي. الأبعاد: 35×28 سم. شحن لجميع المدن.',
    price: 420, priceLabel: '420 MAD',
    type: 'sale', typeLabel: 'للبيع',
    category: 'leather',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=700',
    city: 'Fez', phone: '+212677001122', whatsapp: '+212677001122',
    createdAt: '2025-01-11T16:00:00Z', likes: 67, comments: 15, views: 289,
  },
];

export const COMMENTS: Comment[] = [
  { id: 'c1', listingId: 'l1', userId: 'u10', userName: 'Sara Idrissi', userAvatar: 'S', text: 'واش ممكن تبعت لكازا؟ 🙏', createdAt: '2025-01-14T11:00:00Z' },
  { id: 'c2', listingId: 'l1', userId: 'u11', userName: 'Amine Tazi', userAvatar: 'A', text: 'جودة ممتازة، عندي واحد من عندك من قبل 👍', createdAt: '2025-01-14T12:00:00Z' },
  { id: 'c3', listingId: 'l3', userId: 'u12', userName: 'Lina M.', userAvatar: 'L', text: 'هاد الزيت بغيتو بزاف، واش عندك دليفري؟', createdAt: '2025-01-13T16:00:00Z' },
  { id: 'c4', listingId: 'l2', userId: 'u13', userName: 'Rachid K.', userAvatar: 'R', text: 'بغيت خياطة قفطان، كتدير لخارج المغرب؟', createdAt: '2025-01-14T09:00:00Z' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'like',            title: 'إعجاب جديد ❤️',         body: 'أعجب كريم التاهيري بإعلانك "طاجين مغربي"',                   time: 'دقيقتان',  read: false, icon: '❤️' },
  { id: 'n2', type: 'reply',           title: 'تعليق جديد 💬',         body: 'سارة إدريسي علقت على إعلانك: "واش ممكن تبعت لكازا؟"',        time: '15 دقيقة', read: false, icon: '💬' },
  { id: 'n3', type: 'new_listing',     title: 'إعلان جديد قريب منك 📍', body: 'إعلان جديد في مراكش: "دروس خصوصية عربية وفرنسية"',           time: '1 ساعة',   read: false, icon: '📍' },
  { id: 'n4', type: 'message',         title: 'رسالة جديدة 📩',         body: 'أمين تازي أرسل لك رسالة حول إعلانك',                         time: '2 ساعة',   read: true,  icon: '📩' },
  { id: 'n5', type: 'service_request', title: 'طلب خدمة 🔧',            body: 'محمد من الرباط يطلب خدمة التطريز التقليدي',                   time: '3 ساعات',  read: true,  icon: '🔧' },
  { id: 'n6', type: 'like',            title: 'إعجاب جديد ❤️',         body: 'أعجبت 12 شخصاً بإعلانك "زيت أرغان طبيعي"',                    time: 'أمس',      read: true,  icon: '❤️' },
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

export function getListingsByType(type: string) {
  return type === 'all' ? LISTINGS : LISTINGS.filter(l => l.type === type);
}
export function getListingsByCity(city: string) {
  return city === 'All Cities' ? LISTINGS : LISTINGS.filter(l => l.city === city);
}
export function getListingById(id: string) { return LISTINGS.find(l => l.id === id); }
export function getCommentsByListing(id: string) { return COMMENTS.filter(c => c.listingId === id); }
export function searchListings(q: string, type = 'all', city = 'All Cities') {
  const lq = q.toLowerCase();
  return LISTINGS.filter(l => {
    const matchQ = !q || l.title.includes(lq) || l.description.includes(lq) || l.city.toLowerCase().includes(lq);
    const matchT = type === 'all' || l.type === type;
    const matchC = city === 'All Cities' || l.city === city;
    return matchQ && matchT && matchC;
  });
}

export function getProductsByCategory(cat: string) {
  return cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
}
export function getProductById(id: string) { return PRODUCTS.find(p => p.id === id); }
export function getReviews(productId: string) { return REVIEWS.filter(r => r.productId === productId); }
export function getFeatured() { return PRODUCTS.filter(p => p.badge === 'trending' || p.badge === 'hot').slice(0, 6); }
