import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MapPin, Plus, Heart, MessageCircle, Share2, Eye, Phone, ExternalLink, ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { LISTING_TYPES, MOROCCAN_CITIES } from '@/data';
import type { Listing } from '@/types';
import { SearchBar } from '@/components/SearchBar';
import { COLORS, RADIUS, SHADOW } from '@/theme';
import { supabase } from '@/lib/supabase';

const TYPE_COLORS: Record<string, string> = {
  sale: '#16A34A', service: COLORS.primary, job: '#7C3AED', rent: '#0284C7',
};

const BADGE_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  urgent:   { bg: '#FEF2F2', text: COLORS.error,   label: 'عاجل'    },
  featured: { bg: '#FFFBEB', text: '#B45309',       label: 'مميز'    },
  new:      { bg: '#F0FDF4', text: '#15803D',       label: 'جديد'    },
};

function ListingSkeleton() {
  const base = { background: COLORS.cardAlt, borderRadius: RADIUS.md } as const;
  return (
    <div style={{ background: COLORS.card, borderRadius: RADIUS.xxl, overflow: 'hidden', boxShadow: SHADOW.md, border: `1px solid ${COLORS.border}`, marginBottom: 14 }}>
      <div style={{ padding: '12px 14px 10px', display: 'flex', gap: 10 }}>
        <div style={{ ...base, width: 40, height: 40, borderRadius: RADIUS.full }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ ...base, height: 13, width: '60%' }} />
          <div style={{ ...base, height: 11, width: '40%' }} />
        </div>
      </div>
      <div style={{ ...base, height: 210, borderRadius: 0 }} />
      <div style={{ padding: '12px 14px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ ...base, height: 15, width: '80%' }} />
        <div style={{ ...base, height: 12, width: '95%' }} />
      </div>
      <div style={{ height: 48, background: COLORS.cardAlt, margin: '0 14px 14px', borderRadius: RADIUS.lg }} />
    </div>
  );
}

function BannerAd() {
  return (
    <div style={{ margin: '0 16px 6px', borderRadius: RADIUS.xl, overflow: 'hidden', background: 'linear-gradient(135deg,#1e3a5f 0%,#2d6a9f 100%)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 28 }}>📢</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: '#93C5FD', margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>إعلان مدفوع</p>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>روّج إعلانك للجمهور المناسب</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', margin: 0 }}>من 19 درهم فقط • نتائج سريعة</p>
      </div>
      <button style={{ background: COLORS.primary, color: '#fff', fontSize: 11, fontWeight: 800, padding: '6px 12px', borderRadius: RADIUS.md, flexShrink: 0 }}>ابدأ</button>
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const nav = useNavigate();
  const { toggleLike, isLiked, likeCounts } = useApp();
  const liked     = isLiked(listing.id);
  const likeCount = likeCounts[listing.id] ?? listing.likes;
  const badgeCfg  = listing.badge ? BADGE_STYLE[listing.badge] : null;
  const typeColor = TYPE_COLORS[listing.type] ?? COLORS.primary;
  const timeAgo   = (() => {
    const diff = Date.now() - new Date(listing.createdAt).getTime();
    const h = Math.floor(diff / 3600000);
    return h < 1 ? 'منذ قليل' : h < 24 ? `منذ ${h}س` : `منذ ${Math.floor(h / 24)}ي`;
  })();

  const handleShare = async () => {
    const url = `${window.location.origin}/listing/${listing.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: listing.title, text: listing.description, url }); }
      catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      alert('تم نسخ الرابط');
    }
  };

  return (
    <div style={{ background: COLORS.card, borderRadius: RADIUS.xxl, overflow: 'hidden', boxShadow: SHADOW.md, border: `1px solid ${COLORS.border}`, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px 10px' }}>
        <div style={{ width: 40, height: 40, background: `linear-gradient(135deg,${COLORS.primary},${COLORS.primary700})`, borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{listing.userAvatar}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary }}>{listing.userName}</span>
            {listing.userRating >= 4.8 && <span style={{ fontSize: 10, background: '#FFFBEB', color: '#B45309', padding: '1px 6px', borderRadius: RADIUS.full, fontWeight: 700 }}>{listing.userRating}</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={10} style={{ color: COLORS.textTertiary }} />
            <span style={{ fontSize: 11, color: COLORS.textTertiary }}>{listing.userCity}</span>
            <span style={{ fontSize: 10, color: COLORS.border }}>•</span>
            <span style={{ fontSize: 11, color: COLORS.textTertiary }}>{timeAgo}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {badgeCfg && (
            <span style={{ fontSize: 10, fontWeight: 800, background: badgeCfg.bg, color: badgeCfg.text, padding: '3px 8px', borderRadius: RADIUS.full }}>{badgeCfg.label}</span>
          )}
          <span style={{ fontSize: 10, fontWeight: 700, background: typeColor + '18', color: typeColor, padding: '3px 8px', borderRadius: RADIUS.full }}>{listing.typeLabel}</span>
        </div>
      </div>

      <div style={{ position: 'relative', height: 210, overflow: 'hidden', background: COLORS.cardAlt, cursor: 'pointer' }} onClick={() => nav(`/listing/${listing.id}`)}>
        <img src={listing.image} alt={listing.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 100%)', padding: '20px 14px 10px' }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>{listing.priceLabel}</span>
        </div>
        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', borderRadius: RADIUS.full, padding: '3px 8px' }}>
          <Eye size={11} style={{ color: '#fff' }} />
          <span style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>{listing.views}</span>
        </div>
      </div>

      <div style={{ padding: '12px 14px 8px' }} onClick={() => nav(`/listing/${listing.id}`)}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 4px', lineHeight: 1.3, cursor: 'pointer' }}>{listing.title}</h3>
        <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: 0, lineHeight: 1.5 }} className="line-clamp-2">{listing.description}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', padding: '6px 14px 12px', gap: 0, borderTop: `1px solid ${COLORS.borderLight}` }}>
        <button onClick={() => toggleLike(listing.id, listing.likes)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px 7px 6px', borderRadius: RADIUS.lg, background: liked ? '#FEF2F2' : 'transparent' }}>
          <Heart size={18} style={{ color: liked ? COLORS.error : COLORS.textSecondary, fill: liked ? COLORS.error : 'none', transition: 'all 0.2s' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: liked ? COLORS.error : COLORS.textSecondary }}>{likeCount}</span>
        </button>
        <button onClick={() => nav(`/listing/${listing.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: RADIUS.lg }}>
          <MessageCircle size={18} style={{ color: COLORS.textSecondary }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textSecondary }}>{listing.comments}</span>
        </button>
        <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: RADIUS.lg }}>
          <Share2 size={17} style={{ color: COLORS.textSecondary }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSecondary }}>مشاركة</span>
        </button>
        <div style={{ flex: 1 }} />
        <button onClick={() => nav(`/listing/${listing.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 10px', background: COLORS.primary100, borderRadius: RADIUS.lg }}>
          <ExternalLink size={14} style={{ color: COLORS.primary }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: COLORS.primary }}>تفاصيل</span>
        </button>
        <a href={`https://wa.me/${listing.whatsapp.replace('+', '')}?text=مرحبا، رأيت إعلانك "${listing.title}" على SoukPro`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 10px', background: '#DCFCE7', borderRadius: RADIUS.lg, marginLeft: 6, textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
          <Phone size={14} style={{ color: '#16A34A' }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: '#16A34A' }}>واتساب</span>
        </a>
      </div>
    </div>
  );
}

