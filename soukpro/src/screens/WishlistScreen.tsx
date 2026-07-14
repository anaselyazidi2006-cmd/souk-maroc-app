import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { COLORS, RADIUS, FONT } from '@/theme';
import ProductCard from '@/components/ProductCard';

export function WishlistScreen() {
  const navigate = useNavigate();
  const { wishlist } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.background }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.text, display: 'flex' }}>
          <ArrowRight size={22} />
        </button>
        <h1 style={{ fontSize: FONT.lg, fontWeight: 800, color: COLORS.text, margin: 0 }}>المفضلة ({wishlist.length})</h1>
      </div>

      {wishlist.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: COLORS.textMuted }}>
          <Heart size={64} strokeWidth={1} />
          <p style={{ fontSize: FONT.md, fontWeight: 600 }}>قائمة المفضلة فارغة</p>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '12px 28px', background: COLORS.primary, color: '#fff', border: 'none', borderRadius: RADIUS.full, fontSize: FONT.base, fontWeight: 700, cursor: 'pointer' }}
          >
            اكتشف المنتجات
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {wishlist.map(item => (
              <ProductCard
                key={item.product.id}
                product={item.product}
                onPress={() => navigate(`/product/${item.product.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
