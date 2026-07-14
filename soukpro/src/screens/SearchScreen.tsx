import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { COLORS, RADIUS, FONT } from '@/theme';
import { FEATURED_PRODUCTS } from '@/data';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import type { Product } from '@/types';

export function SearchScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQ) performSearch(initialQ);
  }, [initialQ]);

  async function performSearch(q: string) {
    setLoading(true);
    setQuery(q);
    setSearchParams({ q });

    const { data } = await supabase
      .from('listings')
      .select('*')
      .ilike('title', `%${q}%`)
      .limit(30);

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
      setResults(mapped);
    } else {
      // Fall back to static data
      const lower = q.toLowerCase();
      const filtered = FEATURED_PRODUCTS.filter(p =>
        p.title.includes(q) || p.description?.includes(q) || p.category.includes(q) || p.title.toLowerCase().includes(lower)
      );
      setResults(filtered);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.background }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.text, display: 'flex' }}>
            <ArrowRight size={22} />
          </button>
          <h1 style={{ fontSize: FONT.lg, fontWeight: 800, color: COLORS.text, margin: 0, flex: 1 }}>البحث</h1>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textMuted, display: 'flex' }}>
            <SlidersHorizontal size={20} />
          </button>
        </div>
        <SearchBar onSearch={performSearch} initialValue={initialQ} />
      </div>

      {/* Results */}
      <div style={{ flex: 1, padding: 16 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${COLORS.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : query && results.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 60, color: COLORS.textMuted }}>
            <p style={{ fontSize: FONT.md }}>لا توجد نتائج لـ "{query}"</p>
            <p style={{ fontSize: FONT.sm, marginTop: 8 }}>جرب كلمات بحث مختلفة</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <p style={{ fontSize: FONT.sm, color: COLORS.textMuted, marginBottom: 12 }}>
              {results.length} نتيجة لـ "{query}"
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {results.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: 60, color: COLORS.textMuted }}>
            <p style={{ fontSize: FONT.md }}>ابحث عن المنتجات التي تريدها</p>
          </div>
        )}
      </div>
    </div>
  );
}
