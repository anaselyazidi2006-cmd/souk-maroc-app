import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { COLORS, RADIUS, SHADOW } from '@/theme';

const NOTIF_BG: Record<string, string> = {
  like: '#FEF2F2', reply: '#EFF6FF', new_listing: '#F0FDF4',
  message: '#FFFBEB', service_request: COLORS.primary100,
};
const NOTIF_BORDER: Record<string, string> = {
  like: '#FECACA', reply: '#BFDBFE', new_listing: '#BBF7D0',
  message: '#FDE68A', service_request: COLORS.primary200,
};

export function NotificationsScreen() {
  const { goBack, notifications, unreadCount, markAllRead } = useApp();

  return (
    <div style={{ background: COLORS.background, minHeight: '100%', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: COLORS.card, padding: '48px 16px 16px', boxShadow: SHADOW.sm, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={goBack} style={{ width: 38, height: 38, background: COLORS.cardAlt, borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${COLORS.border}` }}>
              <ArrowLeft size={18} style={{ color: COLORS.textPrimary }} />
            </button>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: COLORS.textPrimary, margin: 0 }}>الإشعارات</h1>
              {unreadCount > 0 && <p style={{ fontSize: 11, color: COLORS.primary, fontWeight: 600, margin: 0 }}>{unreadCount} غير مقروء</p>}
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: COLORS.primary, background: COLORS.primary100, padding: '6px 12px', borderRadius: RADIUS.md }}>
              <CheckCircle size={13} />
              قراءة الكل
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '14px 16px 0' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 48, margin: '0 0 12px' }}>🔔</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>ما كاين والو دابا</p>
            <p style={{ fontSize: 13, color: COLORS.textTertiary }}>الإشعارات ديالك غادي تظهر هنا</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              style={{
                background: n.read ? COLORS.card : (NOTIF_BG[n.type] ?? COLORS.primary100),
                border: `1.5px solid ${n.read ? COLORS.border : (NOTIF_BORDER[n.type] ?? COLORS.primary200)}`,
                borderRadius: RADIUS.xl, padding: '14px 14px', marginBottom: 10,
                display: 'flex', gap: 12, alignItems: 'flex-start',
                boxShadow: n.read ? SHADOW.sm : SHADOW.md,
              }}
            >
              <div style={{ width: 42, height: 42, background: n.read ? COLORS.cardAlt : 'rgba(255,255,255,0.7)', borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {n.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: n.read ? 600 : 800, color: COLORS.textPrimary }}>{n.title}</span>
                  <span style={{ fontSize: 10, color: COLORS.textTertiary }}>{n.time}</span>
                </div>
                <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: 0, lineHeight: 1.55 }}>{n.body}</p>
              </div>
              {!n.read && (
                <div style={{ width: 8, height: 8, background: COLORS.primary, borderRadius: 9999, flexShrink: 0, marginTop: 6 }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
