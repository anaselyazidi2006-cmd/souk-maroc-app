import { Trash2, Plus, Minus, ShoppingBag, Tag, ChevronRight, PackageCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { COLORS, RADIUS, SHADOW } from '@/theme';

export function CartScreen() {
  const { cart, removeFromCart, updateQty, cartTotal, navigate } = useApp();
  const shipping = cartTotal >= 300 ? 0 : 35;
  const total    = cartTotal + shipping;

  if (cart.length === 0) {
    return (
      <div style={{ background: COLORS.background, minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px 80px', gap: 12 }}>
        <div style={{ width: 90, height: 90, background: COLORS.primary100, borderRadius: RADIUS.xxl, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingBag size={42} style={{ color: COLORS.primary, opacity: 0.6 }} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.textPrimary, margin: 0 }}>Your cart is empty</h2>
        <p style={{ fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', margin: 0 }}>Discover authentic Moroccan crafts and add them here</p>
        <button onClick={() => navigate('home')} style={{ height: 48, padding: '0 28px', background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: RADIUS.lg, boxShadow: SHADOW.primary, marginTop: 8 }}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.background, minHeight: '100%', paddingBottom: 88 }}>
      {/* Header */}
      <div style={{ background: COLORS.card, padding: '48px 16px 16px', boxShadow: SHADOW.sm, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: COLORS.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>My Cart</h1>
          <span style={{ fontSize: 12, color: COLORS.textSecondary, background: COLORS.cardAlt, padding: '4px 10px', borderRadius: RADIUS.full, border: `1px solid ${COLORS.border}` }}>{cart.length} items</span>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Shipping Banner */}
        <div style={{ background: shipping === 0 ? '#F0FDF4' : COLORS.primary100, border: `1.5px solid ${shipping === 0 ? '#BBF7D0' : COLORS.primary200}`, borderRadius: RADIUS.xl, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <PackageCheck size={16} style={{ color: shipping === 0 ? COLORS.success : COLORS.primary, flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: shipping === 0 ? '#15803D' : COLORS.primary, margin: 0, fontWeight: 600 }}>
            {shipping === 0
              ? '🎉 You qualify for free shipping!'
              : `Add ${300 - cartTotal} MAD more for free shipping!`}
          </p>
        </div>

        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          {cart.map(({ product, qty }: { product: import('@/types').Product; qty: number }) => (
            <div key={product.id} style={{ background: COLORS.card, borderRadius: RADIUS.xl, padding: 12, display: 'flex', gap: 12, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}` }}>
              <div
                onClick={() => navigate('product', product.id)}
                style={{ width: 80, height: 80, borderRadius: RADIUS.lg, overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}
              >
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 2 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary, margin: 0, lineHeight: 1.35 }} className="line-clamp-2">{product.name}</p>
                  <button onClick={() => removeFromCart(product.id)} style={{ marginLeft: 8, flexShrink: 0, color: COLORS.textTertiary, lineHeight: 0, transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = COLORS.error)}
                    onMouseLeave={e => (e.currentTarget.style.color = COLORS.textTertiary)}>
                    <Trash2 size={15} />
                  </button>
                </div>
                <p style={{ fontSize: 11, color: COLORS.primary, fontWeight: 600, margin: '0 0 8px' }}>{product.city}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: COLORS.textPrimary }}>{product.price * qty} <span style={{ fontSize: 11, fontWeight: 600 }}>MAD</span></span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: COLORS.cardAlt, borderRadius: RADIUS.md, padding: '3px 5px' }}>
                    <button onClick={() => updateQty(product.id, qty - 1)} style={{ width: 26, height: 26, background: COLORS.card, borderRadius: RADIUS.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW.sm }}>
                      <Minus size={11} style={{ color: COLORS.textPrimary }} />
                    </button>
                    <span style={{ fontSize: 13, fontWeight: 800, color: COLORS.textPrimary, minWidth: 16, textAlign: 'center' }}>{qty}</span>
                    <button onClick={() => updateQty(product.id, qty + 1)} style={{ width: 26, height: 26, background: COLORS.primary, borderRadius: RADIUS.sm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={11} style={{ color: '#fff' }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo */}
        <div style={{ background: COLORS.card, border: `1.5px solid ${COLORS.border}`, borderRadius: RADIUS.xl, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 10, height: 48, marginBottom: 16 }}>
          <Tag size={15} style={{ color: COLORS.textTertiary }} />
          <input type="text" placeholder="Promo / discount code" style={{ flex: 1, fontSize: 13, background: 'none', border: 'none', outline: 'none', color: COLORS.textPrimary }} />
          <button style={{ fontSize: 12, fontWeight: 800, color: COLORS.primary }}>Apply</button>
        </div>

        {/* Summary */}
        <div style={{ background: COLORS.card, borderRadius: RADIUS.xl, padding: 16, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}`, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 12px' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: COLORS.textSecondary }}>Subtotal</span>
              <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>{cartTotal} MAD</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: COLORS.textSecondary }}>Shipping</span>
              <span style={{ fontWeight: 600, color: shipping === 0 ? COLORS.success : COLORS.textPrimary }}>{shipping === 0 ? 'FREE' : `${shipping} MAD`}</span>
            </div>
            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: COLORS.primary }}>{total} MAD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: COLORS.card, borderTop: `1px solid ${COLORS.border}`, padding: '12px 16px', display: 'flex', gap: 10, zIndex: 100, boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}>
        <button onClick={() => navigate('home')} style={{ height: 50, padding: '0 16px', border: `1.5px solid ${COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, background: COLORS.card, flexShrink: 0 }}>
          Add More
        </button>
        <button style={{ flex: 1, height: 50, background: COLORS.primary, color: '#fff', fontWeight: 800, fontSize: 14, borderRadius: RADIUS.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: SHADOW.primary }}>
          Checkout · {total} MAD <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
