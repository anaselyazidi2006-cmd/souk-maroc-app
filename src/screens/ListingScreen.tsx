import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share2, Phone, MessageCircle, MapPin, Eye, Send, Star, Pencil, Trash2, X, AlertTriangle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import type { Listing } from '@/types';
import { COLORS, RADIUS, SHADOW } from '@/theme';
import { supabase } from '@/lib/supabase';

const TYPE_COLORS: Record<string, string> = {
  sale: '#16A34A', service: COLORS.primary, job: '#7C3AED', rent: '#0284C7',
};

function mapRow(r: Record<string, unknown>): Listing {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    userName: r.user_name as string,
    userAvatar: r.user_avatar as string,
    userCity: r.user_city as string,
    userRating: Number(r.user_rating) || 4.5,
    title: r.title as string,
    description: r.description as string,
    price: r.price != null ? Number(r.price) : null,
    priceLabel: r.price_label as string,
    type: r.type as Listing['type'],
    typeLabel: r.type_label as string,
    category: r.category as string,
    image: r.image as string,
    city: r.city as string,
    phone: r.phone as string,
    whatsapp: r.whatsapp as string,
    createdAt: r.created_at as string,
    likes: Number(r.likes) || 0,
    comments: Number(r.comments) || 0,
    views: Number(r.views) || 0,
    badge: r.badge as Listing['badge'],
  };
}

