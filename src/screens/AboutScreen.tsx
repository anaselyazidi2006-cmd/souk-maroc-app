import { ArrowLeft, MapPin, Mail, Phone, Globe, Star, Package, Users, Award } from 'lucide-react';
import { useApp } from '@/context/AppContext';

import { COLORS, RADIUS, SHADOW } from '@/theme';

const TEAM = [
  { name: 'Youssef El Amrani', role: 'Founder & CEO', city: 'Marrakech', initial: 'Y', grad: 'linear-gradient(135deg,#E8572A,#C43E18)' },
  { name: 'Fatima Zahra Idrissi', role: 'Head of Artisans', city: 'Fez', initial: 'F', grad: 'linear-gradient(135deg,#EC4899,#BE185D)' },
  { name: 'Karim Bensouda', role: 'CTO', city: 'Casablanca', initial: 'K', grad: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' },
];

const VALUES = [
  { emoji: '🤝', title: 'Fair Trade',    desc: 'Artisans receive fair compensation and full recognition for their craft.' },
  { emoji: '🌱', title: 'Sustainability', desc: 'We champion eco-friendly materials and responsible production methods.' },
  { emoji: '🏺', title: 'Authenticity',  desc: 'Every product is handcrafted and verified as genuinely Moroccan.' },
  { emoji: '🌍', title: 'Global Reach',  desc: 'We ship to 40+ countries, bringing Morocco to your doorstep.' },
];

export function AboutScreen() {
  const { navigate, goBack } = useApp();

  return (
    <div style={{ background: COLORS.background, minHeight: '100%', paddingBottom: 32 }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <img src="https://images.pexels.com/photos/2574319/pexels-photo-2574319.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.6) 100%)' }} />
        <div style={{ position: 'absolute', top: 48, left: 16 }}>
          <button onClick={goBack} style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(255,255,255,0.25)' }}>
            <ArrowLeft size={18} style={{ color: '#fff' }} />
          </button>
        </div>
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.03em' }}>
            <span style={{ color: '#FFB347' }}>Souk</span>Pro
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0 }}>Connecting the World to Authentic Moroccan Crafts</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '16px 16px 0' }}>
        {[
          { icon: Package, value: '500+',   label: 'Products', color: COLORS.primary, bg: COLORS.primary100 },
          { icon: Users,   value: '2,800+', label: 'Artisans', color: COLORS.info,    bg: '#EFF6FF' },
          { icon: Award,   value: '15+',    label: 'Cities',   color: COLORS.success, bg: '#F0FDF4' },
        ].map(({ icon: Icon, value, label, color, bg }) => (
          <div key={label} style={{ background: COLORS.card, borderRadius: RADIUS.xl, padding: '12px 10px', textAlign: 'center', boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}` }}>
            <div style={{ width: 34, height: 34, background: bg, borderRadius: RADIUS.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
              <Icon size={15} style={{ color }} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 900, color: COLORS.textPrimary, margin: '0 0 1px' }}>{value}</p>
            <p style={{ fontSize: 10, color: COLORS.textTertiary, margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div style={{ margin: '14px 16px 0', background: COLORS.card, borderRadius: RADIUS.xl, padding: 16, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}` }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 8px' }}>Our Mission</h2>
        <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.65, margin: '0 0 12px' }}>
          SoukPro was born from a deep love for Morocco's rich artisanal heritage. We bridge talented local craftspeople with customers worldwide, ensuring every purchase directly supports Moroccan families and keeps centuries-old traditions alive.
        </p>
        <div style={{ background: COLORS.primary100, borderRadius: RADIUS.lg, padding: '10px 14px', borderLeft: `3px solid ${COLORS.primary}` }}>
          <p style={{ fontSize: 12, color: COLORS.primary700, margin: 0, fontStyle: 'italic', lineHeight: 1.55 }}>
            "Every product tells a story — a story of skill, patience, and cultural pride passed down through generations."
          </p>
        </div>
      </div>

      {/* Values */}
      <div style={{ margin: '14px 16px 0', background: COLORS.card, borderRadius: RADIUS.xl, padding: 16, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}` }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 14px' }}>What We Stand For</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {VALUES.map(({ emoji, title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 22, width: 32, textAlign: 'center', flexShrink: 0 }}>{emoji}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary, margin: '0 0 2px' }}>{title}</p>
                <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: 0, lineHeight: 1.55 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={{ margin: '14px 16px 0', background: COLORS.card, borderRadius: RADIUS.xl, padding: 16, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}` }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 14px' }}>Our Team</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TEAM.map(m => (
            <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, background: m.grad, borderRadius: RADIUS.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>{m.initial}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>{m.name}</p>
                <p style={{ fontSize: 11, color: COLORS.textSecondary, margin: 0 }}>{m.role}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: COLORS.textTertiary }}>
                <MapPin size={10} />{m.city}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews */}
      <div style={{ margin: '14px 16px 0', background: COLORS.card, borderRadius: RADIUS.xl, padding: 16, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Star size={15} style={{ fill: COLORS.star, color: COLORS.star }} />
          <h2 style={{ fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, margin: 0 }}>What Customers Say</h2>
        </div>
        {[
          { name: 'Emma W.', flag: '🇫🇷', text: 'Incredible quality! My tagine arrived perfectly packed and looks exactly as shown. Truly authentic craftsmanship.', rating: 5 },
          { name: 'David C.', flag: '🇬🇧', text: 'Best argan oil I\'ve ever used. The shopping experience was seamless and customer support was great.', rating: 5 },
        ].map(r => (
          <div key={r.name} style={{ background: COLORS.cardAlt, borderRadius: RADIUS.lg, padding: '10px 12px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>{r.name} {r.flag}</p>
              </div>
              <div style={{ display: 'flex', gap: 1 }}>
                {[...Array(r.rating)].map((_, i) => <Star key={i} size={11} style={{ fill: COLORS.star, color: COLORS.star }} />)}
              </div>
            </div>
            <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: 0, lineHeight: 1.55, fontStyle: 'italic' }}>"{r.text}"</p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div style={{ margin: '14px 16px 0', background: COLORS.card, borderRadius: RADIUS.xl, padding: 16, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}` }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 14px' }}>Contact Us</h2>
        {[
          { icon: MapPin, text: '12 Rue Moulay Ismail, Marrakech 40000, Morocco' },
          { icon: Mail,   text: 'hello@soukpro.ma' },
          { icon: Phone,  text: '+212 5 24 43 00 00' },
          { icon: Globe,  text: 'www.soukpro.ma' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, background: COLORS.primary100, borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              <Icon size={13} style={{ color: COLORS.primary }} />
            </div>
            <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: 0, paddingTop: 7, lineHeight: 1.45 }}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
