import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, MapPin, Heart, ExternalLink, ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { LISTING_TYPES } from '@/data';
import type { Listing } from '@/types';
import { COLORS, RADIUS, SHADOW } from '@/theme';
import { supabase } from '@/lib/supabase';

const CITY_REGIONS = [
  { label: 'الدار البيضاء الكبرى', cities: ['Casablanca', 'Mohammedia', 'Berrechid', 'El Jadida', 'Settat', 'Ben Guerir'] },
  { label: 'الرباط - سلا - القنيطرة', cities: ['Rabat', 'Salé', 'Temara', 'Kenitra', 'Skhirat', 'Tiflet'] },
  { label: 'فاس - مكناس', cities: ['Fez', 'Meknes', 'Ifrane', 'Khenifra', 'Errachidia'] },
  { label: 'مراكش - آسفي', cities: ['Marrakech', 'Safi', 'Essaouira', 'El Kelaa des Sraghna', 'Chichaoua'] },
  { label: 'طنجة - تطوان - الحسيمة', cities: ['Tangier', 'Tetouan', 'Al Hoceima', 'Chefchaouen', 'Larache', 'Asilah', 'Fnideq'] },
  { label: 'الشرق', cities: ['Oujda', 'Nador', 'Berkane', 'Taza', 'Taourirt', 'Guercif'] },
  { label: 'سوس - ماسة', cities: ['Agadir', 'Inezgane', 'Taroudant', 'Tiznit', 'Ouarzazate', 'Zagora'] },
  { label: 'درعة - تافيلالت', cities: ['Taliouine', 'Midelt', 'Tinghir', 'Rissani', 'Erfoud'] },
  { label: 'بني ملال - خنيفرة', cities: ['Beni Mellal', 'Khouribga', 'Fqih Ben Salah', 'Azilal'] },
  { label: 'كلميم - وادي نون', cities: ['Guelmim', 'Tan-Tan', 'Sidi Ifni'] },
  { label: 'الجنوب', cities: ['Dakhla', 'Boujdour', 'Laayoune', 'Smara'] },
];

const ALL_CITIES = CITY_REGIONS.flatMap(r => r.cities);