/* ─── Styled delete confirmation dialog ─────────────────────────────────── */
interface DeleteDialogProps {
  listingTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function DeleteDialog({ listingTitle, onConfirm, onCancel, loading }: DeleteDialogProps) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 340,
          background: COLORS.card,
          borderRadius: RADIUS.xl,
          boxShadow: SHADOW.lg,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '18px 18px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, background: '#FEF2F2', borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={20} style={{ color: COLORS.error }} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 900, color: COLORS.textPrimary, margin: 0 }}>حذف الإعلان</p>
              <p style={{ fontSize: 12, color: COLORS.textTertiary, margin: '2px 0 0' }}>هذا الإجراء لا يمكن التراجع عنه</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            style={{ width: 28, height: 28, background: COLORS.cardAlt, borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${COLORS.border}` }}
          >
            <X size={14} style={{ color: COLORS.textTertiary }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 18px 18px' }}>
          <div style={{ background: COLORS.cardAlt, borderRadius: RADIUS.lg, padding: '10px 13px', marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: 0, lineHeight: 1.5 }}>
              هل أنت متأكد من حذف إعلان{' '}
              <span style={{ fontWeight: 800, color: COLORS.textPrimary }}>"{listingTitle}"</span>؟
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onCancel}
              disabled={loading}
              style={{ flex: 1, height: 44, background: COLORS.cardAlt, border: `1.5px solid ${COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 13, fontWeight: 800, color: COLORS.textSecondary, cursor: 'pointer' }}
            >
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1, height: 44,
                background: loading ? '#FEE2E2' : COLORS.error,
                border: 'none', borderRadius: RADIUS.lg,
                fontSize: 13, fontWeight: 900, color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  جاري الحذف…
                </>
              ) : (
                <><Trash2 size={14} /> حذف</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export function ListingScreen() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { toggleLike, isLiked, likeCounts, getComments, addComment, user } = useApp();
  const [commentText, setCommentText] = useState('');
  const [listing, setListing] = useState<Listing | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  /* delete dialog */
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    supabase.from('listings').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (data) setListing(mapRow(data as Record<string, unknown>));
      setLoading(false);
    });
  }, [id]);

  const isOwner = !!(user && listing && user.id === listing.userId);

  const handleDeleteConfirm = async () => {
    if (!listing) return;
    setDeleting(true);
    const { error } = await supabase.from('listings').delete().eq('id', listing.id);
    setDeleting(false);
    if (error) { alert('فشل الحذف: ' + error.message); return; }
    nav('/profile');
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background, minHeight: '100vh' }}>
        <div style={{ width: 32, height: 32, border: `3px solid ${COLORS.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!listing) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: COLORS.background, gap: 12, minHeight: '100vh' }}>
        <p style={{ fontSize: 48, margin: 0 }}>🔍</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>الإعلان غير موجود</p>
        <button onClick={() => nav('/')} style={{ padding: '8px 20px', background: COLORS.primary, color: '#fff', borderRadius: RADIUS.lg, fontWeight: 700, fontSize: 13 }}>الرئيسية</button>
      </div>
    );
  }

  const liked      = isLiked(listing.id);
  const likeCount  = likeCounts[listing.id] ?? listing.likes;
  const comments   = getComments(listing.id);
  const typeColor  = TYPE_COLORS[listing.type] ?? COLORS.primary;

  const handleSend = () => { if (commentText.trim()) { addComment(listing.id, commentText); setCommentText(''); } };

  const handleShare = async () => {
    const url = `${window.location.origin}/listing/${listing.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: listing.title, text: listing.description, url }); }
      catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      alert('تم نسخ الرابط');
    }
  };

  return (
    <div style={{ background: COLORS.background, minHeight: '100%', paddingBottom: 100 }}>
      {/* ── Hero image ── */}
      <div style={{ position: 'relative', height: 280, overflow: 'hidden', background: COLORS.cardAlt }}>
        {listing.image ? (
          <img src={listing.image} alt={listing.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 64 }}>🖼️</span>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />

        {/* Nav buttons */}
        <div style={{ position: 'absolute', top: 48, left: 16, right: 16, display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={() => nav(-1 as unknown as string)}
            style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)', borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW.sm }}
          >
            <ArrowLeft size={18} style={{ color: COLORS.textPrimary }} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => toggleLike(listing.id, listing.likes)}
              style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)', borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW.sm }}
            >
              <Heart size={16} style={{ color: liked ? COLORS.error : COLORS.textPrimary, fill: liked ? COLORS.error : 'none' }} />
            </button>
            <button
              onClick={handleShare}
              style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)', borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW.sm }}
            >
              <Share2 size={16} style={{ color: COLORS.textPrimary }} />
            </button>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 14, left: 16 }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{listing.priceLabel}</span>
        </div>
        <div style={{ position: 'absolute', bottom: 14, right: 16, background: typeColor, padding: '4px 12px', borderRadius: RADIUS.full }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{listing.typeLabel}</span>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Stats bar */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 14, padding: '10px 14px', background: COLORS.card, borderRadius: RADIUS.xl, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}` }}>
          {[
            { icon: Heart,         val: likeCount,                        label: 'إعجاب' },
            { icon: MessageCircle, val: listing.comments + comments.length, label: 'تعليق' },
            { icon: Eye,           val: listing.views,                    label: 'مشاهدة' },
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

        {/* Owner actions: Edit & Delete */}
        {isOwner && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <button
              onClick={() => nav(`/edit_listing/${listing.id}`)}
              style={{
                flex: 1, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                background: COLORS.primary100,
                color: COLORS.primary,
                border: `1.5px solid ${COLORS.primary200}`,
                borderRadius: RADIUS.lg,
                fontSize: 13, fontWeight: 800, cursor: 'pointer',
              }}
            >
              <Pencil size={14} />
              تعديل الإعلان
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              style={{
                flex: 1, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                background: '#FEF2F2',
                color: COLORS.error,
                border: '1.5px solid #FECACA',
                borderRadius: RADIUS.lg,
                fontSize: 13, fontWeight: 800, cursor: 'pointer',
              }}
            >
              <Trash2 size={14} />
              حذف الإعلان
            </button>
          </div>
        )}

        {/* Seller info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: COLORS.card, borderRadius: RADIUS.xl, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}`, marginBottom: 14 }}>
          <div style={{ width: 46, height: 46, background: `linear-gradient(135deg,${COLORS.primary},${COLORS.primary700})`, borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{listing.userAvatar || '👤'}</span>
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

        {/* Comments */}
        <div style={{ background: COLORS.card, borderRadius: RADIUS.xl, padding: '14px 16px', boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}`, marginBottom: 14 }}>
          <h3 style={{ fontSize: 13, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <MessageCircle size={15} style={{ color: COLORS.primary }} />
            التعليقات ({listing.comments + comments.length})
          </h3>
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
              <button
                onClick={handleSend}
                style={{ width: 30, height: 30, background: commentText.trim() ? COLORS.primary : COLORS.border, borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                <Send size={13} style={{ color: '#fff' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact bar (fixed bottom) ── */}
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

      {/* ── Delete confirmation dialog ── */}
      {showDeleteDialog && (
        <DeleteDialog
          listingTitle={listing.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !deleting && setShowDeleteDialog(false)}
          loading={deleting}
        />
      )}
    </div>
  );
}
