import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, X, ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { COLORS, RADIUS, SHADOW } from '@/theme';
import type { Listing } from '@/types';

/* ─── Static option lists (mirrors PostAdScreen) ──────────────────────── */
const CATEGORIES = [
  { value: 'handcraft', label: 'صناعة يدوية' },
  { value: 'spices', label: 'توابل وأعشاب' },
  { value: 'leather', label: 'جلديات' },
  { value: 'carpets', label: 'سجاد وزرابي' },
  { value: 'jewelry', label: 'مجوهرات' },
  { value: 'clothing', label: 'ملابس' },
  { value: 'electronics', label: 'إلكترونيات' },
  { value: 'furniture', label: 'أثاث' },
  { value: 'food', label: 'مواد غذائية' },
  { value: 'services', label: 'خدمات' },
  { value: 'jobs', label: 'وظائف' },
  { value: 'realestate', label: 'عقارات' },
  { value: 'cars', label: 'سيارات' },
  { value: 'other', label: 'أخرى' },
];

const TYPES = [
  { value: 'sale', label: 'للبيع' },
  { value: 'service', label: 'خدمة' },
  { value: 'job', label: 'وظيفة' },
  { value: 'rent', label: 'للإيجار' },
];

const CITIES = [
  'الرباط', 'الدار البيضاء', 'فاس', 'مراكش', 'طنجة', 'أكادير',
  'مكناس', 'وجدة', 'الجديدة', 'تطوان', 'القنيطرة', 'سلا',
  'بني ملال', 'العيون', 'الناظور', 'خريبكة', 'سطات',
];

const BADGES = [
  { value: '', label: 'بدون' },
  { value: 'new', label: 'جديد' },
  { value: 'featured', label: 'مميز' },
  { value: 'urgent', label: 'عاجل' },
];

/* ─── mapRow helper ────────────────────────────────────────────────────── */
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

