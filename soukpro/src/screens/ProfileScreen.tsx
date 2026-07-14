import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Package, Bell, Info, ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { COLORS, RADIUS, FONT } from '@/theme';
import type { Listing } from '@/types';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { user, signOut } = useApp();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);

  useEffect(() => {
    if (user) fetchMyListings();
  }, [user]);

  async function fetchMyListings() {
    if (!user) return;
    setLoadingListings(true);
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setListings((data as Listing[]) ?? []);
    setLoadingListings(false);
  }

  async function handleSignOut() {
    await signOut();
    navigate('/welcome');
  }

  const menuItems = [
    { icon: <Package size={20} />, label: 'طلباتي', path: '/orders' },
    { icon: <Bell size={20} />, label: 'الإشعارات', path: '/notifications' },
    { icon: <Info size={20} />, label: 'عن التطبيق', path: '/about' },
  ];

  const userInitial = user?.email?.[0]?.toUpperCase() ?? '؟';
  const userName = user?.email?.split('@')[0] ?? 'زائر';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.background }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 20px', background: COLORS.primary }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: FONT.xl, fontWeight: 800, color: '#fff', margin: 0 }}>
              {userName}
            </h1>
            {user && (
              <p style={{ fontSize: FONT.xs, color: 'rgba(255,255,255,0.7)', margin: '4px 0 0' }}>{user.email}</p>
            )}
          </div>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff', fontWeight: 800 }}>
            {user ? userInitial : '👤'}
          </div>
        </div>

        {!user && (
          <button
            onClick={() => navigate('/login')}
            style={{ marginTop: 16, padding: '10px 0', width: '100%', background: '#fff', color: COLORS.primary, border: 'none', borderRadius: RADIUS.full, fontSize: FONT.base, fontWeight: 800, cursor: 'pointer' }}
          >
            تسجيل الدخول
          </button>
        )}
      </div>

      <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Post new ad */}
        {user && (
          <button
            onClick={() => navigate('/post_ad')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px 0', background: COLORS.primary, color: '#fff', border: 'none', borderRadius: RADIUS.lg, fontSize: FONT.md, fontWeight: 800, cursor: 'pointer' }}
          >
            <Plus size={20} />
            نشر إعلان جديد
          </button>
        )}

        {/* My Listings */}
        {user && (
          <div>
            <h2 style={{ fontSize: FONT.md, fontWeight: 800, color: COLORS.text, marginBottom: 12 }}>إعلاناتي</h2>
            {loadingListings ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
                <div style={{ width: 28, height: 28, border: `3px solid ${COLORS.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : listings.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: COLORS.textMuted, background: COLORS.surface, borderRadius: RADIUS.md, border: `1px solid ${COLORS.border}` }}>
                <p style={{ fontSize: FONT.sm }}>لا توجد إعلانات بعد</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {listings.map(listing => (
                  <div
                    key={listing.id}
                    onClick={() => navigate(`/listing/${listing.id}`)}
                    style={{ background: COLORS.surface, borderRadius: RADIUS.md, border: `1px solid ${COLORS.border}`, padding: 14, display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}
                  >
                    {listing.image_url && (
                      <img src={listing.image_url} alt={listing.title} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: RADIUS.sm, flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: FONT.sm, fontWeight: 700, color: COLORS.text, margin: '0 0 4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {listing.title}
                      </p>
                      <p style={{ fontSize: FONT.md, fontWeight: 800, color: COLORS.primary, margin: 0 }}>
                        {listing.price.toLocaleString('ar-MA')} د.م.
                      </p>
                    </div>
                    <ChevronLeft size={18} color={COLORS.textMuted} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Menu Items */}
        <div style={{ background: COLORS.surface, borderRadius: RADIUS.md, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          {menuItems.map((item, i) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 16px',
                background: 'none',
                border: 'none',
                borderBottom: i < menuItems.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                cursor: 'pointer',
                color: COLORS.text,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: COLORS.textSecondary }}>{item.icon}</span>
                <span style={{ fontSize: FONT.base, fontWeight: 600 }}>{item.label}</span>
              </div>
              <ChevronLeft size={18} color={COLORS.textMuted} />
            </button>
          ))}
        </div>

        {/* Sign out */}
        {user && (
          <button
            onClick={handleSignOut}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px 0', background: '#FEE2E2', color: COLORS.error, border: 'none', borderRadius: RADIUS.lg, fontSize: FONT.base, fontWeight: 700, cursor: 'pointer' }}
          >
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        )}
      </div>
    </div>
  );
}
