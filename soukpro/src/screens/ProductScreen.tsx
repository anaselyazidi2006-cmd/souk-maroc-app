import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, ShoppingCart, MapPin, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { COLORS, RADIUS, FONT } from '@/theme';
import { FEATURED_PRODUCTS } from '@/data';
import StarRating from '@/components/StarRating';
import type { Product } from '@/types';

export function ProductScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart, isInWishlist, addToWishlist, removeFromWishlist } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    setLoading(true);

    // Try from Supabase first
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setProduct({
        id: data.id,
        title: data.title,
        price: data.price,
        image: data.image_url ?? 'https://placehold.co/400x300/E8DDD0/6B5B45?text=صورة',
        category: data.category,
        description: data.description,
        location: data.location,
        condition: data.condition,
      });
    } else {
      // Fall back to static data
      const found = FEATURED_PRODUCTS.find(p => p.id === id);
      setProduct(found ?? null);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background, minHeight: '100dvh' }}>
        <div style={{ width: 36, height: 36, border: `3px solid ${COLORS.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: COLORS.background, minHeight: '100dvh', gap: 16 }}>
        <p style={{ color: COLORS.textSecondary, fontSize: FONT.md }}>المنتج غير موجود</p>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 24px', background: COLORS.primary, color: '#fff', border: 'none', borderRadius: RADIUS.full, cursor: 'pointer' }}>
          العودة
        </button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  function handleAddToCart() {
    addToCart(product!);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function toggleWishlist() {
    if (inWishlist) {
      removeFromWishlist(product!.id);
    } else {
      addToWishlist(product!);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.background }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.text, display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowRight size={22} />
          <span style={{ fontSize: FONT.md, fontWeight: 600 }}>تفاصيل المنتج</span>
        </button>
        <button
          onClick={toggleWishlist}
          style={{ background: COLORS.surfaceAlt, border: 'none', borderRadius: RADIUS.md, padding: 10, cursor: 'pointer', color: inWishlist ? COLORS.error : COLORS.textMuted, display: 'flex', alignItems: 'center' }}
        >
          <Heart size={20} fill={inWishlist ? COLORS.error : 'none'} />
        </button>
      </div>

      {/* Image */}
      <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: COLORS.surfaceAlt }}>
        <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Category badge */}
        {product.category && (
          <span style={{ alignSelf: 'flex-start', padding: '4px 12px', background: COLORS.surfaceAlt, borderRadius: RADIUS.full, fontSize: FONT.xs, color: COLORS.textSecondary, fontWeight: 600 }}>
            {product.category}
          </span>
        )}

        {/* Title & Price */}
        <div>
          <h1 style={{ fontSize: FONT.xl, fontWeight: 800, color: COLORS.text, margin: 0, marginBottom: 8 }}>{product.title}</h1>
          <p style={{ fontSize: 28, fontWeight: 900, color: COLORS.primary, margin: 0 }}>{product.price.toLocaleString('ar-MA')} د.م.</p>
        </div>

        {/* Rating */}
        {product.rating && (
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        )}

        {/* Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {product.condition && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.textSecondary }}>
              <Package size={16} />
              <span style={{ fontSize: FONT.sm }}>{product.condition}</span>
            </div>
          )}
          {product.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.textSecondary }}>
              <MapPin size={16} />
              <span style={{ fontSize: FONT.sm }}>{product.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <div>
            <h2 style={{ fontSize: FONT.md, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>الوصف</h2>
            <p style={{ fontSize: FONT.base, color: COLORS.textSecondary, lineHeight: 1.7, margin: 0 }}>{product.description}</p>
          </div>
        )}

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '16px 0',
            background: addedToCart ? COLORS.success : inCart ? COLORS.primaryLight : COLORS.primary,
            color: '#fff',
            border: 'none',
            borderRadius: RADIUS.lg,
            fontSize: FONT.md,
            fontWeight: 800,
            cursor: 'pointer',
            marginTop: 'auto',
            transition: 'background 0.2s',
          }}
        >
          <ShoppingCart size={20} />
          {addedToCart ? 'تمت الإضافة ✓' : inCart ? 'في السلة' : 'إضافة إلى السلة'}
        </button>
      </div>
    </div>
  );
}
