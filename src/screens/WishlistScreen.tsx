import { Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PRODUCTS } from '@/data';
import { ProductCard } from '@/components/ProductCard';
import { COLORS, RADIUS, SHADOW } from '@/theme';

export function WishlistScreen() {
  const { wishlist, navigate } = useApp();
  const items = PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div style={{ background: COLORS.background, minHeight: '100%', paddingBottom: 80 }}>
      <div style={{ background: COLORS.card, padding: '48px 16px 16px', boxShadow: '0 1px 0 ' + COLORS.border }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: COLORS.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>Wishlist</h1>
          <span style={{ fontSize: 12, color: COLORS.textSecondary, background: COLORS.cardAlt, padding: '4px 10px', borderRadius: RADIUS.full, border: `1px solid ${COLORS.border}` }}>{items.length} saved</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 32px', gap: 12 }}>
          <div style={{ width: 80, height: 80, background: '#FEF2F2', borderRadius: RADIUS.xxl, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={38} style={{ color: '#FCA5A5' }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.textPrimary, margin: 0 }}>No saved items</h2>
          <p style={{ fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', margin: 0 }}>Tap the ♡ on any product to save it for later</p>
          <button onClick={() => navigate('home')} style={{ height: 48, padding: '0 28px', background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: RADIUS.lg, boxShadow: SHADOW.primary, marginTop: 8 }}>
            Browse Products
          </button>
        </div>
      ) : (
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {items.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
