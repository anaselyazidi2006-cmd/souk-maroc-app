import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { COLORS, RADIUS, FONT } from '@/theme';

export function AboutScreen() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.background }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.text, display: 'flex' }}>
          <ArrowRight size={22} />
        </button>
        <h1 style={{ fontSize: FONT.lg, fontWeight: 800, color: COLORS.text, margin: 0 }}>عن التطبيق</h1>
      </div>

      <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🏺</div>
          <h2 style={{ fontSize: FONT.xxl, fontWeight: 900, color: COLORS.primary, margin: 0 }}>سوق المغرب</h2>
          <p style={{ fontSize: FONT.sm, color: COLORS.textMuted, marginTop: 8 }}>الإصدار 1.0.0</p>
        </div>

        {/* Description */}
        <div style={{ background: COLORS.surface, borderRadius: RADIUS.md, border: `1px solid ${COLORS.border}`, padding: 20 }}>
          <h3 style={{ fontSize: FONT.md, fontWeight: 800, color: COLORS.text, marginBottom: 12 }}>عن المنصة</h3>
          <p style={{ fontSize: FONT.base, color: COLORS.textSecondary, lineHeight: 1.8, margin: 0 }}>
            سوق المغرب هو منصة إلكترونية متخصصة في عرض وبيع المنتجات التقليدية المغربية الأصيلة.
            نربط بين الحرفيين المغاربة الموهوبين والمشترين من داخل المغرب وخارجه.
          </p>
        </div>

        {/* Features */}
        <div style={{ background: COLORS.surface, borderRadius: RADIUS.md, border: `1px solid ${COLORS.border}`, padding: 20 }}>
          <h3 style={{ fontSize: FONT.md, fontWeight: 800, color: COLORS.text, marginBottom: 12 }}>مميزات التطبيق</h3>
          {[
            'تصفح آلاف المنتجات التقليدية',
            'نشر إعلاناتك مجاناً',
            'تواصل مباشر مع البائعين',
            'حماية البيانات والخصوصية',
            'واجهة عربية سهلة الاستخدام',
          ].map((feature, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 4 ? 10 : 0 }}>
              <span style={{ color: COLORS.success, fontSize: 16 }}>✓</span>
              <span style={{ fontSize: FONT.base, color: COLORS.textSecondary }}>{feature}</span>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{ background: COLORS.surface, borderRadius: RADIUS.md, border: `1px solid ${COLORS.border}`, padding: 20 }}>
          <h3 style={{ fontSize: FONT.md, fontWeight: 800, color: COLORS.text, marginBottom: 8 }}>تواصل معنا</h3>
          <p style={{ fontSize: FONT.base, color: COLORS.textSecondary, margin: 0 }}>support@soukpro.ma</p>
        </div>

        <p style={{ textAlign: 'center', fontSize: FONT.xs, color: COLORS.textMuted }}>
          © 2026 سوق المغرب — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}
