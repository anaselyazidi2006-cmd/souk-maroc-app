import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { COLORS, RADIUS, FONT } from '@/theme';

export function CartScreen() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useApp();

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.background }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.text, display: 'flex' }}>
            <ArrowRight size={22} />
          </button>
          <h1 style={{ fontSize: FONT.lg, fontWeight: 800, color: COLORS.text, margin: 0 }}>سلة التسوق</h1>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: COLORS.textMuted }}>
          <ShoppingBag size={64} strokeWidth={1} />
          <p style={{ fontSize: FONT.md, fontWeight: 600 }}>السلة فارغة</p>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '12px 28px', background: COLORS.primary, color: '#fff', border: 'none', borderRadius: RADIUS.full, fontSize: FONT.base, fontWeight: 700, cursor: 'pointer' }}
          >
            تسوق الآن
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.background }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.text, display: 'flex' }}>
            <ArrowRight size={22} />
          </button>
          <h1 style={{ fontSize: FONT.lg, fontWeight: 800, color: COLORS.text, margin: 0 }}>سلة التسوق ({cart.length})</h1>
        </div>
        <button onClick={clearCart} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.error, fontSize: FONT.sm, fontWeight: 600 }}>
          مسح الكل
        </button>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cart.map(item => (
          <div key={item.product.id} style={{ background: COLORS.surface, borderRadius: RADIUS.md, border: `1px solid ${COLORS.border}`, padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
            <img
              src={item.product.image}
              alt={item.product.title}
              style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: RADIUS.sm, flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: FONT.sm, fontWeight: 700, color: COLORS.text, margin: '0 0 4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {item.product.title}
              </p>
              <p style={{ fontSize: FONT.md, fontWeight: 800, color: COLORS.primary, margin: '0 0 10px' }}>
                {(item.product.price * item.quantity).toLocaleString('ar-MA')} د.م.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} style={{ width: 28, height: 28, background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.text }}>
                  <Minus size={14} />
                </button>
                <span style={{ fontSize: FONT.md, fontWeight: 700, color: COLORS.text, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} style={{ width: 28, height: 28, background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.text }}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.error, display: 'flex', flexShrink: 0 }}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: 20, background: COLORS.surface, borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: FONT.md, color: COLORS.textSecondary }}>المجموع</span>
          <span style={{ fontSize: FONT.xl, fontWeight: 900, color: COLORS.primary }}>{total.toLocaleString('ar-MA')} د.م.</span>
        </div>
        <button
          style={{ width: '100%', padding: '16px 0', background: COLORS.primary, color: '#fff', border: 'none', borderRadius: RADIUS.full, fontSize: FONT.md, fontWeight: 800, cursor: 'pointer' }}
        >
          المتابعة للدفع
        </button>
      </div>
    </div>
  );
}
