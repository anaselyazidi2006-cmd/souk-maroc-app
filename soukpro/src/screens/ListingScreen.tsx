import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Edit2, Trash2, MapPin, Tag, Package, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { COLORS, RADIUS, FONT } from '@/theme';
import type { Listing } from '@/types';

export function ListingScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useApp();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchListing();
  }, [id]);

  async function fetchListing() {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (err || !data) {
      setError('تعذّر تحميل الإعلان');
    } else {
      setListing(data as Listing);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!listing || !user) return;
    setDeleting(true);
    const { error: err } = await supabase
      .from('listings')
      .delete()
      .eq('id', listing.id)
      .eq('user_id', user.id);

    if (err) {
      setError('فشل حذف الإعلان. حاول مجدداً.');
      setDeleting(false);
      setShowDeleteConfirm(false);
    } else {
      navigate('/profile');
    }
  }

  const isOwner = user && listing && user.id === listing.user_id;

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background, minHeight: '100dvh' }}>
        <div style={{ width: 36, height: 36, border: `3px solid ${COLORS.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || !listing) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: COLORS.background, minHeight: '100dvh', gap: 16, padding: 24 }}>
        <p style={{ color: COLORS.textSecondary, fontSize: FONT.md, textAlign: 'center' }}>{error || 'الإعلان غير موجود'}</p>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: '10px 24px', background: COLORS.primary, color: '#fff', border: 'none', borderRadius: RADIUS.full, fontSize: FONT.base, cursor: 'pointer' }}
        >
          العودة
        </button>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.background }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: COLORS.text }}>
          <ArrowRight size={22} />
          <span style={{ fontSize: FONT.md, fontWeight: 600 }}>تفاصيل الإعلان</span>
        </button>
        {isOwner && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => navigate(`/post_ad?edit=${listing.id}`)}
              style={{ background: COLORS.primaryLight, border: 'none', borderRadius: RADIUS.md, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: COLORS.primaryDark, fontSize: FONT.sm, fontWeight: 600 }}
            >
              <Edit2 size={16} />
              تعديل
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{ background: '#FEE2E2', border: 'none', borderRadius: RADIUS.md, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: COLORS.error, fontSize: FONT.sm, fontWeight: 600 }}
            >
              <Trash2 size={16} />
              حذف
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div style={{ margin: 16, padding: 20, background: '#FEF2F2', border: `1px solid #FECACA`, borderRadius: RADIUS.lg }}>
          <p style={{ fontSize: FONT.md, fontWeight: 700, color: COLORS.error, marginBottom: 8 }}>حذف الإعلان</p>
          <p style={{ fontSize: FONT.sm, color: COLORS.textSecondary, marginBottom: 16 }}>
            هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{ flex: 1, padding: '10px 0', background: COLORS.error, color: '#fff', border: 'none', borderRadius: RADIUS.md, fontSize: FONT.base, fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1 }}
            >
              {deleting ? 'جارٍ الحذف...' : 'تأكيد الحذف'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleting}
              style={{ flex: 1, padding: '10px 0', background: COLORS.surfaceAlt, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, fontSize: FONT.base, fontWeight: 600, cursor: 'pointer' }}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Image */}
      {listing.image_url && (
        <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: COLORS.surfaceAlt }}>
          <img
            src={listing.image_url}
            alt={listing.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Title & Price */}
        <div>
          <h1 style={{ fontSize: FONT.xl, fontWeight: 800, color: COLORS.text, margin: 0, marginBottom: 8 }}>{listing.title}</h1>
          <p style={{ fontSize: FONT.xxl, fontWeight: 800, color: COLORS.primary, margin: 0 }}>{listing.price.toLocaleString('ar-MA')} د.م.</p>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {listing.category && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.textSecondary }}>
              <Tag size={16} />
              <span style={{ fontSize: FONT.sm }}>{listing.category}</span>
            </div>
          )}
          {listing.condition && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.textSecondary }}>
              <Package size={16} />
              <span style={{ fontSize: FONT.sm }}>{listing.condition}</span>
            </div>
          )}
          {listing.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.textSecondary }}>
              <MapPin size={16} />
              <span style={{ fontSize: FONT.sm }}>{listing.location}</span>
            </div>
          )}
          {listing.created_at && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.textMuted }}>
              <Calendar size={16} />
              <span style={{ fontSize: FONT.xs }}>
                {new Date(listing.created_at).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {listing.description && (
          <div>
            <h2 style={{ fontSize: FONT.md, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>الوصف</h2>
            <p style={{ fontSize: FONT.base, color: COLORS.textSecondary, lineHeight: 1.7, margin: 0 }}>{listing.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
