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
  badge?: 'urgent' | 'featured' | 'new';
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

export interface Notification {
  id: string;
  type: 'message' | 'reply' | 'new_listing' | 'service_request' | 'like';
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  category: string;
  categoryLabel: string;
  rating: number;
  reviewCount: number;
  sold: number;
  description: string;
  seller: string;
  city: string;
  inStock: boolean;
  badge?: 'new' | 'sale' | 'trending' | 'hot';
  tags: string[];
}

export interface Category {
  id: string;
  label: string;
  labelAr: string;
  emoji: string;
  count: number;
}

export interface Review {
  id: string;
  productId: string;
  user: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  city: string;
  orders: number;
  reviews: number;
  rating: number;
  listingCount: number;
  phone: string;
}

export type RouteAuth = 'welcome' | 'login' | 'register';
export type RouteTab  = 'home' | 'search' | 'cart' | 'wishlist' | 'profile';
export type Route     = RouteAuth | RouteTab | 'product' | 'about' | 'orders' | 'post_ad' | 'listing' | 'notifications';
