import { Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { COLORS, RADIUS, FONT } from '@/theme';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useApp();
  const inWishlist = isInWishlist(product.id);

  function toggleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }

  return (
    <div
      onClick={onPress}
      style={{
        background: COLORS.card,
        borderRadius: RADIUS.md,
        overflow: 'hidden',
        border: `1px solid ${COLORS.border}`,
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Image */}
      <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: COLORS.surfaceAlt }}>
        <img
          src={product.image}
          alt={product.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
      </div>

      {/* Wishlist button */}
      <button
        onClick={toggleWishlist}
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: inWishlist ? COLORS.error : COLORS.textMuted,
        }}
      >
        <Heart size={16} fill={inWishlist ? COLORS.error : 'none'} />
      </button>

      {/* Info */}
      <div style={{ padding: '10px 10px 12px' }}>
        <p style={{
          fontSize: FONT.sm,
          fontWeight: 700,
          color: COLORS.text,
          margin: 0,
          marginBottom: 4,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.4,
        }}>
          {product.title}
        </p>
        {product.location && (
          <p style={{ fontSize: FONT.xs, color: COLORS.textMuted, margin: '0 0 6px' }}>
            📍 {product.location}
          </p>
        )}
        <p style={{ fontSize: FONT.md, fontWeight: 800, color: COLORS.primary, margin: 0 }}>
          {product.price.toLocaleString('ar-MA')} د.م.
        </p>
      </div>
    </div>
  );
}