export function HomeScreen() {
  const nav = useNavigate();
  const { user, unreadCount } = useApp();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [activeCity, setActiveCity] = useState('All Cities');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [dbListings, setDbListings] = useState<Listing[]>([]);
  const [loadingDB, setLoadingDB] = useState(true);

  useEffect(() => {
    const fetchListings = () => {
      supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) setDbListings(data.map(mapRow));
          setLoadingDB(false);
        });
    };

    fetchListings();

    const channel = supabase
      .channel('listings_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'listings' }, () => {
        fetchListings();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Only real Supabase data — no static merge
  const allListings: Listing[] = dbListings;

  const sq = search.trim().toLowerCase();
  const filtered = allListings.filter(l => {
    const matchT = activeType === 'all' || l.type === activeType;
    const matchC = activeCity === 'All Cities' || l.city === activeCity;
    const matchQ = !sq || l.title.toLowerCase().includes(sq) || l.description.toLowerCase().includes(sq) || l.city.toLowerCase().includes(sq);
    return matchT && matchC && matchQ;
  });

  return (
    <div style={{ background: COLORS.background, minHeight: '100%', paddingBottom: 88 }}>
      <div style={{ background: COLORS.card, padding: '48px 16px 0', boxShadow: SHADOW.sm, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
              <MapPin size={12} style={{ color: COLORS.primary }} />
              <button onClick={() => setShowCityPicker(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, color: COLORS.textSecondary, fontWeight: 600 }}>
                {activeCity === 'All Cities' ? (user?.city ?? 'المغرب') : activeCity}
                <ChevronDown size={12} />
              </button>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: COLORS.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>
              <span style={{ color: COLORS.primary }}>Souk</span>Pro
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => nav('/notifications')} style={{ width: 40, height: 40, background: COLORS.cardAlt, borderRadius: RADIUS.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: `1px solid ${COLORS.border}` }}>
              <Bell size={18} style={{ color: COLORS.textSecondary }} />
              {unreadCount > 0 && <span style={{ position: 'absolute', top: 7, right: 7, width: 9, height: 9, background: COLORS.error, borderRadius: 9999, border: '2px solid white' }} />}
            </button>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="ابحث عن منتج، خدمة، مدينة…" />
        </div>
        {showCityPicker && (
          <div style={{ position: 'absolute', top: '100%', left: 16, right: 16, background: COLORS.card, borderRadius: RADIUS.xl, boxShadow: SHADOW.lg, border: `1px solid ${COLORS.border}`, zIndex: 200, maxHeight: 240, overflowY: 'auto' }}>
            {MOROCCAN_CITIES.map(city => (
              <button key={city} onClick={() => { setActiveCity(city); setShowCityPicker(false); }} style={{ width: '100%', padding: '11px 16px', textAlign: 'right', fontSize: 13, fontWeight: activeCity === city ? 800 : 500, color: activeCity === city ? COLORS.primary : COLORS.textPrimary, background: activeCity === city ? COLORS.primary100 : 'transparent', borderBottom: `1px solid ${COLORS.borderLight}` }}>
                {city}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12 }} className="scrollbar-hide">
          {LISTING_TYPES.map(t => {
            const active = activeType === t.id;
            return (
              <button key={t.id} onClick={() => setActiveType(t.id)} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: RADIUS.full, fontSize: 12, fontWeight: 700, background: active ? COLORS.primary : COLORS.card, color: active ? '#fff' : COLORS.textSecondary, border: active ? 'none' : `1.5px solid ${COLORS.border}`, boxShadow: active ? SHADOW.primary : 'none', transition: 'all 0.2s' }}>
                <span style={{ fontSize: 14 }}>{t.emoji}</span> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '14px 16px 0' }} onClick={() => showCityPicker && setShowCityPicker(false)}>
        <BannerAd />
        {loadingDB ? (
          <>{Array.from({ length: 3 }).map((_, i) => <ListingSkeleton key={i} />)}</>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 40, margin: '0 0 10px' }}>🔍</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>ما كاين والو</p>
            <p style={{ fontSize: 13, color: COLORS.textTertiary }}>جرب تبدل الفلتر أو المدينة</p>
          </div>
        ) : (
          filtered.map((l, idx) => (
            <div key={l.id}>
              {idx === 4 && (
                <div style={{ margin: '0 0 14px', borderRadius: RADIUS.xl, overflow: 'hidden', background: `linear-gradient(135deg,#7C3AED,#5B21B6)`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 28 }}>💎</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: '#C4B5FD', margin: '0 0 2px', letterSpacing: '0.05em' }}>VIP PREMIUM</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>ظهور أكثر • عملاء أكثر</p>
                  </div>
                  <button style={{ background: '#fff', color: '#7C3AED', fontSize: 11, fontWeight: 800, padding: '6px 12px', borderRadius: RADIUS.md }}>اكتشف</button>
                </div>
              )}
              <ListingCard listing={l} />
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => nav('/post_ad')}
        style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 80px)', maxWidth: 350, height: 52, background: `linear-gradient(135deg,${COLORS.primary},${COLORS.primary700})`, color: '#fff', fontWeight: 900, fontSize: 15, borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: `${SHADOW.primary}, 0 0 0 4px rgba(232,87,42,0.15)`, zIndex: 90, letterSpacing: '-0.01em', transition: 'transform 0.15s, box-shadow 0.15s' }}
      >
        <div style={{ width: 26, height: 26, background: 'rgba(255,255,255,0.22)', borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={16} style={{ color: '#fff' }} />
        </div>
        أضف إعلان مجاناً
      </button>
    </div>
  );
}

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
