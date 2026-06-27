import { Search, X } from 'lucide-react';
import { COLORS, RADIUS, SHADOW } from '@/theme';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChange, onSubmit, placeholder = 'Search products, artisans, cities…', autoFocus }: Props) {
  return (
    <form
      onSubmit={e => { e.preventDefault(); onSubmit?.(); }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: COLORS.cardAlt,
        borderRadius: RADIUS.lg,
        padding: '0 14px',
        height: 46,
        boxShadow: SHADOW.sm,
        border: `1.5px solid ${COLORS.border}`,
      }}
    >
      <Search size={17} style={{ color: COLORS.textTertiary, flexShrink: 0 }} />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          flex: 1, background: 'none', fontSize: 14,
          color: COLORS.textPrimary, border: 'none', outline: 'none',
        }}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{ lineHeight: 0, color: COLORS.textTertiary }}
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}