/* ─── Small reusable field label ───────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, margin: '0 0 6px' }}>
      {children}
    </p>
  );
}

/* ─── Select wrapper ───────────────────────────────────────────────────── */
function SelectField({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', height: 46, padding: '0 14px', appearance: 'none',
          background: COLORS.cardAlt, border: `1.5px solid ${COLORS.border}`,
          borderRadius: RADIUS.lg, fontSize: 13, color: COLORS.textPrimary,
          outline: 'none', direction: 'rtl', cursor: 'pointer',
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown
        size={15}
        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: COLORS.textTertiary, pointerEvents: 'none' }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export function EditListingScreen() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { user } = useApp();

  /* loading / not-found state */
  const [pageLoading, setPageLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* form fields */
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [type, setType] = useState('sale');
  const [category, setCategory] = useState('handcraft');
  const [city, setCity] = useState('الرباط');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [badge, setBadge] = useState('');

  /* image state */
  const [imageUrl, setImageUrl] = useState('');          // current/saved URL
  const [imageFile, setImageFile] = useState<File | null>(null);  // new file chosen
  const [imagePreview, setImagePreview] = useState('');  // local object URL
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── Fetch existing listing ──────────────────────────────────────────── */
  useEffect(() => {
    if (!id) { setNotFound(true); setPageLoading(false); return; }

    supabase.from('listings').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (!data) { setNotFound(true); setPageLoading(false); return; }

      const listing = mapRow(data as Record<string, unknown>);

      /* Ownership guard */
      if (user && listing.userId !== user.id) {
        setNotFound(true);
        setPageLoading(false);
        return;
      }

      /* Populate fields */
      setTitle(listing.title);
      setDescription(listing.description);
      setPrice(listing.price != null ? String(listing.price) : '');
      setNegotiable(listing.price == null);
      setType(listing.type);
      setCategory(listing.category);
      setCity(listing.city);
      setPhone(listing.phone);
      setWhatsapp(listing.whatsapp);
      setBadge(listing.badge ?? '');
      setImageUrl(listing.image);

      setPageLoading(false);
    });
  }, [id, user]);

  /* ── Image picker ────────────────────────────────────────────────────── */
  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview('');
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ── Validation ──────────────────────────────────────────────────────── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'العنوان مطلوب';
    if (!description.trim()) e.description = 'الوصف مطلوب';
    if (!negotiable && (!price || isNaN(Number(price)) || Number(price) <= 0))
      e.price = 'أدخل سعراً صحيحاً أو اختر "بالاتفاق"';
    if (!phone.trim()) e.phone = 'رقم الهاتف مطلوب';
    return e;
  };

  /* ── Upload image if changed ─────────────────────────────────────────── */
  const uploadImage = async (): Promise<string> => {
    if (!imageFile || !user) return imageUrl;

    setUploadingImage(true);
    const ext = imageFile.name.split('.').pop() ?? 'jpg';
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from('listings').upload(path, imageFile, { upsert: true });
    setUploadingImage(false);

    if (error) throw new Error('فشل رفع الصورة: ' + error.message);

    const { data } = supabase.storage.from('listings').getPublicUrl(path);
    return data.publicUrl;
  };

  /* ── Save handler ────────────────────────────────────────────────────── */
  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);

    try {
      const finalImageUrl = await uploadImage();

      const typeObj = TYPES.find(t => t.value === type)!;
      const finalPrice = negotiable ? null : Number(price);
      const priceLabel = negotiable ? 'بالاتفاق' : `${Number(price).toLocaleString('ar-MA')} درهم`;

      const payload: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim(),
        price: finalPrice,
        price_label: priceLabel,
        type,
        type_label: typeObj.label,
        category,
        city,
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        badge: badge || null,
        image: finalImageUrl,
      };

      const { error } = await supabase.from('listings').update(payload).eq('id', id);
      if (error) throw new Error(error.message);

      nav(`/listing/${id}`);
    } catch (err: unknown) {
      alert('حدث خطأ: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  /* ── Render guards ───────────────────────────────────────────────────── */
  if (pageLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background, minHeight: '100vh' }}>
        <div style={{ width: 32, height: 32, border: `3px solid ${COLORS.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: COLORS.background, minHeight: '100vh', gap: 12 }}>
        <p style={{ fontSize: 48, margin: 0 }}>🚫</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>الإعلان غير موجود أو لا تملك صلاحية تعديله</p>
        <button
          onClick={() => nav(-1 as unknown as string)}
          style={{ padding: '8px 20px', background: COLORS.primary, color: '#fff', borderRadius: RADIUS.lg, fontWeight: 700, fontSize: 13 }}
        >
          رجوع
        </button>
      </div>
    );
  }

  const displayImage = imagePreview || imageUrl;
  const isSubmitDisabled = saving || uploadingImage;

  /* ── Form ────────────────────────────────────────────────────────────── */
  return (
    <div style={{ background: COLORS.background, minHeight: '100%', paddingBottom: 32 }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: COLORS.card, borderBottom: `1px solid ${COLORS.border}`,
        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: SHADOW.sm,
      }}>
        <button
          onClick={() => nav(-1 as unknown as string)}
          style={{ width: 36, height: 36, background: COLORS.cardAlt, borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${COLORS.border}` }}
        >
          <ArrowLeft size={18} style={{ color: COLORS.textPrimary }} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 17, fontWeight: 900, color: COLORS.textPrimary, margin: 0 }}>تعديل الإعلان</h1>
          <p style={{ fontSize: 12, color: COLORS.textTertiary, margin: 0 }}>عدّل بيانات إعلانك</p>
        </div>
      </div>

      <div style={{ padding: '16px' }}>

        {/* ── Image section ── */}
        <div style={{ background: COLORS.card, borderRadius: RADIUS.xl, padding: 16, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}`, marginBottom: 14 }}>
          <Label>صورة الإعلان</Label>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImagePick} />

          {displayImage ? (
            <div style={{ position: 'relative', borderRadius: RADIUS.lg, overflow: 'hidden', height: 200 }}>
              <img src={displayImage} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={clearImage}
                style={{ position: 'absolute', top: 8, left: 8, width: 28, height: 28, background: 'rgba(0,0,0,0.6)', borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={14} style={{ color: '#fff' }} />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', borderRadius: RADIUS.lg, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Camera size={13} style={{ color: '#fff' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>تغيير</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%', height: 160, background: COLORS.cardAlt, border: `2px dashed ${COLORS.border}`, borderRadius: RADIUS.lg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer' }}
            >
              <div style={{ width: 52, height: 52, background: COLORS.primary100, borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={24} style={{ color: COLORS.primary }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textSecondary }}>اضغط لاختيار صورة</span>
            </button>
          )}
        </div>

        {/* ── Basic info ── */}
        <div style={{ background: COLORS.card, borderRadius: RADIUS.xl, padding: 16, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}`, marginBottom: 14 }}>
          <Label>معلومات الإعلان</Label>

          {/* Title */}
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: COLORS.textTertiary, margin: '0 0 4px' }}>العنوان *</p>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="عنوان الإعلان"
              style={{ width: '100%', height: 46, padding: '0 14px', background: COLORS.cardAlt, border: `1.5px solid ${errors.title ? COLORS.error : COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 13, color: COLORS.textPrimary, outline: 'none', direction: 'rtl', boxSizing: 'border-box' }}
            />
            {errors.title && <p style={{ fontSize: 11, color: COLORS.error, margin: '4px 0 0' }}>{errors.title}</p>}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: COLORS.textTertiary, margin: '0 0 4px' }}>الوصف *</p>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="اكتب وصفاً تفصيلياً للإعلان…"
              rows={4}
              style={{ width: '100%', padding: '10px 14px', background: COLORS.cardAlt, border: `1.5px solid ${errors.description ? COLORS.error : COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 13, color: COLORS.textPrimary, outline: 'none', direction: 'rtl', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
            {errors.description && <p style={{ fontSize: 11, color: COLORS.error, margin: '4px 0 0' }}>{errors.description}</p>}
          </div>

          {/* Type */}
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: COLORS.textTertiary, margin: '0 0 4px' }}>نوع الإعلان</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  style={{
                    padding: '7px 16px', borderRadius: RADIUS.full, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    background: type === t.value ? COLORS.primary : COLORS.cardAlt,
                    color: type === t.value ? '#fff' : COLORS.textSecondary,
                    border: `1.5px solid ${type === t.value ? COLORS.primary : COLORS.border}`,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: 0 }}>
            <p style={{ fontSize: 12, color: COLORS.textTertiary, margin: '0 0 4px' }}>الفئة</p>
            <SelectField value={category} onChange={setCategory} options={CATEGORIES} />
          </div>
        </div>

        {/* ── Price ── */}
        <div style={{ background: COLORS.card, borderRadius: RADIUS.xl, padding: 16, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}`, marginBottom: 14 }}>
          <Label>السعر</Label>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: negotiable ? 0 : 12 }}>
            <button
              onClick={() => setNegotiable(!negotiable)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: negotiable ? COLORS.primary100 : COLORS.cardAlt, borderRadius: RADIUS.lg, border: `1.5px solid ${negotiable ? COLORS.primary200 : COLORS.border}`, cursor: 'pointer' }}
            >
              <div style={{ width: 18, height: 18, borderRadius: 4, background: negotiable ? COLORS.primary : COLORS.cardAlt, border: `2px solid ${negotiable ? COLORS.primary : COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {negotiable && <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>✓</span>}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: negotiable ? COLORS.primary : COLORS.textSecondary }}>بالاتفاق</span>
            </button>
          </div>

          {!negotiable && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  style={{ flex: 1, height: 46, padding: '0 14px', background: COLORS.cardAlt, border: `1.5px solid ${errors.price ? COLORS.error : COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, outline: 'none', direction: 'ltr', textAlign: 'right', boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, whiteSpace: 'nowrap' }}>درهم</span>
              </div>
              {errors.price && <p style={{ fontSize: 11, color: COLORS.error, margin: '4px 0 0' }}>{errors.price}</p>}
            </div>
          )}
        </div>

        {/* ── Location ── */}
        <div style={{ background: COLORS.card, borderRadius: RADIUS.xl, padding: 16, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}`, marginBottom: 14 }}>
          <Label>الموقع</Label>
          <SelectField value={city} onChange={setCity} options={CITIES.map(c => ({ value: c, label: c }))} />
        </div>

        {/* ── Contact ── */}
        <div style={{ background: COLORS.card, borderRadius: RADIUS.xl, padding: 16, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}`, marginBottom: 14 }}>
          <Label>معلومات التواصل</Label>

          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: COLORS.textTertiary, margin: '0 0 4px' }}>رقم الهاتف *</p>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+212 6XX XXXXXX"
              style={{ width: '100%', height: 46, padding: '0 14px', background: COLORS.cardAlt, border: `1.5px solid ${errors.phone ? COLORS.error : COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 13, color: COLORS.textPrimary, outline: 'none', direction: 'ltr', textAlign: 'right', boxSizing: 'border-box' }}
            />
            {errors.phone && <p style={{ fontSize: 11, color: COLORS.error, margin: '4px 0 0' }}>{errors.phone}</p>}
          </div>

          <div>
            <p style={{ fontSize: 12, color: COLORS.textTertiary, margin: '0 0 4px' }}>واتساب (اختياري)</p>
            <input
              type="tel"
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              placeholder="+212 6XX XXXXXX"
              style={{ width: '100%', height: 46, padding: '0 14px', background: COLORS.cardAlt, border: `1.5px solid ${COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 13, color: COLORS.textPrimary, outline: 'none', direction: 'ltr', textAlign: 'right', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* ── Badge ── */}
        <div style={{ background: COLORS.card, borderRadius: RADIUS.xl, padding: 16, boxShadow: SHADOW.sm, border: `1px solid ${COLORS.border}`, marginBottom: 20 }}>
          <Label>شارة الإعلان (اختياري)</Label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {BADGES.map(b => (
              <button
                key={b.value}
                onClick={() => setBadge(b.value)}
                style={{
                  padding: '7px 16px', borderRadius: RADIUS.full, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  background: badge === b.value ? COLORS.primary : COLORS.cardAlt,
                  color: badge === b.value ? '#fff' : COLORS.textSecondary,
                  border: `1.5px solid ${badge === b.value ? COLORS.primary : COLORS.border}`,
                }}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Submit ── */}
        <button
          onClick={handleSave}
          disabled={isSubmitDisabled}
          style={{
            width: '100%', height: 54, borderRadius: RADIUS.xl, fontSize: 16, fontWeight: 900,
            background: isSubmitDisabled ? COLORS.border : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary700})`,
            color: isSubmitDisabled ? COLORS.textTertiary : '#fff',
            boxShadow: isSubmitDisabled ? 'none' : '0 4px 16px rgba(255,107,0,0.35)',
            cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'all 0.2s',
          }}
        >
          {saving || uploadingImage ? (
            <>
              <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span>{uploadingImage ? 'جاري رفع الصورة…' : 'جاري الحفظ…'}</span>
            </>
          ) : (
            <span>💾  حفظ التغييرات</span>
          )}
        </button>
      </div>
    </div>
  );
}
