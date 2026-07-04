import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { COLORS, RADIUS, SHADOW } from '@/theme';
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, ShoppingBag, CheckCircle } from 'lucide-react';

function Input({ icon: Icon, type, placeholder, value, onChange }: {
  icon: typeof Mail; type: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: COLORS.cardAlt, border: `1.5px solid ${COLORS.border}`, borderRadius: RADIUS.lg, padding: '0 14px', height: 50, direction: 'rtl' }}>
      <Icon size={17} style={{ color: COLORS.textTertiary, flexShrink: 0 }} />
      <input
        type={isPass && show ? 'text' : type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        dir="auto"
        style={{ flex: 1, background: 'none', fontSize: 14, color: COLORS.textPrimary, border: 'none', outline: 'none', direction: 'ltr', textAlign: 'left' }}
      />
      {isPass && (
        <button type="button" onClick={() => setShow(v => !v)} style={{ color: COLORS.textTertiary, lineHeight: 0 }}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
}

export function WelcomeScreen() {
  const nav = useNavigate();
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 400 }}>
        <img src="https://images.pexels.com/photos/2574319/pexels-photo-2574319.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.72) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 48, left: 0, right: 0, padding: '0 28px', direction: 'rtl' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, background: COLORS.primary, borderRadius: RADIUS.md, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={22} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>SoukPro</span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', lineHeight: 1.2, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            سوق المغرب<br />للحرف والإعلانات
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', margin: 0, lineHeight: 1.6 }}>
            اشتري وبيع مع آلاف الحرفيين والبائعين في المغرب
          </p>
        </div>
      </div>
      <div style={{ padding: '28px 24px 40px', background: COLORS.card, display: 'flex', flexDirection: 'column', gap: 12, direction: 'rtl' }}>
        <button onClick={() => nav('/login')} style={{ height: 52, background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: RADIUS.lg, boxShadow: SHADOW.primary }}>
          تسجيل الدخول
        </button>
        <button onClick={() => nav('/register')} style={{ height: 52, background: COLORS.cardAlt, color: COLORS.textPrimary, fontWeight: 700, fontSize: 15, borderRadius: RADIUS.lg, border: `1.5px solid ${COLORS.border}` }}>
          إنشاء حساب جديد
        </button>
        <button onClick={() => nav('/home')} style={{ fontSize: 13, color: COLORS.textTertiary, marginTop: 4 }}>
          المتابعة كزائر
        </button>
      </div>
    </div>
  );
}

