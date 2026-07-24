import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, MapPin, Bell, Shield, HelpCircle, LogOut, ChevronRight, Star, Info, Settings, Plus, Phone, Package, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { COLORS, RADIUS, SHADOW } from '@/theme';
import type { Listing } from '@/types';
import { supabase } from '@/lib/supabase';
import { FollowStats } from '@/components/FollowButton';

function mapRow(r: Record<string, unknown>): Listing {
  return {
    id: r.id as string, userId: r.user_id as string,
    userName: r.user_name as string, userAvatar: r.user_avatar as string,
    userCity: r.user_city as string, userRating: Number(r.user_rating) || 4.5,
    title: r.title as string, description: r.description as string,
    price: r.price != null ? Number(r.price) : null, priceLabel: r.price_label as string,
    type: r.type as Listing['type'], typeLabel: r.type_label as string,
    category: r.category as string, image: r.image as string,
    city: r.city as string, phone: r.phone as string, whatsapp: r.whatsapp as string,
    createdAt: r.created_at as string, likes: Number(r.likes) || 0,
    comments: Number(r.comments) || 0, views: Number(r.views) || 0,
    badge: r.badge as Listing['badge'],
  };
}

function MyListingRow({ l, onDelete }: { l: Listing; onDelete: (id: string) => void }) {
  const nav = useNavigate();
  return (
    <div style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: `1px solid ${COLORS.borderLight}` }}>
      <div onClick={() => nav(`/listing/${l.id}`)} style={{ width: 56, height: 56, borderRadius: RADIUS.lg, overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}>
        <img src={l.image} alt={l.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => nav(`/listing/${l.id}`)}>
        <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary, margin: '0 0 2px' }} className="line-clamp-1">{l.title}</p>
        <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary, margin: '0 0 3px' }}>{l.priceLabel}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 10, color: COLORS.textTertiary }}>❤️ {l.likes}</span>
          <span style={{ fontSize: 10, color: COLORS.textTertiary }}>💬 {l.comments}</span>
          <span style={{ fontSize: 10, color: COLORS.textTertiary }}>👁 {l.views}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, marginTop: 8 }}>
        <button onClick={(e) => { e.stopPropagation(); nav(`/edit_listing/${l.id}`); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, background: COLORS.primary100, border: `1px solid ${COLORS.primary200}`, borderRadius: RADIUS.md, cursor: 'pointer' }} title="تعديل">
          <Pencil size={13} style={{ color: COLORS.primary }} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(l.id); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: RADIUS.md, cursor: 'pointer' }} title="حذف">
          <Trash2 size={13} style={{ color: COLORS.error }} />
        </button>
      </div>
    </div>
  );
}

function useToast() {
  const [msg, setMsg] = useState('');
  const show = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(''), 2500);
  };
  return { msg, show };
}

