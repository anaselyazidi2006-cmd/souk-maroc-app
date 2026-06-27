import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { RouteTab } from '@/types';
import { COLORS } from '@/theme';

const TABS: { id: RouteTab; icon: typeof Home; label: string }[] = [
  { id: 'home',     icon: Home,         label: 'الرئيسية' },
  { id: 'search',   icon: Search,       label: 'البحث'    },
  { id: 'cart',     icon: ShoppingCart, label: 'السلة'    },
  { id: 'wishlist', icon: Heart,        label: 'المحفوظة' },
  { id: 'profile',  icon: User,         label: 'حسابي'    },
];

export function TabBar() {
  const { route, navigate, cartCount, wishlist } = useApp();

  const isActive = (id: RouteTab) =>
    id === 'home'
      ? (route === 'home' || route === 'product' || route === 'listing')
      : route === id;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: COLORS.card,
      borderTop: `1px solid ${COLORS.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      height: 64,
      boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {TABS.map(({ id, icon: Icon, label }) => {
        const active = isActive(id);
        const badge  = id === 'cart' ? cartCount : id === 'wishlist' ? wishlist.length : 0;
        return (
          <button
            key={id}
            onClick={() => navigate(id)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 12px', position: 'relative', flex: 1 }}
          >
            {active && (
              <span style={{ position: 'absolute', top: 4, width: 18, height: 3, borderRadius: 9999, background: COLORS.primary }} />
            )}
            <div style={{ position: 'relative', marginTop: 4 }}>
              <Icon
                size={22}
                strokeWidth={active ? 2.3 : 1.6}
                style={{ color: active ? COLORS.tabActive : COLORS.tabInactive, transition: 'color 0.2s' }}
              />
              {badge > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -8,
                  background: COLORS.badge, color: '#fff',
                  fontSize: 9, fontWeight: 800,
                  width: 16, height: 16, borderRadius: 9999,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${COLORS.card}`,
                }}>
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
