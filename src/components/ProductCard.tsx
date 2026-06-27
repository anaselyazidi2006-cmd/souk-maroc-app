import { Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { StarRating } from './StarRating';
import { COLORS, RADIUS, SHADOW } from '@/theme';

const BADGE_MAP = {
  new:      { label: 'NEW',      bg: COLORS.info },
  sale:     { label: 'SALE',     bg: COLORS.error },
  trending: { label: 'TRENDING', bg: COLORS.primary },
  hot:      { label: '🔥 HOT',   bg: '#F59E0B' },
};

interface Props { product: Product; compact?: boolean; }

export function ProductCard({ product, compact }: Props) {
  const { navigate, addToCart, toggleWishlist, isWishlisted } = useApp();
  const wished   = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div
      onClick={() => navigate('product', product.id)}
      style={{
        background: COLORS.card, borderRadius: RADIUS.xl,
        overflow: 'hidden', boxShadow: SHADOW.sm,
        border: `1px solid ${COLORS.border}`,
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = SHADOW.md; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = SHADOW.sm; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: COLORS.cardAlt }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
        />
        {!product.inStock && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, background: 'rgba(0,0,0,0.55)', padding: '4px 10px', borderRadius: RADIUS.full }}>Out of Stock</span>
          </div>
        )}
        {/* Badge */}
        {product.badge && product.inStock && BADGE_MAP[product.badge as keyof typeof BADGE_MAP] && (
          <span style={{ position: 'absolute', top: 8, left: 8, background: BADGE_MAP[product.badge as keyof typeof BADGE_MAP].bg, color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 7px', borderRadius: RADIUS.full, letterSpacing: '0.04em' }}>
            {BADGE_MAP[product.badge as keyof typeof BADGE_MAP].label}
          </span>
        )}
        {/* Discount */}
        {discount > 0 && (
          <span style={{ position: 'absolute', top: 8, right: compact ? 8 : 36, background: COLORS.error, color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 7px', borderRadius: RADIUS.full }}>
            -{discount}%
          </span>
        )}
        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          style={{
            position: 'absolute', top: 6, right: 6, width: 30, height: 30,
            background: 'rgba(255,255,255,0.92)', borderRadius: RADIUS.full,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: SHADOW.sm, transition: 'transform 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
          onMouseLeave={e => (e.currentTarget.style.transform = '')}
        >
          <Heart size={14} style={{ color: wished ? COLORS.error : COLORS.textTertiary, fill: wished ? COLORS.error : 'none' }} />
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.primary, letterSpacing: '0.02em' }}>
          {product.city}
        </span>
        <p style={{ fontSize: compact ? 12 : 13, fontWeight: 600, color: COLORS.textPrimary, lineHeight: 1.35, margin: 0 }} className="line-clamp-2">
          {product.name}
        </p>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} size={11} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <div>
            <span style={{ fontSize: compact ? 14 : 15, fontWeight: 800, color: COLORS.textPrimary }}>{product.price}</span>
            <span style={{ fontSize: 10, color: COLORS.textSecondary, marginLeft: 2 }}>MAD</span>
            {product.originalPrice && (
              <span style={{ fontSize: 10, color: COLORS.textTertiary, textDecoration: 'line-through', marginLeft: 4 }}>{product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); product.inStock && addToCart(product); }}
            disabled={!product.inStock}
            style={{
              width: 30, height: 30, borderRadius: RADIUS.md,
              background: product.inStock ? COLORS.primary : COLORS.border,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: product.inStock ? SHADOW.primary : 'none',
              transition: 'transform 0.12s, opacity 0.12s',
            }}
            onMouseEnter={e => { if (product.inStock) e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
          >
            <ShoppingCart size={14} style={{ color: '#fff' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
