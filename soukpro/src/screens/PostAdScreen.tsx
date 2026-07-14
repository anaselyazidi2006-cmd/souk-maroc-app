import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Camera, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { COLORS, RADIUS, FONT } from '@/theme';
import type { Listing } from '@/types';

const CATEGORIES = [
  'صناعة تقليدية', 'توابل وأعشاب', 'جلود وحقائب', 'نسيج وملابس',
  'مجوهرات وإكسسوارات', 'خزف وفخار', 'أثاث وديكور', 'إلكترونيات', 'أخرى',
];

const CONDITIONS = ['جديد', 'ممتاز', 'جيد جداً', 'جيد', 'مقبول'];

const LOCATIONS = [
  'الدار البيضاء', 'الرباط', 'مراكش', 'فاس', 'طنجة', 'أكادير',
  'مكناس', 'وجدة', 'القنيطرة', 'تطوان', 'أخرى',
];

interface FormState {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  location: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  price: '',
  category: '',
  condition: '',
  location: '',
};

export function PostAdScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = Boolean(editId);

  const { user } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingListing, setLoadingListing] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load existing listing in edit mode
  useEffect(() => {
    if (!isEditMode || !editId) return;

    async function fetchListing() {
      setLoadingListing(true);
      const { data, error: err } = await supabase
        .from('listings')
        .select('*')
        .eq('id', editId)
        .single();

      if (err || !data) {
        setError('تعذّر تحميل بيانات الإعلان');
        setLoadingListing(false);
        return;
      }

      const l = data as Listing;

      // Verify ownership
      if (user && l.user_id !== user.id) {
        setError('غير مصرح لك بتعديل هذا الإعلان');
        setLoadingListing(false);
        return;
      }

      setForm({
        title: l.title,
        description: l.description,
        price: String(l.price),
        category: l.category,
        condition: l.condition,
        location: l.location,
      });
      setExistingImageUrl(l.image_url);
      setLoadingListing(false);
    }

    fetchListing();
  }, [editId, isEditMode, user]);

  function handleField(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(null);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function validate(): string | null {
    if (!form.title.trim()) return 'يرجى إدخال عنوان الإعلان';
    if (!form.price.trim() || isNaN(Number(form.price)) || Number(form.price) <= 0)
      return 'يرجى إدخال سعر صحيح';
    if (!form.category) return 'يرجى اختيار الفئة';
    if (!form.condition) return 'يرجى اختيار حالة المنتج';
    if (!form.location) return 'يرجى اختيار المدينة';
    return null;
  }

  async function uploadImage(userId: string): Promise<string | null> {
    if (!imageFile) return existingImageUrl;
    const ext = imageFile.name.split('.').pop() ?? 'jpg';
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('listings')
      .upload(path, imageFile, { upsert: true });

    if (uploadError) throw new Error('فشل رفع الصورة');

    const { data } = supabase.storage.from('listings').getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit() {
    if (!user) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const imageUrl = await uploadImage(user.id);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        condition: form.condition,
        location: form.location,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      if (isEditMode && editId) {
        const { error: updateError } = await supabase
          .from('listings')
          .update(payload)
          .eq('id', editId)
          .eq('user_id', user.id);

        if (updateError) throw new Error('فشل تحديث الإعلان');
      } else {
        const { error: insertError } = await supabase
          .from('listings')
          .insert({ ...payload, user_id: user.id });

        if (insertError) throw new Error('فشل نشر الإعلان');
      }

      setSuccess(true);
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  }

  // ── Loading listing in edit mode ─────────────────────────────────────────────
  if (loadingListing) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background, minHeight: '100dvh' }}>
        <div style={{ width: 36, height: 36, border: `3px solid ${COLORS.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const currentImage = imagePreview ?? existingImageUrl;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: COLORS.background }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.text, display: 'flex', alignItems: 'center' }}>
          <ArrowRight size={22} />
        </button>
        <h1 style={{ fontSize: FONT.lg, fontWeight: 800, color: COLORS.text, margin: 0 }}>
          {isEditMode ? 'تعديل الإعلان' : 'نشر إعلان'}
        </h1>
      </div>

      {/* Success Banner */}
      {success && (
        <div style={{ margin: 16, padding: 16, background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: RADIUS.md, textAlign: 'center', color: '#065F46', fontSize: FONT.base, fontWeight: 700 }}>
          {isEditMode ? 'تم تحديث الإعلان بنجاح ✓' : 'تم نشر الإعلان بنجاح ✓'}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div style={{ margin: '8px 16px 0', padding: 14, background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: RADIUS.md, color: COLORS.error, fontSize: FONT.sm, fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* Form */}
      <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto' }}>

        {/* Image Upload */}
        <div>
          <label style={{ fontSize: FONT.sm, fontWeight: 700, color: COLORS.textSecondary, display: 'block', marginBottom: 10 }}>صورة الإعلان</label>
          {currentImage ? (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: RADIUS.md, overflow: 'hidden', background: COLORS.surfaceAlt }}>
              <img src={currentImage} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={clearImage}
                style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%', aspectRatio: '4/3', background: COLORS.surfaceAlt, border: `2px dashed ${COLORS.border}`, borderRadius: RADIUS.md, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: COLORS.textMuted }}
            >
              <Camera size={32} />
              <span style={{ fontSize: FONT.sm }}>اضغط لإضافة صورة</span>
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        </div>

        {/* Title */}
        <div>
          <label style={labelStyle}>عنوان الإعلان *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => handleField('title', e.target.value)}
            placeholder="مثال: سجادة بربرية يدوية الصنع"
            style={inputStyle}
            maxLength={100}
          />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>الوصف</label>
          <textarea
            value={form.description}
            onChange={e => handleField('description', e.target.value)}
            placeholder="اكتب وصفاً تفصيلياً للمنتج..."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>

        {/* Price */}
        <div>
          <label style={labelStyle}>السعر (د.م.) *</label>
          <input
            type="number"
            value={form.price}
            onChange={e => handleField('price', e.target.value)}
            placeholder="0"
            min="1"
            style={inputStyle}
          />
        </div>

        {/* Category */}
        <div>
          <label style={labelStyle}>الفئة *</label>
          <select value={form.category} onChange={e => handleField('category', e.target.value)} style={inputStyle}>
            <option value="">اختر الفئة</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label style={labelStyle}>الحالة *</label>
          <select value={form.condition} onChange={e => handleField('condition', e.target.value)} style={inputStyle}>
            <option value="">اختر الحالة</option>
            {CONDITIONS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label style={labelStyle}>المدينة *</label>
          <select value={form.location} onChange={e => handleField('location', e.target.value)} style={inputStyle}>
            <option value="">اختر المدينة</option>
            {LOCATIONS.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || success}
          style={{
            padding: '16px 0',
            background: loading || success ? COLORS.textMuted : COLORS.primary,
            color: '#fff',
            border: 'none',
            borderRadius: RADIUS.lg,
            fontSize: FONT.md,
            fontWeight: 800,
            cursor: loading || success ? 'not-allowed' : 'pointer',
            marginTop: 8,
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'جارٍ الحفظ...' : isEditMode ? 'حفظ التعديلات' : 'نشر الإعلان'}
        </button>
      </div>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  fontSize: FONT.sm,
  fontWeight: 700,
  color: COLORS.textSecondary,
  display: 'block',
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  borderRadius: RADIUS.md,
  fontSize: FONT.base,
  color: COLORS.text,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  direction: 'rtl',
};
