export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  seller?: string;
  location?: string;
  condition?: string;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  image_url: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Order {
  id: string;
  product: Product;
  quantity: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  total: number;
}
