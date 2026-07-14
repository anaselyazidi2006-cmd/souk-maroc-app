import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import { COLORS, RADIUS, FONT } from '@/theme';
import type { Order } from '@/types';

const STATUS_LABELS: Record<Order['status'], string> = {
  pending:    'في الانتظار',
  processing: 'قيد المعالجة',
  shipped:    'تم الشحن',
  delivered:  'تم التسليم',
  cancelled:  'ملغى',
};

const STATUS_COLORS: Record<Order['status'], string> = {
  pending:    '#F59E0B',
  processing: '#3B82F6',
  shipped:    '#8B5CF6',
  delivered:  '#10B981',
  cancelled:  '#EF4444',
};

// Mock orders — replace with real Supabase data when orders table is ready
const MOCK_ORDERS: Order[] = [];

export function OrdersScreen() {
  const navigate = useNavigate();
  const orders = MOCK_ORDERS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.background }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.text, display: 'flex' }}>
          <ArrowRight size={22} />
        </button>
        <h1 style={{ fontSize: FONT.lg, fontWeight: 800, color: COLORS.text, margin: 0 }}>طلباتي</h1>
      </div>

      {orders.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: COLORS.textMuted }}>
          <Package size={64} strokeWidth={1} />
          <p style={{ fontSize: FONT.md, fontWeight: 600 }}>لا توجد طلبات بعد</p>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '12px 28px', background: COLORS.primary, color: '#fff', border: 'none', borderRadius: RADIUS.full, fontSize: FONT.base, fontWeight: 700, cursor: 'pointer' }}
          >
            ابدأ التسوق
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: COLORS.surface, borderRadius: RADIUS.md, border: `1px solid ${COLORS.border}`, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: FONT.xs, color: COLORS.textMuted }}>#{order.id.slice(0, 8)}</span>
                <span style={{ fontSize: FONT.xs, fontWeight: 700, color: STATUS_COLORS[order.status], background: `${STATUS_COLORS[order.status]}18`, padding: '2px 10px', borderRadius: RADIUS.full }}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <img src={order.product.image} alt={order.product.title} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: RADIUS.sm }} />
                <div>
                  <p style={{ fontSize: FONT.sm, fontWeight: 700, color: COLORS.text, margin: '0 0 4px' }}>{order.product.title}</p>
                  <p style={{ fontSize: FONT.xs, color: COLORS.textMuted, margin: '0 0 6px' }}>الكمية: {order.quantity}</p>
                  <p style={{ fontSize: FONT.md, fontWeight: 800, color: COLORS.primary, margin: 0 }}>{order.total.toLocaleString('ar-MA')} د.م.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
