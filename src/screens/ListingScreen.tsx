import { useState } from 'react';
import { ArrowLeft, Heart, Share2, Phone, MessageCircle, MapPin, Eye, Send, Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { LISTINGS } from '@/data';
import type { Listing } from '@/types';
import { COLORS, RADIUS, SHADOW } from '@/theme';

const TYPE_COLORS: Record<string, string> = {
  sale: '#16A34A', service: COLORS.primary, job: '#7C3AED', rent: '#0284C7',
};

export function ListingScreen() {
  const { listingId, goBack, toggleLike, isLiked, likeCounts, getComments, addComment, user, myListings } = useApp();
  const [commentText, setCommentText] = useState('');

  const allListings = [...LISTINGS, ...myListings];
  const listing: Listing | undefined = allListings.find(l => l.id === listingId);
  if (!listing) return null;

  const liked      = isLiked(listing.id);
  const likeCount  = likeCounts[listing.id] ?? listing.likes;
  const comments   = getComments(listing.id);
  const typeColor  = TYPE_COLORS[listing.type] ?? COLORS.primary;

  const handleSend = () => { if (commentText.trim()) { addComment(listing.id, commentText); setCommentText(''); } };

  return (
    <div style={{ background: COLORS.background, minHeight: '100%', paddingBottom: 100 }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 280, overflow: 'hidden', background: COLORS.cardAlt }}>
        <img src={listing.image} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
        {/* Nav */}
        <div style={{ position: 'absolute', top: 48, left: 16, right: 16, display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={goBack} style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)', borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW.sm }}>
            <ArrowLeft size={18} style={{ color: COLORS.textPrimary }} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => toggleLike(listing.id, listing.likes)} style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)', borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW.sm }}>
              <Heart size={16} style={{ color: liked ? COLORS.error : COLORS.textPrimary, fill: liked ? COLORS.error : 'none' }} />
            </button>
            <button style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)', borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW.sm }}>
              <Share2 size={16} style={{ color: COLORS.textPrimary }} />
            </button>
          </div>
        </div>
        {/* Price overlay */}
        <div style={{ position: 'absolute', bottom: 14, left: 16 }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{listing.priceLabel}</span>
        </div>
        {/* Type badge */}
        <div style={{ position: 'absolute', bottom: 14, right: 16, background: typeColor, padding: '4px 12px', borderRadius: RADIUS.full }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{listing.typeLabel}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 16px 0' }}>
        {/* Stats bar */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 14, padding: '10px 14px', background: COLORS.card, borderRadius: RADIUS.xl, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}` }}>
          {[
            { icon: Heart, val: likeCount, label: 'إعجاب' },
            { icon: MessageCircle, val: listing.comments + comments.length, label: 'تعليق' },
            { icon: Eye, val: listing.views, label: 'مشاهدة' },
          ].map(({ icon: Icon, val, label }) => (
            <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Icon size={15} style={{ color: COLORS.primary }} />
              <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary }}>{val}</span>
              <span style={{ fontSize: 10, color: COLORS.textTertiary }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 20, fontWeight: 900, color: COLORS.textPrimary, margin: '0 0 8px', lineHeight: 1.3, letterSpacing: '-0.02em' }}>{listing.title}</h1>

        {/* Author card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: COLORS.card, borderRadius: RADIUS.xl, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}`, marginBottom: 14 }}>
          <div style={{ width: 46, height: 46, background: `linear-gradient(135deg,${COLORS.primary},${COLORS.primary700})`, borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{listing.userAvatar}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary }}>{listing.userName}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Star size={10} style={{ fill: COLORS.star, color: COLORS.star }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textSecondary }}>{listing.userRating}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={10} style={{ color: COLORS.textTertiary }} />
              <span style={{ fontSize: 12, color: COLORS.textTertiary }}>{listing.city}</span>
            </div>
          </div>
          <button style={{ padding: '7px 14px', background: COLORS.primary100, borderRadius: RADIUS.lg, border: `1.5px solid ${COLORS.primary200}`, fontSize: 12, fontWeight: 700, color: COLORS.primary }}>
            الملف الشخصي
          </button>
        </div>

        {/* Description */}
        <div style={{ background: COLORS.card, borderRadius: RADIUS.xl, padding: '14px 16px', boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}`, marginBottom: 14 }}>
          <h3 style={{ fontSize: 13, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 8px' }}>تفاصيل الإعلان</h3>
          <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: 0, lineHeight: 1.7 }}>{listing.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10 }}>
            <MapPin size={13} style={{ color: COLORS.primary }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSecondary }}>{listing.city}</span>
          </div>
        </div>

        {/* Comments section */}
        <div style={{ background: COLORS.card, borderRadius: RADIUS.xl, padding: '14px 16px', boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}`, marginBottom: 14 }}>
          <h3 style={{ fontSize: 13, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <MessageCircle size={15} style={{ color: COLORS.primary }} />
            التعليقات ({listing.comments + comments.length})
          </h3>

          {/* Existing comments */}
          {comments.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, background: COLORS.cardAlt, borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: COLORS.primary }}>{c.userAvatar}</span>
              </div>
              <div style={{ flex: 1, background: COLORS.cardAlt, borderRadius: RADIUS.lg, padding: '8px 12px' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textPrimary }}>{c.userName}</span>
                <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: '3px 0 0', lineHeight: 1.5 }}>{c.text}</p>
              </div>
            </div>
          ))}

          {/* Add comment */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
            <div style={{ width: 32, height: 32, background: COLORS.primary, borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: '#fff' }}>{user?.avatar ?? '?'}</span>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: COLORS.cardAlt, borderRadius: RADIUS.full, padding: '0 6px 0 14px', border: `1.5px solid ${COLORS.border}`, height: 40 }}>
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="اكتب تعليقاً…"
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: COLORS.textPrimary, direction: 'rtl' }}
              />
              <button onClick={handleSend} style={{ width: 30, height: 30, background: commentText.trim() ? COLORS.primary : COLORS.border, borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Send size={13} style={{ color: '#fff' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: COLORS.card, borderTop: `1px solid ${COLORS.border}`, padding: '12px 16px', display: 'flex', gap: 10, zIndex: 100, boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}>
        <a
          href={`tel:${listing.phone}`}
          style={{ flex: 1, height: 50, background: COLORS.cardAlt, border: `1.5px solid ${COLORS.border}`, borderRadius: RADIUS.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}
        >
          <Phone size={16} style={{ color: COLORS.textPrimary }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: COLORS.textPrimary }}>اتصال</span>
        </a>
        <a
          href={`https://wa.me/${listing.whatsapp.replace('+', '')}?text=مرحبا، رأيت إعلانك "${listing.title}" على SoukPro`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ flex: 2, height: 50, background: '#25D366', borderRadius: RADIUS.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', boxShadow: '0 4px 12px rgba(37,211,102,0.3)' }}
        >
          <span style={{ fontSize: 18 }}>💬</span>
          <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>واتساب</span>
        </a>
      </div>
    </div>
  );
}
