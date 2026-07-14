import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react';
import { COLORS, FONT } from '@/theme';

interface TabItem {
  path: string;
  label: string;
  icon: ReactNode;
}

export default function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs: TabItem[] = [
    { path: '/', label: 'الرئيسية', icon: <Home size={22} /> },
    { path: '/search', label: 'بحث', icon: <Search size={22} /> },
    { path: '/post_ad', label: 'نشر', icon: <PlusSquare size={22} /> },
    { path: '/wishlist', label: 'المفضلة', icon: <Heart size={22} /> },
    { path: '/profile', label: 'حسابي', icon: <User size={22} /> },
  ];

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      background: COLORS.surface,
      borderTop: `1px solid ${COLORS.border}`,
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      paddingTop: 8,
    }}>
      {tabs.map(tab => {
        const isActive = tab.path === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(tab.path);

        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? COLORS.primary : COLORS.textMuted,
              padding: '4px 0',
            }}
          >
            {tab.icon}
            <span style={{ fontSize: FONT.xs, fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
