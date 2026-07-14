import { useState, useRef, useEffect } from 'react';
import { Heart, MapPin, Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { COLORS, RADIUS, SHADOW } from '@/theme';
import type { Listing } from '@/types';

/* ─── Badge colours ─────────────────────────────────────────────────────── */
const BADGE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  urgent:   { bg: '#FEE2E2', color: '#DC2626', label: 'عاجل' },
  featured: { bg: '#FEF3C7', color: '#D97706', label: 'مميز' },
  new:      { bg: '#DCFCE7', color: '#16A34A', label: 'جديد' },
};

const TYPE_COLORS: Record<string, string> = {
  sale:    '#16A34A',
  service: COLORS.primary,
  job:     '#7C3AED',
  rent:    '#0284C7',
};

/* ─── Types ─────────────────────────────────────────────────────────────── */
export interface OwnerActions {
  onEdit:   () => void;
  onDelete: () => void;
}

interface Props {
  listing: Listing;
  /** When provided, shows the ⋮ owner-actions menu */
  ownerActions?: OwnerActions;
}

/* ─── Three-dot dropdown menu ───────────────────────────────────────────── */
function OwnerMenu({ actions, onClose }: { actions: OwnerActions; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler, true);
    return () => document.removeEventListener('mousedown', handler, true);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: 36,
        left: 0,           /* RTL: menu opens to the left of the button */
        zIndex: 200,
        background: COLORS.card,
        borderRadius: RADIUS.lg,
        boxShadow: SHADOW.md,
        border: `1px solid ${COLORS.border}`,
        minWidth: 148,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={(e) => { e.stopPropagation(); actions.onEdit(); onClose(); }}
        style={{
          width: '100%', padding: '11px 14px',
          display: 'flex', alignItems: 'center', gap: 9,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 700, color: COLORS.textPrimary,
          direction: 'rtl',
        }}
      >
        <Pencil size={14} style={{ color: COLORS.primary, flexShrink: 0 }} />
        تعديل الإعلان
      </button>
      <div style={{ height: 1, background: COLORS.border }} />
      <button
        onClick={(e) => { e.stopPropagation(); actions.onDelete(); onClose(); }}
        style={{
          width: '100%', padding: '11px 14px',
          display: 'flex', alignItems: 'center', gap: 9,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 700, color: COLORS.error,
          direction: 'rtl',
        }}
      >
        <Trash2 size={14} style={{ color: COLORS.error, flexShrink: 0 }} />
        حذف الإعلان
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export function ProductCard({ listing, ownerActions }: Props) {
  const nav = useNavigate();
  const { toggleLike, isLiked, likeCounts } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const liked     = isLiked(listing.id);
  const likeCount = likeCounts[listing.id] ?? listing.likes;
  const typeColor = TYPE_COLORS[listing.type] ?? COLORS.primary;
  const badgeInfo = listing.badge ? BADGE_STYLES[listing.badge] : null;

  const handleCardClick = () => nav(`/listing/${listing.id}`);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(listing.id, listing.likes);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(prev => !prev);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        background: COLORS.card,
        borderRadius: RADIUS.xl,
        overflow: 'visible',         /* allow dropdown to overflow */
        boxShadow: SHADOW.sm,
        border: `1px solid ${COLORS.border}`,
        cursor: 'pointer',
        position: 'relative',
        transition: 'box-shadow 0.15s',
      }}
    >
      {/* ── Image ── */}
      <div style={{ position: 'relative', height: 170, overflow: 'hidden', borderRadius: `${RADIUS.xl} ${RADIUS.xl} 0 0` }}>
        {listing.image ? (
          <img
            src={listing.image}
            alt={listing.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: COLORS.cardAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 36 }}>🖼️</span>
          </div>
        )}

        {/* Badge */}
        {badgeInfo && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: badgeInfo.bg, borderRadius: RADIUS.full, padding: '3px 9px' }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: badgeInfo.color }}>{badgeInfo.label}</span>
          </div>
        )}

        {/* Like button */}
        <button
          onClick={handleLike}
          style={{
            position: 'absolute', top: 8, left: 8,
            width: 32, height: 32,
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
            borderRadius: RADIUS.full,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: SHADOW.sm,
          }}
        >
          <Heart size={14} style={{ color: liked ? COLORS.error : COLORS.textSecondary, fill: liked ? COLORS.error : 'none' }} />
        </button>

        {/* Type label */}
        <div style={{ position: 'absolute', bottom: 8, left: 8, background: typeColor, borderRadius: RADIUS.full, padding: '3px 9px' }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#fff' }}>{listing.typeLabel}</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '10px 12px 12px' }}>
        {/* Title row + three-dot menu */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
          <p style={{
            flex: 1,
            fontSize: 13, fontWeight: 800, color: COLORS.textPrimary,
            margin: 0, lineHeight: 1.35,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {listing.title}
          </p>

          {/* ⋮ owner menu trigger */}
          {ownerActions && (
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button
                onClick={handleMenuToggle}
                style={{
                  width: 28, height: 28,
                  background: menuOpen ? COLORS.cardAlt : 'transparent',
                  borderRadius: RADIUS.md,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${menuOpen ? COLORS.border : 'transparent'}`,
                }}
                title="خيارات"
              >
                <MoreVertical size={15} style={{ color: COLORS.textTertiary }} />
              </button>

              {menuOpen && (
                <OwnerMenu actions={ownerActions} onClose={() => setMenuOpen(false)} />
              )}
            </div>
          )}
        </div>

        {/* Price */}
        <p style={{ fontSize: 15, fontWeight: 900, color: COLORS.primary, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
          {listing.priceLabel}
        </p>

        {/* Footer row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <MapPin size={11} style={{ color: COLORS.textTertiary }} />
            <span style={{ fontSize: 11, color: COLORS.textTertiary }}>{listing.city}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Heart size={11} style={{ color: COLORS.textTertiary }} />
              <span style={{ fontSize: 11, color: COLORS.textTertiary }}>{likeCount}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Eye size={11} style={{ color: COLORS.textTertiary }} />
              <span style={{ fontSize: 11, color: COLORS.textTertiary }}>{listing.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
