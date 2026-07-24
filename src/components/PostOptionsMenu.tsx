import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Pencil, Trash2, Flag, X } from 'lucide-react';
import { COLORS, RADIUS, SHADOW } from '@/theme';

interface Props {
  isOwner: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PostOptionsMenu({ isOwner, onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const REPORT_REASONS = [
    'محتوى غير تجاري',
    'إعلان مضلل أو مزيف',
    'منتج محظور أو غير قانوني',
    'سعر مبالغ فيه',
    'بريد مزعج أو مكرر',
    'سبب آخر',
  ];

  const handleReport = () => {
    if (!reason.trim()) return;
    // In a real app this would call an API
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReason('');
      setShowReport(false);
      setOpen(false);
    }, 2000);
  };

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        style={{
          width: 32, height: 32, borderRadius: RADIUS.md,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${COLORS.border}`,
          cursor: 'pointer', transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = COLORS.cardAlt)}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.85)')}
        title="خيارات"
      >
        <MoreVertical size={15} style={{ color: COLORS.textSecondary }} />
      </button>

      {/* Dropdown */}
      {open && !showReport && (
        <div style={{
          position: 'absolute', top: 36, right: 0, minWidth: 160,
          background: COLORS.card, borderRadius: RADIUS.xl,
          boxShadow: SHADOW.lg, border: `1px solid ${COLORS.border}`,
          zIndex: 300, overflow: 'hidden',
          animation: 'fadeIn 0.15s ease',
        }}>
          {isOwner ? (
            <>
              <button
                onClick={e => { e.stopPropagation(); setOpen(false); onEdit?.(); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 16px', fontSize: 13, fontWeight: 700,
                  color: COLORS.textPrimary, background: 'transparent',
                  borderBottom: `1px solid ${COLORS.borderLight}`, cursor: 'pointer',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = COLORS.cardAlt)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Pencil size={14} style={{ color: COLORS.primary }} />
                تعديل الإعلان
              </button>
              <button
                onClick={e => { e.stopPropagation(); setOpen(false); onDelete?.(); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 16px', fontSize: 13, fontWeight: 700,
                  color: COLORS.error, background: 'transparent',
                  cursor: 'pointer', transition: 'background 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Trash2 size={14} style={{ color: COLORS.error }} />
                حذف الإعلان
              </button>
            </>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); setShowReport(true); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', fontSize: 13, fontWeight: 700,
                color: COLORS.error, background: 'transparent',
                cursor: 'pointer', transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Flag size={14} style={{ color: COLORS.error }} />
              الإبلاغ عن الإعلان
            </button>
          )}
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)', zIndex: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
          onClick={e => { e.stopPropagation(); setShowReport(false); setOpen(false); }}
        >
          <div
            style={{
              background: COLORS.card, borderRadius: RADIUS.xxl,
              padding: '24px 20px', width: '100%', maxWidth: 380,
              boxShadow: SHADOW.lg,
            }}
            onClick={e => e.stopPropagation()}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <p style={{ fontSize: 36, margin: '0 0 10px' }}>✅</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 6px' }}>تم استلام البلاغ</p>
                <p style={{ fontSize: 13, color: COLORS.textSecondary }}>سيتم مراجعة هذا الإعلان من قِبَل فريقنا</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 36, height: 36, background: '#FEF2F2', borderRadius: RADIUS.lg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Flag size={16} style={{ color: COLORS.error }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, margin: 0 }}>الإبلاغ عن الإعلان</h3>
                      <p style={{ fontSize: 11, color: COLORS.textTertiary, margin: 0 }}>اختر سبب البلاغ</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setShowReport(false); setOpen(false); }}
                    style={{ width: 30, height: 30, background: COLORS.cardAlt, borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={14} style={{ color: COLORS.textSecondary }} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {REPORT_REASONS.map(r => (
                    <button
                      key={r}
                      onClick={() => setReason(r)}
                      style={{
                        padding: '10px 14px', borderRadius: RADIUS.lg, textAlign: 'right',
                        fontSize: 13, fontWeight: reason === r ? 800 : 500,
                        color: reason === r ? COLORS.primary : COLORS.textSecondary,
                        background: reason === r ? COLORS.primary100 : COLORS.cardAlt,
                        border: reason === r ? `1.5px solid ${COLORS.primary200}` : `1.5px solid transparent`,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleReport}
                  disabled={!reason.trim()}
                  style={{
                    width: '100%', height: 48, borderRadius: RADIUS.lg, fontSize: 14,
                    fontWeight: 800, color: '#fff',
                    background: reason.trim() ? COLORS.error : COLORS.border,
                    cursor: reason.trim() ? 'pointer' : 'not-allowed',
                    transition: 'background 0.15s',
                  }}
                >
                  إرسال البلاغ
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
