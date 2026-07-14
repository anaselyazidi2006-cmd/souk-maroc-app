import type { Product } from './types';

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const CATEGORIES_DATA: Category[] = [
  { id: 'صناعة تقليدية', name: 'صناعة تقليدية', icon: '🏺' },
  { id: 'توابل وأعشاب', name: 'توابل وأعشاب', icon: '🌿' },
  { id: 'جلود وحقائب', name: 'جلود وحقائب', icon: '👜' },
  { id: 'نسيج وملابس', name: 'نسيج وملابس', icon: '🧵' },
  { id: 'مجوهرات وإكسسوارات', name: 'مجوهرات', icon: '💍' },
  { id: 'خزف وفخار', name: 'خزف وفخار', icon: '🫙' },
  { id: 'أثاث وديكور', name: 'أثاث وديكور', icon: '🪑' },
  { id: 'إلكترونيات', name: 'إلكترونيات', icon: '📱' },
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'سجادة بربرية يدوية',
    price: 850,
    image: 'https://placehold.co/400x300/C8622A/FFFFFF?text=سجادة',
    category: 'نسيج وملابس',
    description: 'سجادة بربرية أصيلة مصنوعة يدوياً من الصوف الطبيعي بألوان تقليدية',
    rating: 4.8,
    reviewCount: 24,
    seller: 'حرفيات الأطلس',
    location: 'مراكش',
    condition: 'جديد',
  },
  {
    id: 'p2',
    title: 'طقم توابل مغربية',
    price: 120,
    image: 'https://placehold.co/400x300/2A7C6F/FFFFFF?text=توابل',
    category: 'توابل وأعشاب',
    description: 'مجموعة من أجود التوابل المغربية الأصيلة: الكمون، الكركم، الكزبرة، رأس الحانوت',
    rating: 4.9,
    reviewCount: 56,
    seller: 'بهارات فاس',
    location: 'فاس',
    condition: 'جديد',
  },
  {
    id: 'p3',
    title: 'حقيبة جلدية مراكشية',
    price: 650,
    image: 'https://placehold.co/400x300/A0481A/FFFFFF?text=حقيبة',
    category: 'جلود وحقائب',
    description: 'حقيبة جلدية فاخرة مصنوعة يدوياً في دباغة مراكش العريقة',
    rating: 4.7,
    reviewCount: 18,
    seller: 'جلود المدينة',
    location: 'مراكش',
    condition: 'جديد',
  },
  {
    id: 'p4',
    title: 'إبريق نحاسي أنتيك',
    price: 280,
    image: 'https://placehold.co/400x300/E6A020/FFFFFF?text=إبريق',
    category: 'صناعة تقليدية',
    description: 'إبريق نحاسي تقليدي مزخرف بنقوش مغربية أصيلة',
    rating: 4.6,
    reviewCount: 12,
    seller: 'نحاسيات فاس',
    location: 'فاس',
    condition: 'ممتاز',
  },
  {
    id: 'p5',
    title: 'طاجين خزفي مزخرف',
    price: 320,
    image: 'https://placehold.co/400x300/D94040/FFFFFF?text=طاجين',
    category: 'خزف وفخار',
    description: 'طاجين خزفي مزخرف بألوان الجيلالي التقليدية، مناسب للطبخ والتزيين',
    rating: 4.5,
    reviewCount: 30,
    seller: 'خزف سلا',
    location: 'الرباط',
    condition: 'جديد',
  },
  {
    id: 'p6',
    title: 'جلابة رجالية فاخرة',
    price: 450,
    image: 'https://placehold.co/400x300/2A7C6F/FFFFFF?text=جلابة',
    category: 'نسيج وملابس',
    description: 'جلابة رجالية فاخرة مصنوعة من القماش المغربي الأصيل',
    rating: 4.4,
    reviewCount: 9,
    seller: 'أناقة الجديدة',
    location: 'الجديدة',
    condition: 'جديد',
  },
];
