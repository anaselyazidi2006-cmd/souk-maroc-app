import { Star } from 'lucide-react';
import { COLORS } from '@/theme';

interface Props {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
  showLabel?: boolean;
  reviewCount?: number;
}

export function StarRating({ rating, size = 14, interactive, onChange, showLabel, reviewCount }: Props) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => {
          const full  = s <= Math.floor(rating);
          const half  = !full && s === Math.ceil(rating) && rating % 1 >= 0.3;
          const color = full || half ? COLORS.star : COLORS.starEmpty;
          return (
            <button
              key={s}
              disabled={!interactive}
              onClick={() => interactive && onChange?.(s)}
              className={interactive ? 'transition-transform hover:scale-125 active:scale-95' : ''}
              style={{ lineHeight: 0, cursor: interactive ? 'pointer' : 'default' }}
            >
              <Star
                size={size}
                style={{ color, fill: full ? COLORS.star : 'none' }}
                strokeWidth={1.8}
              />
            </button>
          );
        })}
      </div>
      {showLabel && (
        <span className="text-sm font-semibold" style={{ color: COLORS.textPrimary, marginLeft: 2 }}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs" style={{ color: COLORS.textTertiary }}>({reviewCount})</span>
      )}
    </div>
  );
}
