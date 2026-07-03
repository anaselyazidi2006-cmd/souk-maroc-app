import { useState } from 'react';
import { ArrowLeft, Heart, ShoppingCart, Share2, MapPin, Shield, Truck, RefreshCw, ChevronRight, Plus, Minus, Star, Package } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { getProductById, getReviews, PRODUCTS } from '@/data';
import { StarRating } from '@/components/StarRating';
import { ProductCard } from '@/components/ProductCard';
import { COLORS, RADIUS, SHADOW } from '@/theme';

export function ProductScreen() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const product = getProductById(id ?? '');
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!product) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: COLORS.background, gap: 12 }}>
        <p style={{ fontSize: 48, margin: 0 }}>📦</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>المنتج غير موجود</p>
        <button onClick={() => nav('/home')} style={{ padding: '8px 20px', background: COLORS.primary, color: '#fff', borderRadius: RADIUS.lg, fontWeight: 700, fontSize: 13 }}>الرئيسية</button>
      </div>
    );
  }

  const reviews  = getReviews(product.id);
  const wished   = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const related  = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const shown    = showAllReviews ? reviews : reviews.slice(0, 2);

  const dist = [5,4,3,2,1].map(s => {
    const n = reviews.filter(r => Math.round(r.rating) === s).length;
    return { s, n, pct: reviews.length ? (n / reviews.length) * 100 : 0 };
  });

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${product.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, text: product.description, url }); }
      catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      alert('تم نسخ الرابط');
    }
  };

  return (
    <div style={{ background: COLORS.background, minHeight: '100%', paddingBottom: 100 }}>
      <div style={{ position: 'relative', background: COLORS.cardAlt }}>
        <img src={product.gallery[activeImg]} alt={product.name} loading="lazy" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '48px 16px 0' }}>
          <button onClick={() => nav(-1 as unknown as string)} style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.92)', borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW.sm, backdropFilter: 'blur(6px)' }}>
            <ArrowLeft size={18} style={{ color: COLORS.textPrimary }} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleShare} style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.92)', borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW.sm, backdropFilter: 'blur(6px)' }}>
              <Share2 size={16} style={{ color: COLORS.textPrimary }} />
            </button>
            <button onClick={() => toggleWishlist(product.id)} style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.92)', borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW.sm, backdropFilter: 'blur(6px)' }}>
              <Heart size={16} style={{ color: wished ? COLORS.error : COLORS.textPrimary, fill: wished ? COLORS.error : 'none' }} />
            </button>
          </div>
        </div>
        {discount > 0 && (
          <span style={{ position: 'absolute', top: 48, left: 16, background: COLORS.error, color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: RADIUS.full }}>-{discount}% OFF</span>
        )}
        {product.gallery.length > 1 && (
          <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {product.gallery.map((_, i) => (
              <button key={i} onClick={() => setActiveImg(i)} style={{ width: i === activeImg ? 20 : 7, height: 7, borderRadius: 9999, background: i === activeImg ? COLORS.primary : 'rgba(255,255,255,0.6)', transition: 'all 0.2s' }} />
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.primary, background: COLORS.primary100, padding: '3px 10px', borderRadius: RADIUS.full }}>{product.seller}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: COLORS.textSecondary }}>
            <MapPin size={12} style={{ color: COLORS.primary }} />
            {product.city}
          </div>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 2px', lineHeight: 1.25, letterSpacing: '-0.02em' }}>{product.name}</h1>
        <p style={{ fontSize: 13, color: COLORS.textTertiary, margin: '0 0 10px' }}>{product.nameAr}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} size={14} showLabel />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: COLORS.textSecondary }}>
            <Package size={12} />
            {product.sold} sold
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '14px 16px', background: COLORS.card, borderRadius: RADIUS.xl, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}` }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 26, fontWeight: 900, color: COLORS.textPrimary, letterSpacing: '-0.03em' }}>{product.price}</span>
              <span style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: 600 }}>MAD</span>
              {product.originalPrice && <span style={{ fontSize: 13, color: COLORS.textTertiary, textDecoration: 'line-through' }}>{product.originalPrice}</span>}
            </div>
            {discount > 0 && <span style={{ fontSize: 11, color: COLORS.success, fontWeight: 700 }}>You save {product.originalPrice! - product.price} MAD</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: COLORS.cardAlt, borderRadius: RADIUS.lg, padding: '4px 6px' }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 30, height: 30, background: COLORS.card, borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW.sm }}>
              <Minus size={13} style={{ color: COLORS.textPrimary }} />
            </button>
            <span style={{ fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, minWidth: 20, textAlign: 'center' }}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} style={{ width: 30, height: 30, background: COLORS.primary, borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={13} style={{ color: '#fff' }} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {product.tags.map(t => (
            <span key={t} style={{ fontSize: 11, background: COLORS.cardAlt, color: COLORS.textSecondary, padding: '4px 10px', borderRadius: RADIUS.full, fontWeight: 500 }}>#{t}</span>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 8px' }}>Description</h3>
          <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6, margin: 0 }}>{product.description}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, background: COLORS.card, borderRadius: RADIUS.xl, padding: 14, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}`, marginBottom: 20 }}>
          {([
            { icon: Truck,     title: 'Free Delivery', sub: '300+ MAD orders' },
            { icon: Shield,    title: 'Authentic',     sub: 'Handcrafted' },
            { icon: RefreshCw, title: 'Returns',       sub: '14-day policy' },
          ] as const).map(({ icon: Icon, title, sub }) => (
            <div key={title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, background: COLORS.primary100, borderRadius: RADIUS.lg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} style={{ color: COLORS.primary }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textPrimary }}>{title}</span>
              <span style={{ fontSize: 10, color: COLORS.textTertiary }}>{sub}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary, margin: 0 }}>Ratings & Reviews</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, color: COLORS.primary, fontWeight: 600 }}>
              See all <ChevronRight size={13} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, background: COLORS.card, borderRadius: RADIUS.xl, padding: 14, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 72 }}>
              <span style={{ fontSize: 38, fontWeight: 900, color: COLORS.textPrimary, lineHeight: 1 }}>{product.rating.toFixed(1)}</span>
              <StarRating rating={product.rating} size={11} />
              <span style={{ fontSize: 10, color: COLORS.textTertiary, marginTop: 3 }}>{product.reviewCount} reviews</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {dist.map(({ s, n, pct }) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: COLORS.textTertiary, width: 8 }}>{s}</span>
                  <Star size={10} style={{ color: COLORS.star, fill: COLORS.star, flexShrink: 0 }} />
                  <div style={{ flex: 1, height: 6, background: COLORS.borderLight, borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: COLORS.star, borderRadius: 9999, transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize: 10, color: COLORS.textTertiary, width: 16, textAlign: 'right' }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: COLORS.primary100, borderRadius: RADIUS.xl, padding: '12px 16px', marginBottom: 14, border: `1.5px solid ${COLORS.primary200}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary }}>Rate this product</span>
            <StarRating rating={userRating} size={22} interactive onChange={setUserRating} />
          </div>
          {shown.map(review => (
            <div key={review.id} style={{ borderTop: `1px solid ${COLORS.borderLight}`, paddingTop: 14, paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, background: COLORS.primary, borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{review.avatar}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>{review.user}</p>
                    <p style={{ fontSize: 11, color: COLORS.textTertiary, margin: 0 }}>{new Date(review.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} size={12} />
              </div>
              <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.55, margin: '0 0 6px' }}>{review.text}</p>
              <span style={{ fontSize: 11, color: COLORS.textTertiary }}>{review.helpful} people found this helpful</span>
            </div>
          ))}
          {reviews.length > 2 && (
            <button onClick={() => setShowAllReviews(v => !v)} style={{ width: '100%', padding: '10px', border: `1.5px solid ${COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 13, fontWeight: 600, color: COLORS.primary, background: 'transparent' }}>
              {showAllReviews ? 'Show less' : `View all ${reviews.length} reviews`}
            </button>
          )}
        </div>

        {related.length > 0 && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 12px' }}>Similar Products</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: COLORS.card, borderTop: `1px solid ${COLORS.border}`, padding: '12px 16px', display: 'flex', gap: 10, zIndex: 100, boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}>
        <button onClick={() => toggleWishlist(product.id)} style={{ width: 50, height: 50, borderRadius: RADIUS.lg, border: `1.5px solid ${wished ? COLORS.error : COLORS.border}`, background: wished ? '#FEF2F2' : COLORS.card, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Heart size={20} style={{ color: wished ? COLORS.error : COLORS.textSecondary, fill: wished ? COLORS.error : 'none' }} />
        </button>
        <button onClick={() => product.inStock && addToCart(product, qty)} disabled={!product.inStock} style={{ flex: 1, height: 50, background: product.inStock ? COLORS.primary : COLORS.textTertiary, color: '#fff', fontWeight: 800, fontSize: 14, borderRadius: RADIUS.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: product.inStock ? SHADOW.primary : 'none' }}>
          <ShoppingCart size={18} />
          {product.inStock ? `Add to Cart · ${product.price * qty} MAD` : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
