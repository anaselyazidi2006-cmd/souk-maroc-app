import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { AppUser, CartItem, Comment, Listing } from '@/types';

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface AppContextValue {
  /* Auth */
  user:    AppUser | null;
  loading: boolean;
  signOut: () => Promise<void>;

  /* Cart */
  cart:        CartItem[];
  addToCart:   (listing: Listing) => void;
  removeFromCart: (id: string) => void;
  clearCart:   () => void;
  cartTotal:   number;

  /* Wishlist */
  wishlist:        Listing[];
  toggleWishlist:  (listing: Listing) => void;
  isWishlisted:    (id: string) => boolean;

  /* Likes */
  likeCounts:  Record<string, number>;
  toggleLike:  (id: string, baseLikes: number) => void;
  isLiked:     (id: string) => boolean;

  /* Comments (local-only overlay) */
  getComments: (listingId: string) => Comment[];
  addComment:  (listingId: string, text: string) => void;
}

/* ─── Context ────────────────────────────────────────────────────────────── */
const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}

/* ─── Provider ───────────────────────────────────────────────────────────── */
export function AppProvider({ children }: { children: ReactNode }) {
  /* ── Auth state ── */
  const [user, setUser]       = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* Initial session */
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(buildUser(session.user));
      setLoading(false);
    });

    /* Auth state changes */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? buildUser(session.user) : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  /* ── Cart ── */
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((listing: Listing) => {
    setCart(prev => {
      const existing = prev.find(i => i.listing.id === listing.id);
      if (existing) return prev.map(i => i.listing.id === listing.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { listing, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(i => i.listing.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, i) => sum + (i.listing.price ?? 0) * i.quantity, 0);

  /* ── Wishlist ── */
  const [wishlist, setWishlist] = useState<Listing[]>([]);

  const toggleWishlist = useCallback((listing: Listing) => {
    setWishlist(prev =>
      prev.some(l => l.id === listing.id)
        ? prev.filter(l => l.id !== listing.id)
        : [...prev, listing]
    );
  }, []);

  const isWishlisted = useCallback((id: string) => wishlist.some(l => l.id === id), [wishlist]);

  /* ── Likes (local optimistic, not persisted to DB) ── */
  const [likedIds, setLikedIds]   = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  const toggleLike = useCallback((id: string, baseLikes: number) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setLikeCounts(c => ({ ...c, [id]: (c[id] ?? baseLikes) - 1 }));
      } else {
        next.add(id);
        setLikeCounts(c => ({ ...c, [id]: (c[id] ?? baseLikes) + 1 }));
      }
      return next;
    });
  }, []);

  const isLiked = useCallback((id: string) => likedIds.has(id), [likedIds]);

  /* ── Comments (local-only) ── */
  const [comments, setComments] = useState<Record<string, Comment[]>>({});

  const getComments = useCallback((listingId: string): Comment[] => {
    return comments[listingId] ?? [];
  }, [comments]);

  const addComment = useCallback((listingId: string, text: string) => {
    if (!user) return;
    const comment: Comment = {
      id:          `local-${Date.now()}`,
      listingId,
      userId:      user.id,
      userName:    user.name ?? 'مجهول',
      userAvatar:  user.avatar ?? '👤',
      text,
      createdAt:   new Date().toISOString(),
    };
    setComments(prev => ({
      ...prev,
      [listingId]: [...(prev[listingId] ?? []), comment],
    }));
  }, [user]);

  /* ── Context value ── */
  const value: AppContextValue = {
    user, loading, signOut,
    cart, addToCart, removeFromCart, clearCart, cartTotal,
    wishlist, toggleWishlist, isWishlisted,
    likeCounts, toggleLike, isLiked,
    getComments, addComment,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* ─── Helper ─────────────────────────────────────────────────────────────── */
function buildUser(authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }): AppUser {
  const meta = authUser.user_metadata ?? {};
  return {
    id:     authUser.id,
    email:  authUser.email ?? '',
    name:   (meta.name as string | undefined) ?? (meta.full_name as string | undefined),
    avatar: (meta.avatar as string | undefined) ?? deriveAvatar(authUser.email ?? ''),
    city:   meta.city as string | undefined,
    phone:  meta.phone as string | undefined,
  };
}

function deriveAvatar(email: string): string {
  const letter = email.charAt(0).toUpperCase();
  const emojis: Record<string, string> = {
    A:'😊', B:'🎯', C:'🌟', D:'🦁', E:'🌺', F:'🎨', G:'🌴', H:'🏔️',
    I:'🌊', J:'🦅', K:'🌸', L:'🎭', M:'🦋', N:'🌙', O:'🌅', P:'🎪',
    Q:'🦊', R:'🌹', S:'⭐', T:'🌈', U:'🦄', V:'🎯', W:'🌿', X:'🎸',
    Y:'🌻', Z:'🏆',
  };
  return emojis[letter] ?? '👤';
}
