/* ─── SoukPro Shared Types ──────────────────────────────────────────────── */

export interface Listing {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userCity: string;
  userRating: number;
  title: string;
  description: string;
  price: number | null;
  priceLabel: string;
  type: 'sale' | 'service' | 'job' | 'rent';
  typeLabel: string;
  category: string;
  image: string;
  city: string;
  phone: string;
  whatsapp: string;
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
  badge?: 'urgent' | 'featured' | 'new' | null;
}

export interface AppUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  city?: string;
  phone?: string;
}

export interface CartItem {
  listing: Listing;
  quantity: number;
}

export interface Comment {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  city: string;
  rating: number;
  reviews: number;
}
