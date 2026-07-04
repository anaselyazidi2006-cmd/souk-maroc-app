import { ArrowLeft, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COLORS, RADIUS, SHADOW } from '@/theme';

export function OrdersScreen() {
  const nav = useNavigate();
  return (
    <div style={{ background: COLORS.background, minHeight: '100%', paddingBottom: 80 }}>
      <div style={{ background: COLORS.card, padding: '48px 16px 16px', boxShadow: SHADOW.sm, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav(-1 as unknown as string)} style={{ width: 38, height: 38, background: COLORS.cardAlt, borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${COLORS.border}` }}>
            <ArrowLeft size={18} style={{ color: COLORS.textPrimary }} />
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: COLORS.textPrimary, margin: 0 }}>طلباتي</h1>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, background: COLORS.primary100, borderRadius: RADIUS.xxl, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Package size={36} style={{ color: COLORS.primary }} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 10px' }}>ما كاين طلبات بعد</h2>
        <p style={{ fontSize: 14, color: COLORS.textSecondary, margin: '0 0 24px', lineHeight: 1.6 }}>
          حين تشتري منتجاً سيظهر طلبك هنا للمتابعة
        </p>
        <button onClick={() => nav('/home')} style={{ height: 48, padding: '0 28px', background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: RADIUS.lg, boxShadow: SHADOW.primary }}>
          تسوّق الآن
        </button>
      </div>
    </div>
  );
}