/* ── Listing card ── */
function ListingCard({ l }: { l: Listing }) {
  const nav = useNavigate();
  const { toggleLike, isLiked, likeCounts } = useApp();
  const liked = isLiked(l.id);
  const likes = likeCounts[l.id] ?? l.likes;
  return (
    <div style={{ background: COLORS.card, borderRadius: RADIUS.xl, overflow: 'hidden', boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}`, marginBottom: 10 }}>
      <div style={{ display: 'flex' }}>
        <div onClick={() => nav(`/listing/${l.id}`)} style={{ width: 110, flexShrink: 0, position: 'relative', cursor: 'pointer', background: COLORS.cardAlt }}>
          <img src={l.image} alt={l.title} style={{ width: '100%', height: '100%', minHeight: 110, objectFit: 'cover' }} />
          {l.badge && (
            <span style={{ position: 'absolute', top: 6, left: 6, fontSize: 9, fontWeight: 800, background: l.badge === 'urgent' ? COLORS.error : l.badge === 'featured' ? '#B45309' : '#15803D', color: '#fff', padding: '2px 6px', borderRadius: RADIUS.full }}>
              {l.badge === 'urgent' ? 'عاجل' : l.badge === 'featured' ? 'مميز' : 'جديد'}
            </span>
          )}
        </div>
        <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary, margin: '0 0 4px', lineHeight: 1.35 }}>{l.title}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5 }}>
              <MapPin size={10} style={{ color: COLORS.primary, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: COLORS.textSecondary }}>{l.city}</span>
              <span style={{ fontSize: 10, color: COLORS.border }}>•</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.textTertiary, background: COLORS.cardAlt, padding: '1px 6px', borderRadius: RADIUS.full }}>{l.typeLabel}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: COLORS.primary }}>{l.priceLabel}</span>
            <div style={{ display: 'flex', gap: 5 }}>
              <button onClick={() => toggleLike(l.id, l.likes)} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 7px', background: liked ? '#FEF2F2' : COLORS.cardAlt, borderRadius: RADIUS.md }}>
                <Heart size={11} style={{ color: liked ? COLORS.error : COLORS.textTertiary, fill: liked ? COLORS.error : 'none' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: liked ? COLORS.error : COLORS.textTertiary }}>{likes}</span>
              </button>
              <button onClick={() => nav(`/listing/${l.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 8px', background: COLORS.primary100, borderRadius: RADIUS.md }}>
                <ExternalLink size={11} style={{ color: COLORS.primary }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: COLORS.primary }}>تفاصيل</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchScreen() {
  const { searchQuery, setSearchQuery } = useApp();

  const [input, setInput]         = useState(searchQuery);
  const [activeType, setActiveType] = useState('all');
  const [activeCity, setActiveCity]   = useState('All Cities');
  const [cityInput, setCityInput]     = useState('');
  const [cityDropOpen, setCityDropOpen] = useState(false);
  const [dbListings, setDbListings] = useState<Listing[]>([]);
  const [loadingDB, setLoadingDB] = useState(true);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from('listings').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setDbListings(data.map(r => {
        const row = r as Record<string, unknown>;
        return {
          id: row.id as string, userId: row.user_id as string,
          userName: row.user_name as string, userAvatar: row.user_avatar as string,
          userCity: row.user_city as string, userRating: Number(row.user_rating) || 4.5,
          title: row.title as string, description: row.description as string,
          price: row.price != null ? Number(row.price) : null, priceLabel: row.price_label as string,
          type: row.type as Listing['type'], typeLabel: row.type_label as string,
          category: row.category as string, image: row.image as string,
          city: row.city as string, phone: row.phone as string, whatsapp: row.whatsapp as string,
          createdAt: row.created_at as string, likes: Number(row.likes) || 0,
          comments: Number(row.comments) || 0, views: Number(row.views) || 0,
          badge: row.badge as Listing['badge'],
        } as Listing;
      }));
      setLoadingDB(false);
    });
  }, []);

  const allListings: Listing[] = dbListings;

  const handleInput = (v: string) => { setInput(v); setSearchQuery(v); };

  const selectCity = (c: string) => { setActiveCity(c); setCityInput(c === 'All Cities' ? '' : c); setCityDropOpen(false); };
  const clearCity = () => { setActiveCity('All Cities'); setCityInput(''); setCityDropOpen(false); };

  const suggestions = cityInput.trim() ? ALL_CITIES.filter(c => c.toLowerCase().includes(cityInput.toLowerCase())) : ALL_CITIES;

  const sq = input.trim().toLowerCase();
  const results = allListings.filter(l => {
    const matchQ = !sq || l.title.toLowerCase().includes(sq) || l.description.toLowerCase().includes(sq) || l.city.toLowerCase().includes(sq);
    const matchT = activeType === 'all' || l.type === activeType;
    const matchC = activeCity === 'All Cities' || l.city === activeCity;
    return matchQ && matchT && matchC;
  });

  return (
    <div style={{ background: COLORS.background, minHeight: '100%', paddingBottom: 80 }}>

      {/* ── Sticky header ── */}
      <div style={{ background: COLORS.card, padding: '48px 16px 0', borderBottom: `1px solid ${COLORS.border}`, position: 'sticky', top: 0, zIndex: 50 }}>

        {/* ── 1. Search bar ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: COLORS.cardAlt, border: `1.5px solid ${COLORS.border}`, borderRadius: RADIUS.xl, padding: '0 14px', height: 46, marginBottom: 10 }}>
          <Search size={16} style={{ color: COLORS.textTertiary, flexShrink: 0 }} />
          <input
            autoFocus
            value={input}
            onChange={e => handleInput(e.target.value)}
            placeholder="ابحث: خدمة، منتج، كلمة…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: COLORS.textPrimary, direction: 'rtl' }}
          />
          {input && <button onClick={() => handleInput('')}><X size={14} style={{ color: COLORS.textTertiary }} /></button>}
        </div>

        {/* ── 2. City input with autocomplete dropdown ── */}
        <div ref={cityRef} style={{ position: 'relative', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: activeCity !== 'All Cities' ? COLORS.primary100 : COLORS.cardAlt, border: `1.5px solid ${activeCity !== 'All Cities' ? COLORS.primary : COLORS.border}`, borderRadius: cityDropOpen ? `${RADIUS.lg}px ${RADIUS.lg}px 0 0` : `${RADIUS.xl}px`, padding: '0 12px', height: 44, transition: 'border-color 0.15s' }}>
            <MapPin size={15} style={{ color: activeCity !== 'All Cities' ? COLORS.primary : COLORS.textTertiary, flexShrink: 0 }} />
            <input
              value={cityInput}
              onChange={e => { setCityInput(e.target.value); setCityDropOpen(true); if (!e.target.value) setActiveCity('All Cities'); }}
              onFocus={() => setCityDropOpen(true)}
              placeholder="ابحث عن مدينة… (مراكش، الدار البيضاء…)"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: COLORS.textPrimary, direction: 'rtl', fontWeight: activeCity !== 'All Cities' ? 700 : 400 }}
            />
            {activeCity !== 'All Cities'
              ? <button onClick={clearCity}><X size={14} style={{ color: COLORS.primary }} /></button>
              : <ChevronDown size={14} style={{ color: COLORS.textTertiary, transform: cityDropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            }
          </div>

          {/* Dropdown */}
          {cityDropOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: COLORS.card, border: `1.5px solid ${COLORS.primary}`, borderTop: 'none', borderRadius: `0 0 ${RADIUS.lg}px ${RADIUS.lg}px`, zIndex: 100, maxHeight: 260, overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              {/* All cities option */}
              <button
                onClick={() => { clearCity(); setCityDropOpen(false); }}
                style={{ width: '100%', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${COLORS.borderLight}`, background: activeCity === 'All Cities' ? COLORS.primary100 : 'transparent' }}
              >
                <span style={{ fontSize: 15 }}>🗺️</span>
                <span style={{ fontSize: 13, fontWeight: activeCity === 'All Cities' ? 800 : 500, color: activeCity === 'All Cities' ? COLORS.primary : COLORS.textPrimary }}>كل المدن</span>
                {activeCity === 'All Cities' && <div style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: 9999, background: COLORS.primary }} />}
              </button>

              {cityInput.trim() ? (
                /* flat search results */
                suggestions.length === 0
                  ? <p style={{ fontSize: 13, color: COLORS.textTertiary, padding: '14px', textAlign: 'center' }}>ما كاينا هاد المدينة</p>
                  : suggestions.map(c => (
                    <button key={c} onClick={() => selectCity(c)}
                      style={{ width: '100%', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${COLORS.borderLight}`, background: activeCity === c ? COLORS.primary100 : 'transparent' }}>
                      <MapPin size={12} style={{ color: activeCity === c ? COLORS.primary : COLORS.textTertiary, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: activeCity === c ? 800 : 400, color: activeCity === c ? COLORS.primary : COLORS.textPrimary }}>{c}</span>
                      {activeCity === c && <div style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: 9999, background: COLORS.primary }} />}
                    </button>
                  ))
              ) : (
                /* grouped by region */
                CITY_REGIONS.map(region => (
                  <div key={region.label}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: COLORS.textTertiary, margin: 0, padding: '8px 14px 4px', background: COLORS.background, letterSpacing: '0.05em' }}>{region.label}</p>
                    {region.cities.map(c => (
                      <button key={c} onClick={() => selectCity(c)}
                        style={{ width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${COLORS.borderLight}`, background: activeCity === c ? COLORS.primary100 : 'transparent' }}>
                        <MapPin size={11} style={{ color: activeCity === c ? COLORS.primary : COLORS.textTertiary, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: activeCity === c ? 700 : 400, color: activeCity === c ? COLORS.primary : COLORS.textPrimary }}>{c}</span>
                        {activeCity === c && <div style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: 9999, background: COLORS.primary }} />}
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ── 3. Type pills ── */}
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 12 }} className="scrollbar-hide">
          {LISTING_TYPES.map(t => {
            const active = activeType === t.id;
            return (
              <button key={t.id} onClick={() => setActiveType(t.id)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 32, padding: '0 14px', borderRadius: RADIUS.full, flexShrink: 0, fontSize: 12, fontWeight: 700, background: active ? COLORS.primary : COLORS.card, color: active ? '#fff' : COLORS.textSecondary, border: active ? 'none' : `1.5px solid ${COLORS.border}`, boxShadow: active ? '0 2px 8px rgba(232,87,42,0.25)' : 'none', transition: 'all 0.18s' }}>
                <span style={{ fontSize: 13 }}>{t.emoji}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Results ── */}
      <div style={{ padding: '12px 16px 0' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.textTertiary, margin: '0 0 10px' }}>
          {loadingDB ? 'جاري التحميل...' : `${results.length} إعلان`}
          {activeCity !== 'All Cities' ? ` · 📍 ${activeCity}` : ''}
          {activeType !== 'all' ? ` · ${LISTING_TYPES.find(t => t.id === activeType)?.label}` : ''}
        </p>
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '70px 0' }}>
            <p style={{ fontSize: 44, margin: '0 0 12px' }}>🔍</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, margin: '0 0 6px' }}>ما كاين والو</p>
            <p style={{ fontSize: 13, color: COLORS.textTertiary }}>جرب كلمة أخرى أو غير الفلتر</p>
          </div>
        ) : (
          results.map(l => <ListingCard key={l.id} l={l} />)
        )}
      </div>
    </div>
  );
}
