import { useState, useRef } from 'react';
import { ArrowLeft, Camera, MapPin, Tag, FileText, Phone, ChevronDown, X, Upload } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MOROCCAN_CITIES } from '@/data';
import type { Listing } from '@/types';
import { COLORS, RADIUS, SHADOW } from '@/theme';
import { supabase } from '@/lib/supabase';

const TYPES = [
  { id: 'sale',    label: 'للبيع',   emoji: '🏷️' },
  { id: 'service', label: 'خدمة',   emoji: '🔧' },
  { id: 'job',     label: 'وظيفة',  emoji: '💼' },
  { id: 'rent',    label: 'للكراء', emoji: '🏠' },
];

const SAMPLE_IMAGES = [
  'https://images.pexels.com/photos/6287447/pexels-photo-6287447.jpeg?auto=compress&cs=tinysrgb&w=700',
  'https://images.pexels.com/photos/4046316/pexels-photo-4046316.jpeg?auto=compress&cs=tinysrgb&w=700',
  'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=700',
  'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=700',
];

function Field({ icon: Icon, label, children }: { icon: typeof Camera; label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <Icon size={14} style={{ color: COLORS.primary }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: COLORS.cardAlt, border: `1.5px solid ${COLORS.border}`,
  borderRadius: RADIUS.lg, padding: '12px 14px', fontSize: 13,
  color: COLORS.textPrimary, outline: 'none', boxSizing: 'border-box',
};

export function PostAdScreen() {
  const { goBack, addListing, navigate, user } = useApp();
  const [step, setStep] = useState(1); // 1=details, 2=success
  const [type, setType] = useState('sale');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState(user?.city ?? 'Marrakech');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [imgIdx, setImgIdx] = useState(0);
  const [showCity, setShowCity] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('listings')
        .upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('listings')
        .getPublicUrl(fileName);
      setUploadedImage(publicUrl);
      setImgIdx(-1);
    } catch (err) {
      console.error('Upload error:', err);
      alert('فشل في رفع الصورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً. الحد الأقصى 5MB');
        return;
      }
      uploadImage(file);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setImgIdx(0);
  };

  const selectedImage = uploadedImage || SAMPLE_IMAGES[imgIdx];

  const canSubmit = title.trim().length >= 3 && city;

  const handleSubmit = () => {
    if (!canSubmit || !user) return;
    const newListing: Listing = {
      id: `l${Date.now()}`, userId: user.id,
      userName: user.name, userAvatar: user.avatar,
      userCity: city, userRating: user.rating || 4.5,
      title: title.trim(), description: desc.trim() || title.trim(),
      price: price ? Number(price) : null,
      priceLabel: price ? `${price} MAD` : 'بالاتفاق',
      type: type as Listing['type'],
      typeLabel: TYPES.find(t => t.id === type)?.label ?? type,
      category: 'handcraft',
      image: selectedImage,
      city, phone: phone || '+212600000000',
      whatsapp: phone || '+212600000000',
      createdAt: new Date().toISOString(),
      likes: 0, comments: 0, views: 0,
      badge: 'new',
    };
    addListing(newListing);
    setStep(2);
  };

  if (!user) {
    return (
      <div style={{ background: COLORS.background, minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', gap: 14 }}>
        <p style={{ fontSize: 44, margin: 0 }}>🔐</p>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: COLORS.textPrimary, margin: 0, textAlign: 'center' }}>سجل دخولك أولاً</h2>
        <p style={{ fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', margin: 0 }}>خاصك تسجل دخول باش تنشر إعلان</p>
        <button onClick={() => navigate('login')} style={{ height: 48, padding: '0 28px', background: COLORS.primary, color: '#fff', fontWeight: 800, fontSize: 14, borderRadius: RADIUS.lg, boxShadow: SHADOW.primary }}>تسجيل الدخول</button>
        <button onClick={goBack} style={{ fontSize: 13, color: COLORS.textTertiary }}>رجوع</button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div style={{ background: COLORS.background, minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', gap: 16 }}>
        <div style={{ width: 80, height: 80, background: '#F0FDF4', borderRadius: RADIUS.xxl, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🎉</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: COLORS.textPrimary, margin: 0, textAlign: 'center', letterSpacing: '-0.03em' }}>تم نشر إعلانك!</h2>
        <p style={{ fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', margin: 0, lineHeight: 1.6 }}>إعلانك الآن مرئي لآلاف المستخدمين في المغرب 🇲🇦</p>
        <button onClick={() => navigate('home')} style={{ height: 52, padding: '0 40px', background: COLORS.primary, color: '#fff', fontWeight: 800, fontSize: 15, borderRadius: RADIUS.lg, boxShadow: SHADOW.primary }}>
          شوف الإعلانات
        </button>
        <button onClick={goBack} style={{ fontSize: 13, color: COLORS.textTertiary }}>أضف إعلان آخر</button>
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.background, minHeight: '100%', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: COLORS.card, padding: '48px 16px 16px', boxShadow: SHADOW.sm, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={goBack} style={{ width: 38, height: 38, background: COLORS.cardAlt, borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${COLORS.border}` }}>
            <ArrowLeft size={18} style={{ color: COLORS.textPrimary }} />
          </button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: COLORS.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>🚀 نشر سريع</h1>
            <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: 0 }}>أضف إعلانك في 10 ثواني</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        {/* Type selector */}
        <Field icon={Tag} label="نوع الإعلان">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {TYPES.map(t => (
              <button key={t.id} onClick={() => setType(t.id)}
                style={{ height: 44, borderRadius: RADIUS.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 13, fontWeight: 700, background: type === t.id ? COLORS.primary : COLORS.card, color: type === t.id ? '#fff' : COLORS.textSecondary, border: type === t.id ? 'none' : `1.5px solid ${COLORS.border}`, boxShadow: type === t.id ? SHADOW.primary : SHADOW.sm, transition: 'all 0.2s' }}>
                <span style={{ fontSize: 17 }}>{t.emoji}</span> {t.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Image picker */}
        <Field icon={Camera} label="صورة الإعلان">
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }} className="scrollbar-hide">
            {/* Show uploaded image if exists */}
            {uploadedImage && (
              <div style={{ position: 'relative', width: 80, height: 80, borderRadius: RADIUS.lg, overflow: 'hidden', flexShrink: 0, border: `3px solid ${COLORS.primary}` }}>
                <img src={uploadedImage} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={removeUploadedImage} style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
                  <X size={12} style={{ color: '#fff' }} />
                </button>
              </div>
            )}
            {/* Sample images - only show if no custom image uploaded */}
            {!uploadedImage && SAMPLE_IMAGES.map((src, i) => (
              <div key={i} onClick={() => setImgIdx(i)} style={{ width: 80, height: 80, borderRadius: RADIUS.lg, overflow: 'hidden', flexShrink: 0, cursor: 'pointer', border: imgIdx === i ? `3px solid ${COLORS.primary}` : `2px solid ${COLORS.border}`, transition: 'border 0.15s' }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
            {/* Upload button */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            <div onClick={() => fileInputRef.current?.click()} style={{ width: 80, height: 80, borderRadius: RADIUS.lg, flexShrink: 0, background: uploading ? COLORS.primary100 : COLORS.cardAlt, border: `2px dashed ${COLORS.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: uploading ? 'wait' : 'pointer' }}>
              {uploading ? (
                <>
                  <div style={{ width: 20, height: 20, border: `2px solid ${COLORS.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: 9, color: COLORS.textTertiary }}>جاري الرفع...</span>
                </>
              ) : (
                <>
                  <Upload size={20} style={{ color: COLORS.textTertiary }} />
                  <span style={{ fontSize: 9, color: COLORS.textTertiary, textAlign: 'center' }}>رفع صورة</span>
                </>
              )}
            </div>
          </div>
        </Field>

        {/* Title */}
        <Field icon={FileText} label="عنوان الإعلان *">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="مثلاً: طاجين مغربي يدوي…" style={{ ...inputStyle, direction: 'rtl' }} />
        </Field>

        {/* Description */}
        <Field icon={FileText} label="الوصف">
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="اكتب تفاصيل إعلانك هنا…" rows={3} style={{ ...inputStyle, resize: 'none', direction: 'rtl', lineHeight: 1.6 }} />
        </Field>

        {/* Price */}
        <Field icon={Tag} label="السعر (اختياري)">
          <input value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="0 = بالاتفاق" style={{ ...inputStyle }} />
        </Field>

        {/* City */}
        <Field icon={MapPin} label="المدينة *">
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowCity(v => !v)} style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ fontSize: 13, color: city ? COLORS.textPrimary : COLORS.textTertiary }}>{city || 'اختر مدينة'}</span>
              <ChevronDown size={16} style={{ color: COLORS.textTertiary }} />
            </button>
            {showCity && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: COLORS.card, borderRadius: RADIUS.lg, boxShadow: SHADOW.lg, border: `1px solid ${COLORS.border}`, zIndex: 100, maxHeight: 200, overflowY: 'auto' }}>
                {MOROCCAN_CITIES.filter(c => c !== 'All Cities').map(c => (
                  <button key={c} onClick={() => { setCity(c); setShowCity(false); }}
                    style={{ width: '100%', padding: '10px 14px', textAlign: 'right', fontSize: 13, color: city === c ? COLORS.primary : COLORS.textPrimary, fontWeight: city === c ? 800 : 500, background: city === c ? COLORS.primary100 : 'transparent', borderBottom: `1px solid ${COLORS.borderLight}` }}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Field>

        {/* Phone */}
        <Field icon={Phone} label="رقم التواصل">
          <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+212 6XX XXX XXX" style={{ ...inputStyle }} />
        </Field>
      </div>

      {/* Submit */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: COLORS.card, borderTop: `1px solid ${COLORS.border}`, padding: '12px 16px', zIndex: 100 }}>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{ width: '100%', height: 52, background: canSubmit ? COLORS.primary : COLORS.border, color: '#fff', fontWeight: 900, fontSize: 15, borderRadius: RADIUS.lg, boxShadow: canSubmit ? SHADOW.primary : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          🚀 نشر الإعلان مجاناً
        </button>
      </div>
    </div>
  );
}
