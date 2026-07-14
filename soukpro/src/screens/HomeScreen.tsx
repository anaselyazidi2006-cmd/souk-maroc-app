import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { COLORS, RADIUS, FONT } from '@/theme';
import { CATEGORIES_DATA, FEATURED_PRODUCTS } from '@/data';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import type { Product } from '@/types';

export function HomeScreen() {
  const navigate = useNavigate();
  const { user, cartCount } = useApp();
  const [listings, setListings] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    const { data } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data && data.length > 0) {
      const mapped: Product[] = data.map((l) => ({
        id: l.id,
        title: l.title,
        price: l.price,
        image: l.image_url ?? 'https://placehold.co/400x300/E8DDD0/6B5B45?text=صورة',
        category: l.category,
        description: l.description,
        location: l.location,
        condition: l.condition,
      }));
      setListings(mapped);
    }
  }

  const products = listings.length > 0 ? listings : FEATURED_PRODUCTS;
  const filtered = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.background }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: FONT.xxl, fontWeight: 900, color: COLORS.primary, margin: 0, lineHeight: 1 }}>سوق المغرب</h1>
            <p style={{ fontSize: FONT.xs, color: COLORS.textMuted, margin: '4px 0 0' }}>
              {user ? `أهلاً، ${user.email?.split('@')[0]}` : 'اكتشف أجمل المنتجات'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => navigate('/notifications')}
              style={{ background: COLORS.surfaceAlt, border: 'none', borderRadius: RADIUS.md, padding: 10, cursor: 'pointer', color: COLORS.textSecondary, display: 'flex', alignItems: 'center' }}
            >
              <Bell size={20} />
            </button>
            <button
              onClick={() => navigate('/cart')}
              style={{ background: COLORS.surfaceAlt, border: 'none', borderRadius: RADIUS.md, padding: 10, cursor: 'pointer', color: COLORS.textSecondary, display: 'flex', alignItems: 'center', position: 'relative' }}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: 4, left: 4, width: 16, height: 16, background: COLORS.primary, borderRadius: '50%', fontSize: 10, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <SearchBar onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)} />

        {/* Categories */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 0', scrollbarWidth: 'none' }}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{ flexShrink: 0, padding: '6px 14px', borderRadius: RADIUS.full, border: 'none', background: selectedCategory === null ? COLORS.primary : COLORS.surfaceAlt, color: selectedCategory === null ? '#fff' : COLORS.textSecondary, fontSize: FONT.sm, fontWeight: 600, cursor: 'pointer' }}
          >
            الكل
          </button>
          {CATEGORIES_DATA.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              style={{ flexShrink: 0, padding: '6px 14px', borderRadius: RADIUS.full, border: 'none', background: selectedCategory === cat.id ? COLORS.primary : COLORS.surfaceAlt, color: selectedCategory === cat.id ? '#fff' : COLORS.textSecondary, fontSize: FONT.sm, fontWeight: 600, cursor: 'pointer' }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ flex: 1, padding: 16 }}>
        <p style={{ fontSize: FONT.sm, color: COLORS.textMuted, marginBottom: 12 }}>
          {filtered.length} إعلان{filtered.length !== 1 ? '' : ''}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => navigate(`/product/${product.id}`)}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 60, color: COLORS.textMuted }}>
            <p style={{ fontSize: FONT.md }}>لا توجد منتجات في هذه الفئة</p>
          </div>
        )}
      </div>
    </div>
  );
}
