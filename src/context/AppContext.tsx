import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Product, Route, User, Listing, Comment } from '@/types';
import { NOTIFICATIONS as INIT_NOTIFS } from '@/data';
import type { Notification } from '@/types';
import { supabase } from '@/lib/supabase';

interface AppCtx {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (name: string, email: string, password: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
  logout: () => void;
  route: Route;
  prevRoute: Route | null;
  productId: string | null;
  listingId: string | null;
  navigate: (r: Route, id?: string) => void;
  goBack: () => void;
  activeCategory: string;
  setCategory: (c: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  // Social
  likedListings: string[];
  likeCounts: Record<string, number>;
  toggleLike: (listingId: string, currentCount: number) => void;
  isLiked: (id: string) => boolean;
  comments: Comment[];
  addComment: (listingId: string, text: string) => void;
  getComments: (listingId: string) => Comment[];
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  // My listings
  myListings: Listing[];
  addListing: (l: Listing) => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [route, setRoute] = useState<Route>('welcome');
  const [prevRoute, setPrevRoute] = useState<Route | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [listingId, setListingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [likedListings, setLikedListings] = useState<string[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(INIT_NOTIFS);
  const [myListings, setMyListings] = useState<Listing[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.[0]?.toUpperCase() || 'U',
          email: session.user.email || '',
          avatar: session.user.user_metadata?.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || 'U',
          city: 'Marrakech',
          orders: 0,
          reviews: 0,
          rating: 0,
          listingCount: 0,
          phone: '',
        });
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.[0]?.toUpperCase() || 'U',
          email: session.user.email || '',
          avatar: session.user.user_metadata?.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || 'U',
          city: 'Marrakech',
          orders: 0,
          reviews: 0,
          rating: 0,
          listingCount: 0,
          phone: '',
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const navigate = (r: Route, id?: string) => {
    setPrevRoute(route);
    setRoute(r);
    if (r === 'product') setProductId(id ?? null);
    if (r === 'listing') setListingId(id ?? null);
  };

  const goBack = () => {
    if (prevRoute) { setRoute(prevRoute); setPrevRoute(null); }
    else navigate('home');
  };

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      }
      if (error.message.includes('Email not confirmed')) {
        return { error: 'يرجى تأكيد بريدك الإلكتروني أولاً. تحقق من صندوق الوارد.' };
      }
      return { error: error.message };
    }
    navigate('home');
    return { error: null };
  };

  const register = async (name: string, email: string, password: string): Promise<{ error: string | null; needsConfirmation?: boolean }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      if (error.message.includes('already registered') || error.message.includes('already been registered')) {
        return { error: 'هذا البريد الإلكتروني مسجل مسبقاً' };
      }
      return { error: error.message };
    }
    // Check if email confirmation is required
    if (data.user && !data.session) {
      return { error: null, needsConfirmation: true };
    }
    navigate('home');
    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('welcome');
  };

  const addToCart = (p: Product, qty = 1) =>
    setCart(prev => {
      const ex = prev.find(i => i.product.id === p.id);
      return ex ? prev.map(i => i.product.id === p.id ? { ...i, qty: i.qty + qty } : i) : [...prev, { product: p, qty }];
    });

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.product.id !== id));
  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i));
  };
  const clearCart = () => setCart([]);
  const toggleWishlist = (id: string) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleLike = (listingId: string, currentCount: number) => {
    const wasLiked = likedListings.includes(listingId);
    setLikedListings(prev => wasLiked ? prev.filter(x => x !== listingId) : [...prev, listingId]);
    setLikeCounts(prev => ({ ...prev, [listingId]: (prev[listingId] ?? currentCount) + (wasLiked ? -1 : 1) }));
  };

  const addComment = (listingId: string, text: string) => {
    if (!user || !text.trim()) return;
    const newComment: Comment = {
      id: `c${Date.now()}`, listingId, userId: user.id,
      userName: user.name, userAvatar: user.avatar,
      text: text.trim(), createdAt: new Date().toISOString(),
    };
    setComments(prev => [...prev, newComment]);
    // Add notification
    setNotifications(prev => [{
      id: `n${Date.now()}`, type: 'reply',
      title: 'تعليق جديد 💬', body: `${user.name} علق على إعلانك`,
      time: 'الآن', read: false, icon: '💬',
    }, ...prev]);
  };

  const getComments = (listingId: string) => comments.filter(c => c.listingId === listingId);
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const addListing = (l: Listing) => setMyListings(prev => [l, ...prev]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Ctx.Provider value={{
      user, isLoading, login, register, logout,
      route, prevRoute, productId, listingId, navigate, goBack,
      activeCategory, setCategory: setActiveCategory,
      searchQuery, setSearchQuery,
      cart, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart,
      wishlist, toggleWishlist, isWishlisted: (id) => wishlist.includes(id),
      likedListings, likeCounts, toggleLike, isLiked: (id) => likedListings.includes(id),
      comments, addComment, getComments,
      notifications, unreadCount, markAllRead,
      myListings, addListing,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp outside AppProvider');
  return ctx;
}
