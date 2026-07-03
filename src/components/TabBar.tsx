import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { COLORS } from '@/theme';

const TABS = [
  { path: '/home',     icon: Home,         label: 'الرئيسية' },
  { path: '/search',   icon: Search,       label: 'البحث'    },
  { path: '/cart',     icon: ShoppingCart, label: 'السلة'    },
  { path: '/wishlist', icon: Heart,        label: 'المحفوظة' },
  { path: '/profile',  icon: User,         label: 'حسابي'    },
] as const;

export function TabBar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { cartCount, wishlist } = useApp();

  return (
    <div style={{
      background: COLORS.card,
      borderTop: `1px solid ${COLORS.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      height: 64,
      boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
      flexShrink: 0,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {TABS.map(({ path, icon: Icon, label }) => {
        const active = pathname.startsWith(path) || (path === '/home' && (pathname.startsWith('/product') || pathname.startsWith('/listing')));
        const badge  = path === '/cart' ? cartCount : path === '/wishlist' ? wishlist.length : 0;
        return (
          <button
            key={path}
            onClick={() => nav(path)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 12px', position: 'relative', flex: 1 }}
          >
            {active && (
              <span style={{ position: 'absolute', top: 4, width: 18, height: 3, borderRadius: 9999, background: COLORS.primary }} />
            )}
            <div style={{ position: 'relative', marginTop: 4 }}>
              <Icon size={22} strokeWidth={active ? 2.3 : 1.6} style={{ color: active ? COLORS.tabActive : COLORS.tabInactive, transition: 'color 0.2s' }} />
              {badge > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -8, background: COLORS.badge, color: '#fff', fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${COLORS.card}` }}>
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? COLORS.tabActive : COLORS.tabInactive, transition: 'color 0.2s' }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
