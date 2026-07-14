import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Package, Heart, ShoppingBag, Star, MapPin, Pencil, Trash2, X, AlertTriangle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { COLORS, RADIUS, SHADOW } from '@/theme';
import type { Listing } from '@/types';

/* ─── mapRow ────────────────────────────────────────────────────────────── */
function mapRow(r: Record<string, unknown>): Listing {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    userName: r.user_name as string,
    userAvatar: r.user_avatar as string,
    userCity: r.user_city as string,
    userRating: Number(r.user_rating) || 4.5,
    title: r.title as string,
    description: r.description as string,
    price: r.price != null ? Number(r.price) : null,
    priceLabel: r.price_label as string,
    type: r.type as Listing['type'],
    typeLabel: r.type_label as string,
    category: r.category as string,
    image: r.image as string,
    city: r.city as string,
    phone: r.phone as string,
    whatsapp: r.whatsapp as string,
    createdAt: r.created_at as string,
    likes: Number(r.likes) || 0,
    comments: Number(r.comments) || 0,
    views: Number(r.views) || 0,
    badge: r.badge as Listing['badge'],
  };
}

/* ─── Delete confirmation dialog ────────────────────────────────────────── */
interface DeleteDialogProps {
  listingTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function DeleteDialog({ listingTitle, onConfirm, onCancel, loading }: DeleteDialogProps) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 340,
          background: COLORS.card,
          borderRadius: RADIUS.xl,
          boxShadow: SHADOW.lg,
          overflow: 'hidden',
        }}
      >
        {/* Dialog header */}
        <div style={{ padding: '18px 18px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, background: '#FEF2F2', borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={20} style={{ color: COLORS.error }} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 900, color: COLORS.textPrimary, margin: 0 }}>حذف الإعلان</p>
              <p style={{ fontSize: 12, color: COLORS.textTertiary, margin: '2px 0 0' }}>هذا الإجراء لا يمكن التراجع عنه</p>
            </div>
          </div>
          <button onClick={onCancel} style={{ width: 28, height: 28, background: COLORS.cardAlt, borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${COLORS.border}` }}>
            <X size={14} style={{ color: COLORS.textTertiary }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 18px 18px' }}>
          <div style={{ background: COLORS.cardAlt, borderRadius: RADIUS.lg, padding: '10px 13px', marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: 0, lineHeight: 1.5 }}>
              هل أنت متأكد من حذف إعلان{' '}
              <span style={{ fontWeight: 800, color: COLORS.textPrimary }}>"{listingTitle}"</span>
              ؟
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onCancel}
              disabled={loading}
              style={{ flex: 1, height: 44, background: COLORS.cardAlt, border: `1.5px solid ${COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 13, fontWeight: 800, color: COLORS.textSecondary, cursor: 'pointer' }}
            >
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1, height: 44,
                background: loading ? '#FEE2E2' : COLORS.error,
                border: 'none', borderRadius: RADIUS.lg,
                fontSize: 13, fontWeight: 900, color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  جاري الحذف…
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  حذف
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export function ProfileScreen() {
  const nav = useNavigate();
  const { user, signOut } = useApp();

  const [listings, setListings]         = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [activeTab, setActiveTab]       = useState<'listings' | 'about'>('listings');

  /* delete dialog state */
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [deleting, setDeleting]         = useState(false);

  /* ── fetch user listings ─────────────────────────────────────────────── */
  const fetchListings = useCallback(async () => {
    if (!user) { setLoadingListings(false); return; }
    setLoadingListings(true);
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setListings(data.map(r => mapRow(r as Record<string, unknown>)));
    setLoadingListings(false);
  }, [user]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  /* ── delete handler ──────────────────────────────────────────────────── */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from('listings').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    if (error) {
      alert('فشل الحذف: ' + error.message);
      return;
    }
    setListings(prev => prev.filter(l => l.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  /* ── auth guard ──────────────────────────────────────────────────────── */
  if (!user) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: COLORS.background, gap: 16, padding: 24, minHeight: '80vh' }}>
        <p style={{ fontSize: 52, margin: 0 }}>👤</p>
        <p style={{ fontSize: 17, fontWeight: 900, color: COLORS.textPrimary, textAlign: 'center', margin: 0 }}>تسجيل الدخول مطلوب</p>
        <p style={{ fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', margin: 0 }}>سجّل دخولك للوصول إلى حسابك وإعلاناتك</p>
        <button
          onClick={() => nav('/login')}
          style={{ padding: '12px 32px', background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary700})`, color: '#fff', borderRadius: RADIUS.xl, fontWeight: 900, fontSize: 14, boxShadow: '0 4px 14px rgba(255,107,0,0.3)' }}
        >
          تسجيل الدخول
        </button>
      </div>
    );
  }

  const stats = [
    { icon: Package, label: 'إعلاناتي', value: listings.length },
    { icon: Star,    label: 'التقييم',   value: '4.8 ★' },
    { icon: Heart,   label: 'إعجابات',   value: listings.reduce((s, l) => s + l.likes, 0) },
  ];

  return (
    <div style={{ background: COLORS.background, minHeight: '100%', paddingBottom: 90 }}>
      {/* ── Header ── */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary700})`, padding: '52px 20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.2)', borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(255,255,255,0.4)', flexShrink: 0 }}>
              <span style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>{user.avatar ?? '👤'}</span>
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: '0 0 3px' }}>{user.name ?? 'مستخدم'}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{user.email}</p>
              {user.city && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                  <MapPin size={11} style={{ color: 'rgba(255,255,255,0.7)' }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{user.city}</span>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => nav('/about')}
              style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              <Settings size={16} style={{ color: '#fff' }} />
            </button>
            <button
              onClick={signOut}
              style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              <LogOut size={16} style={{ color: '#fff' }} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10 }}>
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: RADIUS.lg, padding: '10px 8px', textAlign: 'center', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Icon size={16} style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 4 }} />
              <p style={{ fontSize: 15, fontWeight: 900, color: '#fff', margin: '0 0 2px' }}>{value}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', borderBottom: `2px solid ${COLORS.border}`, background: COLORS.card }}>
        {([
          { key: 'listings', label: 'إعلاناتي', icon: ShoppingBag },
          { key: 'about',    label: 'حول الحساب', icon: Settings },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              flex: 1, padding: '12px 8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontSize: 13, fontWeight: 800,
              color: activeTab === key ? COLORS.primary : COLORS.textTertiary,
              borderBottom: `2.5px solid ${activeTab === key ? COLORS.primary : 'transparent'}`,
              marginBottom: -2,
              background: 'none', border: 'none', borderBottomWidth: 2.5,
              borderBottomStyle: 'solid',
              borderBottomColor: activeTab === key ? COLORS.primary : 'transparent',
              cursor: 'pointer',
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div style={{ padding: 16 }}>
        {activeTab === 'listings' && (
          <>
            {/* Post new ad CTA */}
            <button
              onClick={() => nav('/post_ad')}
              style={{
                width: '100%', height: 50, marginBottom: 16,
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary700})`,
                borderRadius: RADIUS.xl, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 14px rgba(255,107,0,0.28)', border: 'none', cursor: 'pointer',
              }}
            >
              <Pencil size={16} style={{ color: '#fff' }} />
              <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>نشر إعلان جديد</span>
            </button>

            {loadingListings ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <div style={{ width: 28, height: 28, border: `3px solid ${COLORS.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <p style={{ fontSize: 42, margin: '0 0 12px' }}>📭</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 6px' }}>لا توجد إعلانات بعد</p>
                <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: 0 }}>ابدأ بنشر إعلانك الأول الآن</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {listings.map(listing => (
                  <ProductCard
                    key={listing.id}
                    listing={listing}
                    ownerActions={{
                      onEdit:   () => nav(`/edit_listing/${listing.id}`),
                      onDelete: () => setDeleteTarget(listing),
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'الاسم',         value: user.name ?? '—' },
              { label: 'البريد الإلكتروني', value: user.email },
              { label: 'المدينة',       value: user.city ?? '—' },
              { label: 'رقم الهاتف',   value: user.phone ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: COLORS.card, borderRadius: RADIUS.xl, padding: '14px 16px', boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}` }}>
                <p style={{ fontSize: 11, color: COLORS.textTertiary, margin: '0 0 4px', fontWeight: 600 }}>{label}</p>
                <p style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary, margin: 0 }}>{value}</p>
              </div>
            ))}

            <button
              onClick={signOut}
              style={{ height: 50, background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: RADIUS.xl, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', marginTop: 8 }}
            >
              <LogOut size={16} style={{ color: COLORS.error }} />
              <span style={{ fontSize: 14, fontWeight: 900, color: COLORS.error }}>تسجيل الخروج</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Delete confirmation dialog ── */}
      {deleteTarget && (
        <DeleteDialog
          listingTitle={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !deleting && setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