export function LoginScreen() {
  const nav = useNavigate();
  const { login, resetPassword } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) { setError('يرجى إدخال البريد الإلكتروني'); return; }
    if (!password.trim()) { setError('يرجى إدخال كلمة المرور'); return; }
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.error) setError(result.error);
    else nav('/home', { replace: true });
  };

  const handleReset = async () => {
    if (!email.trim()) { setError('يرجى إدخال البريد الإلكتروني أولاً'); return; }
    setResetLoading(true);
    setError('');
    const result = await resetPassword(email);
    setResetLoading(false);
    if (result.error) setError(result.error);
    else setResetSent(true);
  };

  if (resetSent) {
    return (
      <div style={{ padding: '0 24px', paddingTop: 60, background: COLORS.background, minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
        <div style={{ width: 80, height: 80, background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <CheckCircle size={40} style={{ color: '#4caf50' }} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 12px', textAlign: 'center' }}>تم إرسال رابط الاسترداد</h2>
        <p style={{ fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 28, lineHeight: 1.6 }}>
          راجع بريدك الإلكتروني <strong>{email}</strong> واضغط على الرابط لتغيير كلمة المرور.
        </p>
        <button onClick={() => { setForgotMode(false); setResetSent(false); }} style={{ height: 48, padding: '0 28px', background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: RADIUS.lg, boxShadow: SHADOW.primary }}>
          العودة لتسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 24px', paddingTop: 60, background: COLORS.background, minHeight: '100%', display: 'flex', flexDirection: 'column', direction: 'rtl' }}>
      <button onClick={() => nav('/welcome')} style={{ alignSelf: 'flex-start', marginBottom: 28, color: COLORS.textSecondary, lineHeight: 0 }}>
        <ArrowRight size={22} />
      </button>

      {forgotMode ? (
        <>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 6px', letterSpacing: '-0.02em' }}>استرداد كلمة المرور</h2>
          <p style={{ fontSize: 14, color: COLORS.textSecondary, margin: '0 0 32px' }}>أدخل بريدك الإلكتروني وسنرسل لك رابط التغيير</p>
          <Input icon={Mail} type="email" placeholder="البريد الإلكتروني" value={email} onChange={(v) => { setEmail(v); setError(''); }} />
          {error && <p style={{ color: '#e53935', fontSize: 13, marginTop: 12, textAlign: 'center' }}>{error}</p>}
          <button
            onClick={handleReset}
            disabled={resetLoading}
            style={{ height: 52, background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: RADIUS.lg, boxShadow: SHADOW.primary, marginTop: 24, opacity: resetLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {resetLoading && <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
            {resetLoading ? 'جاري الإرسال...' : 'إرسال رابط الاسترداد'}
          </button>
          <button onClick={() => { setForgotMode(false); setError(''); }} style={{ marginTop: 16, fontSize: 13, color: COLORS.textSecondary, textAlign: 'center' }}>
            رجوع لتسجيل الدخول
          </button>
        </>
      ) : (
        <>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 6px', letterSpacing: '-0.02em' }}>مرحباً بعودتك 👋</h2>
          <p style={{ fontSize: 14, color: COLORS.textSecondary, margin: '0 0 32px' }}>سجل دخولك لحسابك في SoukPro</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input icon={Mail} type="email" placeholder="البريد الإلكتروني" value={email} onChange={(v) => { setEmail(v); setError(''); }} />
            <Input icon={Lock} type="password" placeholder="كلمة المرور" value={password} onChange={(v) => { setPassword(v); setError(''); }} />
            <button onClick={() => { setForgotMode(true); setError(''); }} style={{ alignSelf: 'flex-end', fontSize: 13, color: COLORS.primary, fontWeight: 600 }}>
              نسيت كلمة المرور؟
            </button>
          </div>
          {error && <p style={{ color: '#e53935', fontSize: 13, marginTop: 12, textAlign: 'center' }}>{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ height: 52, background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: RADIUS.lg, boxShadow: SHADOW.primary, marginTop: 24, opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {loading && <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 13, color: COLORS.textSecondary, marginTop: 20 }}>
            ما عندكش حساب؟{' '}
            <button onClick={() => nav('/register')} style={{ color: COLORS.primary, fontWeight: 700 }}>إنشاء حساب</button>
          </p>
        </>
      )}
    </div>
  );
}

export function RegisterScreen() {
  const nav = useNavigate();
  const { register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) { setError('يرجى إدخال الاسم الكامل'); return; }
    if (!email.trim()) { setError('يرجى إدخال البريد الإلكتروني'); return; }
    if (!password.trim()) { setError('يرجى إدخال كلمة المرور'); return; }
    if (password.length < 6) { setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return; }
    setLoading(true);
    setError('');
    const result = await register(name, email, password);
    setLoading(false);
    if (result.error) setError(result.error);
    else if (result.needsConfirmation) setSuccess(true);
    else nav('/home', { replace: true });
  };

  if (success) {
    return (
      <div style={{ padding: '0 24px', paddingTop: 60, background: COLORS.background, minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
        <div style={{ width: 80, height: 80, background: '#4caf50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Mail size={40} style={{ color: '#fff' }} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 12px', textAlign: 'center' }}>تم إنشاء الحساب بنجاح! ✅</h2>
        <p style={{ fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 1.6 }}>
          تم إرسال رسالة تأكيد لبريدك الإلكتروني. راجع صندوق الوارد وأكد الحساب باش تقدر تدخل.
        </p>
        <button onClick={() => nav('/login')} style={{ height: 52, background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: RADIUS.lg, boxShadow: SHADOW.primary, padding: '0 32px' }}>
          الرجوع لتسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 24px', paddingTop: 60, background: COLORS.background, minHeight: '100%', display: 'flex', flexDirection: 'column', direction: 'rtl' }}>
      <button onClick={() => nav('/welcome')} style={{ alignSelf: 'flex-start', marginBottom: 28, color: COLORS.textSecondary, lineHeight: 0 }}>
        <ArrowRight size={22} />
      </button>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 6px', letterSpacing: '-0.02em' }}>إنشاء حساب جديد ✨</h2>
      <p style={{ fontSize: 14, color: COLORS.textSecondary, margin: '0 0 32px' }}>انضم لآلاف المستخدمين في المغرب</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input icon={User} type="text" placeholder="الاسم الكامل" value={name} onChange={(v) => { setName(v); setError(''); }} />
        <Input icon={Mail} type="email" placeholder="البريد الإلكتروني" value={email} onChange={(v) => { setEmail(v); setError(''); }} />
        <Input icon={Lock} type="password" placeholder="كلمة المرور (6 أحرف على الأقل)" value={password} onChange={(v) => { setPassword(v); setError(''); }} />
      </div>
      {error && <p style={{ color: '#e53935', fontSize: 13, marginTop: 12, textAlign: 'center' }}>{error}</p>}
      <button
        onClick={handleRegister}
        disabled={loading}
        style={{ height: 52, background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: RADIUS.lg, boxShadow: SHADOW.primary, marginTop: 24, opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        {loading && <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
        {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
      </button>
      <p style={{ textAlign: 'center', fontSize: 13, color: COLORS.textSecondary, marginTop: 20 }}>
        عندك حساب ديجا؟{' '}
        <button onClick={() => nav('/login')} style={{ color: COLORS.primary, fontWeight: 700 }}>سجل دخولك</button>
      </p>
    </div>
  );
}