export function ProfileScreen() {
  const nav = useNavigate();
  const { user, wishlist, logout } = useApp();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (!user) return;
    supabase.from('listings').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setMyListings(data.map(r => mapRow(r as Record<string, unknown>))); });
  }, [user]);

  const soon = () => toast.show('قريباً — هذه الخاصية قيد التطوير 🚧');

  const MENU = [
    { icon: Package,    label: 'طلباتي',          sub: '3 طلبات نشطة',               action: () => nav('/orders') },
    { icon: Heart,      label: 'المحفوظة',         sub: `${wishlist.length} منتج`,    action: () => nav('/wishlist') },
    { icon: Bell,       label: 'الإشعارات',        sub: 'التنبيهات والتذكيرات',       action: () => nav('/notifications') },
    { icon: MapPin,     label: 'عناوين التوصيل',   sub: 'إدارة العناوين',             action: soon },
    { icon: Settings,   label: 'إعدادات الحساب',   sub: 'كلمة السر، اللغة',           action: soon },
    { icon: Shield,     label: 'الخصوصية والأمان', sub: 'تحكم في بياناتك',           action: soon },
    { icon: HelpCircle, label: 'المساعدة والدعم',  sub: 'الأسئلة الشائعة',           action: soon },
    { icon: Info,       label: 'حول SoukPro',      sub: 'قصتنا ومهمتنا',             action: () => nav('/about') },
  ];

  return (
    <div style={{ background: COLORS.background, minHeight: '100%', paddingBottom: 88 }}>
      <div style={{ background: `linear-gradient(135deg,${COLORS.primary},${COLORS.primary700})`, padding: '48px 16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 66, height: 66, background: 'rgba(255,255,255,0.2)', borderRadius: RADIUS.xxl, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)' }}>
              <span style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>{user?.avatar ?? 'G'}</span>
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, background: COLORS.success, borderRadius: 9999, border: '2.5px solid white' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: '0 0 2px', letterSpacing: '-0.02em' }}>{user?.name ?? 'ضيف'}</h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '0 0 4px' }}>{user?.email ?? 'مش مسجل'}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(255,255,255,0.18)', padding: '3px 8px', borderRadius: RADIUS.full }}>
                <Star size={10} style={{ fill: '#FFD700', color: '#FFD700' }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{user?.rating?.toFixed(1) ?? '—'}</span>
              </div>
              {user?.city && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(255,255,255,0.18)', padding: '3px 8px', borderRadius: RADIUS.full }}>
                  <MapPin size={10} style={{ color: '#fff' }} />
                  <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{user.city}</span>
                </div>
              )}
            </div>
            {user && (
              <div style={{ marginTop: 8 }}>
                <FollowStats userId={user.id} onWhite={false} />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button style={{ fontSize: 11, fontWeight: 800, color: COLORS.primary, background: '#fff', padding: '6px 12px', borderRadius: RADIUS.md }}>تعديل</button>
            {user?.phone && (
              <a href={`tel:${user.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.18)', padding: '5px 10px', borderRadius: RADIUS.md, textDecoration: 'none' }}>
                <Phone size={11} /> تواصل
              </a>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '14px 16px 0' }}>
        {[
          { label: 'الطلبات',  value: String(user?.orders ?? 0),   color: COLORS.info },
          { label: 'المحفوظة', value: String(wishlist.length),      color: COLORS.error },
          { label: 'إعلاناتي', value: String(myListings.length),    color: COLORS.primary },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: COLORS.card, borderRadius: RADIUS.xl, padding: '14px 10px', textAlign: 'center', boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: COLORS.textPrimary, margin: '0 0 2px' }}>{value}</p>
            <div style={{ width: 6, height: 6, borderRadius: 9999, background: color, margin: '0 auto 4px' }} />
            <p style={{ fontSize: 10, color: COLORS.textTertiary, margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ margin: '14px 16px 0', background: COLORS.card, borderRadius: RADIUS.xl, padding: '14px 16px', boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary, margin: 0 }}>إعلاناتي</h3>
          <button onClick={() => nav('/post_ad')} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 800, color: '#fff', background: COLORS.primary, padding: '6px 12px', borderRadius: RADIUS.md, boxShadow: SHADOW.primary }}>
            <Plus size={13} /> إضافة
          </button>
        </div>
        {myListings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ fontSize: 30, margin: '0 0 8px' }}>📋</p>
            <p style={{ fontSize: 13, color: COLORS.textTertiary, margin: 0 }}>ما عندكش إعلانات بعد</p>
            <button onClick={() => nav('/post_ad')} style={{ marginTop: 10, fontSize: 13, fontWeight: 800, color: COLORS.primary, background: COLORS.primary100, padding: '8px 16px', borderRadius: RADIUS.lg }}>
              أضف أول إعلان 🚀
            </button>
          </div>
        ) : (
          myListings.map(l => <MyListingRow key={l.id} l={l} onDelete={async (lid) => {
            if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
            const { error } = await supabase.from('listings').delete().eq('id', lid);
            if (error) { alert('فشل الحذف: ' + error.message); return; }
            setMyListings(prev => prev.filter(x => x.id !== lid));
          }} />)
        )}
      </div>

      <div style={{ margin: '14px 16px 0', background: COLORS.card, borderRadius: RADIUS.xl, overflow: 'hidden', boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}` }}>
        {MENU.map(({ icon: Icon, label, sub, action }, i) => (
          <button key={label} onClick={action}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < MENU.length - 1 ? `1px solid ${COLORS.borderLight}` : 'none', textAlign: 'left', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = COLORS.cardAlt)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <div style={{ width: 34, height: 34, background: COLORS.primary100, borderRadius: RADIUS.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={15} style={{ color: COLORS.primary }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>{label}</p>
              <p style={{ fontSize: 11, color: COLORS.textTertiary, margin: 0 }}>{sub}</p>
            </div>
            <ChevronRight size={15} style={{ color: COLORS.textTertiary }} />
          </button>
        ))}
      </div>

      <button onClick={logout}
        style={{ margin: '12px 16px 0', width: 'calc(100% - 32px)', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: COLORS.card, borderRadius: RADIUS.xl, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}
        onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
        onMouseLeave={e => (e.currentTarget.style.background = COLORS.card)}>
        <div style={{ width: 34, height: 34, background: '#FEF2F2', borderRadius: RADIUS.lg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LogOut size={15} style={{ color: COLORS.error }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.error }}>تسجيل الخروج</span>
      </button>

      <p style={{ textAlign: 'center', fontSize: 11, color: COLORS.textTertiary, padding: '16px 0 4px' }}>SoukPro v2.2.0 · صنع بـ ❤️ في المغرب 🇲🇦</p>

      {toast.msg && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', background: COLORS.textPrimary, color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: RADIUS.full, zIndex: 9999, boxShadow: SHADOW.lg, whiteSpace: 'nowrap', animation: 'fadeIn 0.2s ease' }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
