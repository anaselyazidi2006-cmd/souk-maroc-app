import { Star } from 'lucide-react';
import { COLORS, FONT } from '@/theme';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showCount?: boolean;
}

export default function StarRating({ rating, reviewCount, size = 14, showCount = true }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={size} fill={COLORS.star} color={COLORS.star} />
        ))}
        {hasHalf && (
          <Star size={size} fill={`url(#half-${rating})`} color={COLORS.star} />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={size} fill="none" color={COLORS.star} />
        ))}
      </div>
      {showCount && (
        <span style={{ fontSize: FONT.xs, color: COLORS.textMuted }}>
          {rating.toFixed(1)}{reviewCount !== undefined ? ` (${reviewCount})` : ''}
        </span>
      )}
    </div>
  );
}
