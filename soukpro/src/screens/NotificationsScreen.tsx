import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bell } from 'lucide-react';
import { COLORS, RADIUS, FONT } from '@/theme';
import type { Notification } from '@/types';

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'مرحباً بك في سوق المغرب!', message: 'اكتشف آلاف المنتجات التقليدية المغربية الأصيلة.', time: 'الآن', read: false },
  { id: '2', title: 'إعلانك منشور', message: 'تم نشر إعلانك بنجاح وأصبح مرئياً للجميع.', time: 'منذ ساعة', read: false },
  { id: '3', title: 'خصم خاص', message: 'استمتع بخصم 10% على جميع منتجات الصناعة التقليدية هذا الأسبوع.', time: 'أمس', read: true },
];

export function NotificationsScreen() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.background }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.text, display: 'flex' }}>
            <ArrowRight size={22} />
          </button>
          <h1 style={{ fontSize: FONT.lg, fontWeight: 800, color: COLORS.text, margin: 0 }}>
            الإشعارات {unreadCount > 0 ? `(${unreadCount})` : ''}
          </h1>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: COLORS.primary, fontSize: FONT.sm, fontWeight: 600, cursor: 'pointer' }}>
            قراءة الكل
          </button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: COLORS.textMuted }}>
          <Bell size={64} strokeWidth={1} />
          <p style={{ fontSize: FONT.md, fontWeight: 600 }}>لا توجد إشعارات</p>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {notifications.map((n, i) => (
            <div
              key={n.id}
              onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
              style={{
                padding: '16px 20px',
                background: n.read ? COLORS.surface : `${COLORS.primary}08`,
                borderBottom: i < notifications.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                cursor: 'pointer',
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: n.read ? 'transparent' : COLORS.primary, marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: FONT.sm, fontWeight: n.read ? 600 : 800, color: COLORS.text, margin: '0 0 4px' }}>{n.title}</p>
                <p style={{ fontSize: FONT.xs, color: COLORS.textSecondary, margin: '0 0 6px', lineHeight: 1.5 }}>{n.message}</p>
                <p style={{ fontSize: FONT.xs, color: COLORS.textMuted, margin: 0 }}>{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
