import { useState } from 'react';
import { Search } from 'lucide-react';
import { COLORS, RADIUS, FONT } from '@/theme';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchBar({ onSearch, placeholder = 'ابحث عن منتجات...', initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: COLORS.surfaceAlt,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.full,
        padding: '10px 14px',
      }}>
        <Search size={18} color={COLORS.textMuted} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            fontSize: FONT.base,
            color: COLORS.text,
            direction: 'rtl',
            fontFamily: 'inherit',
          }}
        />
      </div>
      <button
        type="submit"
        style={{
          background: COLORS.primary,
          border: 'none',
          borderRadius: RADIUS.full,
          padding: '10px 18px',
          color: '#fff',
          fontSize: FONT.sm,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        بحث
      </button>
    </form>
  );
}
